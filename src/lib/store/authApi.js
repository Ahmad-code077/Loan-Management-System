import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { endpoints } from './endpoints';

const mutex = new Mutex();

// Helper function to decode and analyze JWT
const analyzeToken = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;
    const timeUntilExpiry = payload.exp - currentTime;

    return { payload, isExpired, timeUntilExpiry };
  } catch (error) {
    return null;
  }
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : null;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Only set Content-Type for non-FormData requests
    // FormData requests should not have Content-Type header set manually
    if (
      !headers.get('Content-Type') &&
      endpoint !== 'uploadDocument' &&
      endpoint !== 'updateDocument'
    ) {
      headers.set('Content-Type', 'application/json');
    }

    headers.set('Accept', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await rawBaseQuery(args, api, extraOptions);

  // Check if we need to refresh the token
  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 419)
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('refresh_token')
            : null;

        if (!refreshToken) {
          clearAuthData();
          return result;
        }

        // Analyze refresh token before using it
        const refreshAnalysis = analyzeToken(refreshToken);

        if (!refreshAnalysis) {
          clearAuthData();
          return result;
        }

        if (refreshAnalysis.isExpired) {
          clearAuthData();
          return result;
        }

        // 🔍 PRESERVE USER DATA BEFORE REFRESH
        const existingUserData = localStorage.getItem('user_data');

        // Create refresh request payload
        const refreshRequestPayload = {
          url: '/api/token/refresh/',
          method: 'POST',
          body: { refresh: refreshToken },
        };

        // Create a custom query for refresh that doesn't include Authorization header
        const refreshQuery = fetchBaseQuery({
          baseUrl: process.env.NEXT_PUBLIC_API_URL,
          prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            return headers;
          },
        });

        const refreshResult = await refreshQuery(
          refreshRequestPayload,
          api,
          extraOptions
        );

        if (refreshResult.data && refreshResult.data.access) {
          // Store new tokens
          localStorage.setItem('access_token', refreshResult.data.access);
          if (refreshResult.data.refresh) {
            localStorage.setItem('refresh_token', refreshResult.data.refresh);
          }

          // 🔧 RESTORE USER DATA AFTER TOKEN REFRESH
          if (existingUserData) {
            localStorage.setItem('user_data', existingUserData);
          }

          // Trigger auth status update
          window.dispatchEvent(new Event('auth-refresh'));

          // Retry original request
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          // Clear auth data if refresh failed
          clearAuthData();
        }
      } catch (error) {
        clearAuthData();
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};
const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'access_token',
        newValue: null,
      })
    );
  }
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Loan', 'Document', 'LoanType'],
  endpoints,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useGetUsersQuery,
  useGetLoansQuery,
  useGetLoanDetailsQuery,
  useApproveLoanMutation,
  useRejectLoanMutation,
  useGetDocumentsQuery,
  useGetDocumentDetailsQuery,
  useAddLoanTypeMutation,
  useGetLoanTypesQuery,
  useUpdateLoanTypeMutation,
  useDeleteLoanTypeMutation,
  useApplyLoanMutation,
  useGetUserLoansQuery,

  useUploadDocumentMutation,
  useGetUserDocumentsQuery,
  useUpdateDocumentMutation,
} = authApi;

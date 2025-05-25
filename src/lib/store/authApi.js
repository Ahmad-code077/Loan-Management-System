import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    // Add other headers if needed
    return headers;
  },

  headers: {
    'Content-Type': 'application/json',
  },
});

// Base query with automatic token refresh
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get 401, try to refresh token
  if (result.error && result.error.status === 401) {
    console.log('Access token expired, trying to refresh...');

    // Try to refresh token
    const refreshResult = await baseQuery(
      { url: '/api/token/refresh/', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      console.log('Token refreshed successfully');
      // Refresh successful, retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log('Token refresh failed');
      // Refresh failed - user needs to login again
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/token/',
        method: 'POST',
        body: credentials,
        credentials: 'include', // Ensure this is here
      }),
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: '/register/',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/api/logout/',
        method: 'POST',
      }),
    }),

    getProfile: builder.query({
      query: () => '/api/profile/',
      providesTags: ['User'],
    }),

    // Add your other endpoints here
    getUsers: builder.query({
      query: () => '/api/admin/users/',
    }),

    getLoans: builder.query({
      query: () => '/api/admin/loan-list/',
    }),

    getLoanDetails: builder.query({
      query: (id) => `/api/admin/loan/${id}/`,
    }),

    approveLoan: builder.mutation({
      query: (id) => ({
        url: `/api/admin/approve-loan/${id}/`,
        method: 'POST',
      }),
    }),

    rejectLoan: builder.mutation({
      query: (id) => ({
        url: `/api/admin/reject-loan/${id}/`,
        method: 'POST',
      }),
    }),

    getDocuments: builder.query({
      query: () => '/api/admin/documents/',
    }),

    getDocumentDetails: builder.query({
      query: (id) => `/api/admin/document/${id}/`,
    }),

    addLoanType: builder.mutation({
      query: (loanType) => ({
        url: '/api/admin/loan-types/',
        method: 'POST',
        body: loanType,
      }),
    }),

    getLoanTypes: builder.query({
      query: () => '/api/admin/loan-types/',
    }),
  }),
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
} = authApi;

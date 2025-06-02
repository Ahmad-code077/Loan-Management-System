export const endpoints = (builder) => ({
  login: builder.mutation({
    query: (credentials) => ({
      url: '/api/token/',
      method: 'POST',
      body: credentials,
    }),
    transformResponse: (response) => {
      // Store tokens in localStorage on successful login
      if (response.access && response.refresh) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          if (response.user) {
            localStorage.setItem('user_data', JSON.stringify(response.user));
          }
          console.log('Tokens stored in localStorage');
        }
      }
      return response;
    },
    invalidatesTags: ['User'],
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
    transformResponse: (response) => {
      // Clear tokens from localStorage on logout
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');

        console.log('Tokens cleared from localStorage');
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'access_token',
            newValue: null,
          })
        );
      }
      return response;
    },
    invalidatesTags: ['User'],
  }),

  getProfile: builder.query({
    query: () => '/api/profile/',
    providesTags: ['User'],
  }),

  getUsers: builder.query({
    query: () => '/api/admin/users/',
    providesTags: ['User'],
  }),

  getLoans: builder.query({
    query: () => '/api/admin/loan-list/',
    providesTags: ['Loan'],
  }),

  getLoanDetails: builder.query({
    query: (id) => `/api/admin/loan/${id}/`,
    providesTags: (result, error, id) => [{ type: 'Loan', id }],
  }),

  approveLoan: builder.mutation({
    query: (id) => ({
      url: `/api/admin/approve-loan/${id}/`,
      method: 'POST',
    }),
    invalidatesTags: (result, error, id) => [
      { type: 'Loan', id },
      { type: 'Loan', id: 'LIST' },
    ],
  }),

  rejectLoan: builder.mutation({
    query: ({ id, reason }) => ({
      url: `/api/admin/reject-loan/${id}/`,
      method: 'POST',
      body: { reason },
    }),
    invalidatesTags: (result, error, { id }) => [
      { type: 'Loan', id },
      { type: 'Loan', id: 'LIST' },
    ],
  }),

  getDocuments: builder.query({
    query: () => '/api/admin/documents/',
    providesTags: ['Document'],
  }),

  getDocumentDetails: builder.query({
    query: (id) => `/api/admin/document/${id}/`,
    providesTags: (result, error, id) => [{ type: 'Document', id }],
  }),

  addLoanType: builder.mutation({
    query: (loanType) => ({
      url: '/api/admin/loan-types/',
      method: 'POST',
      body: loanType,
    }),
    invalidatesTags: ['LoanType'],
  }),

  getLoanTypes: builder.query({
    query: () => '/api/admin/loan-types/',
    providesTags: ['LoanType'],
  }),

  updateLoanType: builder.mutation({
    query: ({ id, ...loanType }) => ({
      url: `/api/admin/loan-types/${id}/`,
      method: 'PUT',
      body: loanType,
    }),
    invalidatesTags: (result, error, { id }) => [
      { type: 'LoanType', id },
      { type: 'LoanType', id: 'LIST' },
    ],
  }),

  deleteLoanType: builder.mutation({
    query: (id) => ({
      url: `/api/admin/loan-types/${id}/`,
      method: 'DELETE',
    }),
    invalidatesTags: ['LoanType'],
  }),
  applyLoan: builder.mutation({
    query: (loanData) => ({
      url: '/apply-loan/',
      method: 'POST',
      body: loanData,
    }),
    invalidatesTags: ['Loan'],
  }),
  getUserLoans: builder.query({
    query: () => '/my-loans/',
    providesTags: ['Loan'],
  }),

  // uploadDocument: builder.mutation({
  //   query: (documentData) => {
  //     const formData = new FormData();
  //     formData.append('document_type', documentData.document_type);
  //     formData.append('file', documentData.file);

  //     return {
  //       url: '/upload-document/',
  //       method: 'POST',
  //       body: formData,
  //       // Don't set Content-Type, let the browser set it for FormData
  //       prepareHeaders: (headers) => {
  //         // Remove Content-Type to let browser set it with boundary for multipart/form-data
  //         headers.delete('Content-Type');
  //         return headers;
  //       },
  //     };
  //   },
  //   invalidatesTags: ['Document'],
  // }),

  uploadDocument: builder.mutation({
    query: (documentData) => {
      const formData = new FormData();
      formData.append('document_type', documentData.document_type);
      formData.append('file', documentData.file);

      return {
        url: '/upload-document/',
        method: 'POST',
        body: formData,
        // Don't set any headers for FormData - let the browser handle it
      };
    },
    invalidatesTags: ['Document'],
  }),

  // Fixed endpoint name
  getUserDocuments: builder.query({
    query: () => '/my-documents/',
    providesTags: ['Document'],
  }),

  updateDocument: builder.mutation({
    query: ({ id, documentData }) => {
      const formData = new FormData();
      formData.append('document_type', documentData.document_type);
      formData.append('file', documentData.file);

      return {
        url: `/my-documents/${id}/`,
        method: 'PUT',
        body: formData,
        prepareHeaders: (headers) => {
          headers.delete('Content-Type');
          return headers;
        },
      };
    },
    invalidatesTags: ['Document'],
  }),
});

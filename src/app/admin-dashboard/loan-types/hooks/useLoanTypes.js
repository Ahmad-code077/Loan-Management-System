'use client';

import {
  useGetLoanTypesQuery,
  useAddLoanTypeMutation,
  useUpdateLoanTypeMutation,
  useDeleteLoanTypeMutation,
} from '@/lib/store/authApi';

export const useLoanTypes = () => {
  // ✅ Use RTK Query hooks instead of custom implementation
  const {
    data: loanTypes = [],
    isLoading: loading,
    error,
    refetch,
  } = useGetLoanTypesQuery();

  const [addLoanTypeMutation] = useAddLoanTypeMutation();
  const [updateLoanTypeMutation] = useUpdateLoanTypeMutation();
  const [deleteLoanTypeMutation] = useDeleteLoanTypeMutation();

  // ✅ Add loan type function
  const addLoanType = async (loanTypeData) => {
    try {
      console.log('Adding loan type:', loanTypeData);

      const result = await addLoanTypeMutation(loanTypeData).unwrap();
      console.log('Add loan type success:', result);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Add loan type error:', error);
      return {
        success: false,
        error: error,
      };
    }
  };

  // ✅ FIXED: Update loan type function - match endpoint parameter names
  const updateLoanType = async (id, loanTypeData) => {
    try {
      console.log('Updating loan type with ID:', id);
      console.log('Update data:', loanTypeData);

      // ✅ FIX: Use 'loanType' instead of 'loanTypeData' to match endpoint
      const result = await updateLoanTypeMutation({
        id: id,
        loanType: loanTypeData, // ✅ Changed from 'loanTypeData' to 'loanType'
      }).unwrap();

      console.log('Update loan type success:', result);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Update loan type error:', error);
      return {
        success: false,
        error: error,
      };
    }
  };

  // ✅ Delete loan type function
  const deleteLoanType = async (id) => {
    try {
      console.log('Deleting loan type with ID:', id);

      const result = await deleteLoanTypeMutation(id).unwrap();
      console.log('Delete loan type success:', result);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Delete loan type error:', error);
      return {
        success: false,
        error: error,
      };
    }
  };

  return {
    loanTypes,
    loading,
    error,
    addLoanType,
    updateLoanType,
    deleteLoanType,
    refetch,
  };
};

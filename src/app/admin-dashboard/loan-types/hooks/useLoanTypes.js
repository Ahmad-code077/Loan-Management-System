import { useState } from 'react';
import {
  useGetLoanTypesQuery,
  useAddLoanTypeMutation,
  useUpdateLoanTypeMutation,
  useDeleteLoanTypeMutation,
} from '@/lib/store/authApi';
import { toast } from '@/hooks/use-toast';

export const useLoanTypes = () => {
  const [loading, setLoading] = useState(false);

  // Real API hooks
  const {
    data: loanTypesData = [],
    isLoading: queryLoading,
    refetch,
  } = useGetLoanTypesQuery();

  const [addLoanTypeMutation] = useAddLoanTypeMutation();
  const [updateLoanTypeMutation] = useUpdateLoanTypeMutation();
  const [deleteLoanTypeMutation] = useDeleteLoanTypeMutation();

  const addLoanType = async (newLoanType) => {
    setLoading(true);
    try {
      const result = await addLoanTypeMutation(newLoanType).unwrap();

      toast({
        title: 'Success',
        description: 'Loan type added successfully.',
        variant: 'default',
      });

      // Refetch to get updated list
      await refetch();

      return { success: true, data: result };
    } catch (error) {
      console.error('Add loan type error:', error);

      toast({
        title: 'Error',
        description: error?.data?.message || 'Failed to add loan type.',
        variant: 'destructive',
      });

      return { success: false, error: error?.data?.message || error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateLoanType = async (id, updatedLoanType) => {
    setLoading(true);
    try {
      const result = await updateLoanTypeMutation({
        id,
        ...updatedLoanType,
      }).unwrap();

      toast({
        title: 'Success',
        description: 'Loan type updated successfully.',
        variant: 'default',
      });

      // Refetch to get updated list
      await refetch();

      return { success: true, data: result };
    } catch (error) {
      console.error('Update loan type error:', error);

      toast({
        title: 'Error',
        description: error?.data?.message || 'Failed to update loan type.',
        variant: 'destructive',
      });

      return { success: false, error: error?.data?.message || error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteLoanType = async (id) => {
    setLoading(true);
    try {
      await deleteLoanTypeMutation(id).unwrap();

      toast({
        title: 'Success',
        description: 'Loan type deleted successfully.',
        variant: 'default',
      });

      // Refetch to get updated list
      await refetch();

      return { success: true };
    } catch (error) {
      console.error('Delete loan type error:', error);

      toast({
        title: 'Error',
        description: error?.data?.message || 'Failed to delete loan type.',
        variant: 'destructive',
      });

      return { success: false, error: error?.data?.message || error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loanTypes: loanTypesData,
    loading: loading || queryLoading,
    addLoanType,
    updateLoanType,
    deleteLoanType,
    refetch,
  };
};

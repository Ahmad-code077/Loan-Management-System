import { useState } from 'react';

const INITIAL_LOAN_TYPES = [
  {
    id: 1,
    name: 'Student Loan',
    interest_rate: '25.00',
  },
  {
    id: 2,
    name: 'personal loan',
    interest_rate: '20.00',
  },
  {
    id: 3,
    name: 'jahaz loan',
    interest_rate: '20.00',
  },
];

export const useLoanTypes = () => {
  const [loanTypes, setLoanTypes] = useState(INITIAL_LOAN_TYPES);
  const [loading, setLoading] = useState(false);

  const addLoanType = async (newLoanType) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const maxId = Math.max(...loanTypes.map((type) => type.id), 0);
      const loanTypeWithId = {
        ...newLoanType,
        id: maxId + 1,
      };

      setLoanTypes((prev) => [...prev, loanTypeWithId]);
      return { success: true, data: loanTypeWithId };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateLoanType = async (id, updatedLoanType) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setLoanTypes((prev) =>
        prev.map((type) =>
          type.id === id ? { ...type, ...updatedLoanType } : type
        )
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteLoanType = async (id) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setLoanTypes((prev) => prev.filter((type) => type.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loanTypes,
    loading,
    addLoanType,
    updateLoanType,
    deleteLoanType,
  };
};

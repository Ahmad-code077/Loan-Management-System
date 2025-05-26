export const validateLoanType = (loanType) => {
  const errors = {};

  if (!loanType.name || loanType.name.trim().length === 0) {
    errors.name = 'Loan type name is required';
  }

  if (!loanType.interest_rate || parseFloat(loanType.interest_rate) <= 0) {
    errors.interest_rate = 'Interest rate must be greater than 0';
  }

  if (parseFloat(loanType.interest_rate) > 100) {
    errors.interest_rate = 'Interest rate cannot exceed 100%';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const formatInterestRate = (rate) => {
  return `${parseFloat(rate).toFixed(2)}%`;
};

export const formatLoanTypeName = (name) => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const generateId = (existingTypes) => {
  const maxId = Math.max(...existingTypes.map((type) => type.id), 0);
  return maxId + 1;
};

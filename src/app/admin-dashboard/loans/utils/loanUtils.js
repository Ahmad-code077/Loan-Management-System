// Static loan types for now (will be replaced with API data later)
const STATIC_LOAN_TYPES = [
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

export const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Dynamic loan type functions - easy to replace with API later
export const getLoanTypeName = (typeId, loanTypes = STATIC_LOAN_TYPES) => {
  const loanType = loanTypes.find((type) => type.id === typeId);
  return loanType ? loanType.name : 'Unknown Loan Type';
};

export const getLoanTypeInterestRate = (
  typeId,
  loanTypes = STATIC_LOAN_TYPES
) => {
  const loanType = loanTypes.find((type) => type.id === typeId);
  return loanType ? parseFloat(loanType.interest_rate) : 0;
};

export const getAllLoanTypes = (loanTypes = STATIC_LOAN_TYPES) => {
  return loanTypes;
};

// Function to format loan type name properly
export const formatLoanTypeName = (name) => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getStatusIcon = (status) => {
  switch (status) {
    case 'approved':
      return 'FiCheck';
    case 'rejected':
      return 'FiX';
    default:
      return 'FiFileText';
  }
};

export const formatCurrency = (amount) => {
  return `₨ ${amount.toLocaleString()}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Validation functions for loan data
export const validateLoanAmount = (
  amount,
  loanTypeId,
  loanTypes = STATIC_LOAN_TYPES
) => {
  const loanType = loanTypes.find((type) => type.id === loanTypeId);
  // Add validation logic here based on loan type
  return amount > 0;
};

export const calculateTotalPayable = (
  principal,
  interestRate,
  durationInMonths
) => {
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalInterest = principal * monthlyInterestRate * durationInMonths;
  return principal + totalInterest;
};

export const calculateMonthlyInstallment = (totalPayable, durationInMonths) => {
  return Math.round(totalPayable / durationInMonths);
};

// API Integration Helper Functions (for future use)
export const mapApiLoanToLocal = (apiLoan, loanTypes) => {
  return {
    ...apiLoan,
    loan_type_name: getLoanTypeName(apiLoan.loan_type, loanTypes),
    formatted_amount: formatCurrency(apiLoan.amount),
    formatted_total_payable: formatCurrency(apiLoan.total_payable),
    formatted_monthly_installment: formatCurrency(apiLoan.monthly_installment),
    formatted_created_at: formatDate(apiLoan.created_at),
    formatted_updated_at: formatDate(apiLoan.updated_at),
  };
};

// Future API integration hook structure
export const createLoanTypesHook = () => {
  // This will be replaced with actual API call
  return {
    data: STATIC_LOAN_TYPES,
    loading: false,
    error: null,
    refetch: () => Promise.resolve(STATIC_LOAN_TYPES),
  };
};

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

export const getLoanTypeName = (type) => {
  switch (type) {
    case 1:
      return 'Personal Loan';
    case 2:
      return 'Business Loan';
    case 3:
      return 'Home Loan';
    default:
      return 'Other';
  }
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

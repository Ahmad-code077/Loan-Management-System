export const DOCUMENT_TYPES = ['CNIC Front', 'CNIC Back', 'Salary Slip'];

export const getDocumentTypeIcon = (documentType) => {
  switch (documentType) {
    case 'CNIC Front':
      return 'FiCreditCard';
    case 'CNIC Back':
      return 'FiCreditCard';
    case 'Salary Slip':
      return 'FiFileText';
    default:
      return 'FiFile';
  }
};

export const getDocumentTypeColor = (documentType) => {
  switch (documentType) {
    case 'CNIC Front':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'CNIC Back':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Salary Slip':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
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

export const formatUserName = (user) => {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.username || 'Unknown User';
};

export const getFileExtension = (fileUrl) => {
  return fileUrl.split('.').pop().toLowerCase();
};

export const isImageFile = (fileUrl) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  return imageExtensions.includes(getFileExtension(fileUrl));
};

export const getFileSizeFromUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    return contentLength ? parseInt(contentLength) : null;
  } catch (error) {
    return null;
  }
};

export const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown size';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
};

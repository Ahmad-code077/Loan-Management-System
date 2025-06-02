import { FiFile } from 'react-icons/fi';

export const DOCUMENT_TYPES = [
  { value: 'cnic_front', label: 'CNIC Front' },
  { value: 'cnic_back', label: 'CNIC Back' },
  { value: 'salary_slip', label: 'Salary Slip' },
];

export const API_TYPE_TO_VALUE = {
  'CNIC Front': 'cnic_front',
  'CNIC Back': 'cnic_back',
  'Salary Slip': 'salary_slip',
};

export const validateFile = (file) => {
  if (!file) return 'File is required';

  // File size validation (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return 'File size must be less than 5MB';
  }

  // File type validation
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (!allowedTypes.includes(file.type)) {
    return 'File must be an image (JPEG, PNG, GIF, BMP, WebP) or document (PDF, DOC, DOCX)';
  }

  return true;
};

export const getFileIcon = (fileUrl, docType) => {
  if (!fileUrl) return <FiFile className='h-8 w-8 text-gray-400' />;

  const extension = fileUrl.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return <FiFile className='h-8 w-8 text-red-500' />;
    case 'doc':
    case 'docx':
      return <FiFile className='h-8 w-8 text-blue-500' />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
      return <FiFile className='h-8 w-8 text-green-500' />;
    default:
      return <FiFile className='h-8 w-8 text-gray-400' />;
  }
};

export const scrollToElement = (elementId, offset = -80) => {
  setTimeout(() => {
    const element = document.getElementById(elementId);
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + offset;

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });

      // Add visual highlight temporarily
      element.style.transition = 'background-color 0.3s ease';
      element.style.backgroundColor = '#fef3c7';

      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 2000);
    }
  }, 100);
};

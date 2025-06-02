'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useUploadDocumentMutation,
  useGetUserDocumentsQuery,
  useUpdateDocumentMutation,
} from '@/lib/store/authApi';
import { authUtils } from '@/lib/auth/authUtils';
import {
  FiUpload,
  FiFile,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiLoader,
  FiEye,
  FiEdit3,
  FiShield,
} from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';

// Document types based on your Django model
const DOCUMENT_TYPES = [
  { value: 'cnic_front', label: 'CNIC Front' },
  { value: 'cnic_back', label: 'CNIC Back' },
  { value: 'salary_slip', label: 'Salary Slip' },
];

export default function DocumentUploadForm() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [documentToUpdate, setDocumentToUpdate] = useState(null);
  const { toast } = useToast();

  // API hooks
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadDocumentMutation();
  const [updateDocument, { isLoading: isUpdatingDoc }] =
    useUpdateDocumentMutation();
  const {
    data: userDocuments,
    refetch: refetchDocuments,
    isLoading: loadingDocuments,
    error: documentsError,
  } = useGetUserDocumentsQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      document_type: '',
      file: null,
    },
  });

  const file = watch('file');
  const documentType = watch('document_type');

  // Check if user already has this document type
  const existingDocument = userDocuments?.find((doc) => {
    const apiTypeToValue = {
      'CNIC Front': 'cnic_front',
      'CNIC Back': 'cnic_back',
      'Salary Slip': 'salary_slip',
    };
    return apiTypeToValue[doc.document_type] === documentType;
  });

  useEffect(() => {
    if (file && file[0]) {
      const selectedFileObj = file[0];
      setSelectedFile(selectedFileObj);

      // Create preview for images only
      if (selectedFileObj.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFileObj);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [file]);

  const validateFile = (file) => {
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

  // Handle document viewing
  const handleViewDocument = (document) => {
    if (document.file) {
      window.open(document.file, '_blank');
      toast({
        title: 'Document Opened',
        description: 'Document opened in new tab for viewing',
        variant: 'default',
      });
    }
  };

  // Handle document editing
  const handleEditDocument = (document) => {
    if (document.is_verified) {
      toast({
        title: 'Document Protected',
        description:
          'This document is verified and cannot be updated. Please contact admin to make changes.',
        variant: 'destructive',
      });
      return;
    }

    // Set the document for updating
    setDocumentToUpdate(document);
    setIsUpdating(true);

    // Convert API format to our format
    const apiTypeToValue = {
      'CNIC Front': 'cnic_front',
      'CNIC Back': 'cnic_back',
      'Salary Slip': 'salary_slip',
    };

    const documentTypeValue = apiTypeToValue[document.document_type];
    setValue('document_type', documentTypeValue);

    // Scroll to the document type selection
    setTimeout(() => {
      const element = window.document.getElementById('scroll-to-document-type');
      if (element) {
        const yOffset = -80;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

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

    toast({
      title: 'Ready to Update',
      description: `You can now update your ${document.document_type} document`,
      variant: 'default',
    });
  };

  // Cancel update mode
  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setDocumentToUpdate(null);
    reset();
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Get file icon based on file type
  const getFileIcon = (fileUrl, docType) => {
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

  const onSubmit = async (data) => {
    try {
      if (!selectedFile) {
        toast({
          title: 'File Required',
          description: 'Please select a file to upload',
          variant: 'destructive',
        });
        return;
      }

      // Validate file
      const fileValidation = validateFile(selectedFile);
      if (fileValidation !== true) {
        toast({
          title: 'Invalid File',
          description: fileValidation,
          variant: 'destructive',
        });
        return;
      }

      const formData = {
        document_type: data.document_type,
        file: selectedFile,
      };

      let result;

      if (isUpdating && documentToUpdate) {
        // Update existing document using my-documents/<int:pk>/ endpoint
        console.log('Updating document:', {
          id: documentToUpdate.id,
          document_type: data.document_type,
          fileName: selectedFile.name,
        });

        result = await updateDocument({
          id: documentToUpdate.id,
          documentData: formData,
        }).unwrap();

        toast({
          title: 'Update Successful',
          description: `Document updated successfully!`,
          variant: 'default',
        });
      } else {
        // Create new document
        console.log('Creating new document:', {
          document_type: data.document_type,
          fileName: selectedFile.name,
        });

        result = await uploadDocument(formData).unwrap();

        toast({
          title: 'Upload Successful',
          description: `Document uploaded successfully!`,
          variant: 'default',
        });
      }

      console.log('Operation completed successfully:', result);

      // Reset form and states
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsUpdating(false);
      setDocumentToUpdate(null);

      // Refetch user documents
      refetchDocuments();

      // Redirect to dashboard after delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Operation error details:', error);

      let errorMessage = `Failed to ${
        isUpdating ? 'update' : 'upload'
      } document. Please try again.`;
      let errorTitle = `${isUpdating ? 'Update' : 'Upload'} Failed`;

      // Handle different types of errors
      if (error?.status === 500) {
        errorTitle = 'Server Error';
        errorMessage =
          'Server error occurred. Please check your file format and try again.';
      } else if (error?.status === 413) {
        errorTitle = 'File Too Large';
        errorMessage =
          'File is too large. Please choose a file smaller than 5MB.';
      } else if (error?.status === 400) {
        errorTitle = 'Invalid Request';
        errorMessage =
          'Invalid file or document type. Please check your selection.';
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.detail) {
        errorMessage = error.data.detail;
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Get current user info
  const currentUser = authUtils.getCurrentUser();

  // Loading state
  if (loadingDocuments) {
    return (
      <div className='flex items-center justify-center p-8'>
        <FiLoader className='w-6 h-6 animate-spin text-primary mr-2' />
        <span>Loading your documents...</span>
      </div>
    );
  }

  // Error state for documents
  if (documentsError) {
    return (
      <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
        <div className='flex items-center gap-2 text-yellow-800'>
          <FiAlertCircle className='w-5 h-5' />
          <span>
            Unable to load existing documents. You can still upload new
            documents.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* User Info */}
      {currentUser && (
        <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
          <h3 className='font-medium text-blue-800 mb-2'>
            {isUpdating ? 'Update Document' : 'Upload Information'}
          </h3>
          <p className='text-sm text-blue-700'>
            {isUpdating ? 'Updating' : 'Uploading'} as:{' '}
            <span className='font-medium'>{currentUser.username}</span> (
            {currentUser.email})
          </p>
          <p className='text-xs text-blue-600 mt-1'>
            User ID: {currentUser.id}
          </p>
          {isUpdating && documentToUpdate && (
            <div className='mt-2 p-2 bg-blue-100 rounded'>
              <p className='text-xs text-blue-800'>
                Updating:{' '}
                <span className='font-medium'>
                  {documentToUpdate.document_type}
                </span>
              </p>
              <Button
                variant='outline'
                size='sm'
                onClick={handleCancelUpdate}
                className='mt-1 text-xs h-6 px-2'
              >
                Cancel Update
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Show user's current documents with actions */}
      {userDocuments && userDocuments.length > 0 && (
        <div className='bg-gray-50 p-4 rounded-lg border'>
          <h3 className='font-medium text-gray-800 mb-3'>
            Your Current Documents
          </h3>
          <div className='grid grid-cols-1 gap-4'>
            {userDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  doc.is_verified
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                } ${
                  isUpdating && documentToUpdate?.id === doc.id
                    ? 'ring-2 ring-blue-400 ring-opacity-50'
                    : ''
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='flex-shrink-0'>
                      {getFileIcon(doc.file, doc.document_type)}
                    </div>

                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        {doc.is_verified ? (
                          <FiShield className='w-4 h-4 text-green-600' />
                        ) : (
                          <FiAlertCircle className='w-4 h-4 text-yellow-600' />
                        )}
                        <span className='text-sm font-medium'>
                          {doc.document_type}
                        </span>
                        {isUpdating && documentToUpdate?.id === doc.id && (
                          <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                            Updating
                          </span>
                        )}
                      </div>
                      <p className='text-xs text-gray-600'>
                        {doc.is_verified
                          ? '✅ Verified'
                          : '⏳ Pending verification'}
                      </p>
                      <p className='text-xs text-gray-500'>
                        📅{' '}
                        {new Date(doc.uploaded_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {doc.file && (
                        <p className='text-xs text-gray-500 mt-1'>
                          📎 {doc.file.split('/').pop()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className='flex gap-2'>
                    {doc.file && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleViewDocument(doc)}
                        className='text-blue-600 hover:text-blue-800 border-blue-200 hover:bg-blue-50'
                      >
                        <FiEye className='w-4 h-4 mr-1' />
                        View
                      </Button>
                    )}

                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEditDocument(doc)}
                      disabled={
                        doc.is_verified ||
                        (isUpdating && documentToUpdate?.id !== doc.id)
                      }
                      className={
                        doc.is_verified
                          ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                          : isUpdating && documentToUpdate?.id === doc.id
                          ? 'text-blue-600 border-blue-400 bg-blue-50'
                          : 'text-orange-600 hover:text-orange-800 border-orange-200 hover:bg-orange-50'
                      }
                    >
                      {doc.is_verified ? (
                        <>
                          <FiShield className='w-4 h-4 mr-1' />
                          Protected
                        </>
                      ) : isUpdating && documentToUpdate?.id === doc.id ? (
                        <>
                          <FiEdit3 className='w-4 h-4 mr-1' />
                          Updating...
                        </>
                      ) : (
                        <>
                          <FiEdit3 className='w-4 h-4 mr-1' />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Type Warning */}
      {existingDocument && !isUpdating && (
        <div
          id='scroll-to-document-type'
          className={`p-4 rounded-lg border ${
            existingDocument.is_verified
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <div className='flex items-center gap-2 mb-2'>
            {existingDocument.is_verified ? (
              <FiShield className='w-5 h-5 text-green-600' />
            ) : (
              <FiAlertCircle className='w-5 h-5 text-yellow-600' />
            )}
            <h3
              className={`font-medium ${
                existingDocument.is_verified
                  ? 'text-green-800'
                  : 'text-yellow-800'
              }`}
            >
              Existing Document Found
            </h3>
          </div>
          <p
            className={`text-sm ${
              existingDocument.is_verified
                ? 'text-green-700'
                : 'text-yellow-700'
            }`}
          >
            You already have a {existingDocument.document_type} document.
            {existingDocument.is_verified
              ? ' 🔒 It is verified and cannot be updated.'
              : ' 📝 Use the Edit button above to update it instead of creating a new one.'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Document Type Selection */}
        <div id='scroll-to-document-type' className='scroll-mt-20'>
          <Label htmlFor='document_type' className='text-sm font-medium'>
            Document Type *
          </Label>
          <select
            id='document_type'
            {...register('document_type', {
              required: 'Document type is required',
            })}
            disabled={isUpdating}
            className={`w-full mt-1 rounded-md border p-2 bg-white ${
              errors.document_type ? 'border-red-500' : 'border-gray-300'
            } ${isUpdating ? 'bg-gray-100' : ''}`}
          >
            <option value=''>Select document type</option>
            {DOCUMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.document_type && (
            <p className='text-red-500 text-sm mt-1 flex items-center'>
              <FiX className='w-3 h-3 mr-1' />
              {errors.document_type.message}
            </p>
          )}
        </div>

        {/* File Upload */}
        <div>
          <Label htmlFor='file' className='text-sm font-medium'>
            Document File *
          </Label>
          <div className='mt-1'>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                selectedFile
                  ? 'border-green-300 bg-green-50'
                  : errors.file
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Input
                id='file'
                type='file'
                {...register('file', {
                  required: 'File is required',
                  validate: {
                    fileSize: (files) => {
                      if (!files || !files[0]) return true;
                      return (
                        files[0].size <= 5 * 1024 * 1024 ||
                        'File size must be less than 5MB'
                      );
                    },
                    fileType: (files) => {
                      if (!files || !files[0]) return true;
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
                      return (
                        allowedTypes.includes(files[0].type) ||
                        'File must be an image (JPEG, PNG, GIF, BMP, WebP) or document (PDF, DOC, DOCX)'
                      );
                    },
                  },
                })}
                className='hidden'
                accept='.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp'
              />
              <label
                htmlFor='file'
                className='cursor-pointer text-gray-600 hover:text-gray-800 flex flex-col items-center'
              >
                {selectedFile ? (
                  <FiCheck className='w-12 h-12 text-green-500 mb-2' />
                ) : (
                  <FiUpload className='w-12 h-12 text-gray-400 mb-2' />
                )}
                <span className='text-sm font-medium'>
                  {selectedFile
                    ? 'File Selected'
                    : 'Click to upload or drag and drop'}
                </span>
                <span className='text-xs text-gray-500 mt-1'>
                  {selectedFile
                    ? selectedFile.name
                    : 'Images (JPEG, PNG, GIF, BMP, WebP) or Documents (PDF, DOC, DOCX) - Max 5MB'}
                </span>
              </label>
            </div>

            {errors.file && (
              <p className='text-red-500 text-sm mt-2 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.file.message}
              </p>
            )}

            {/* File Preview */}
            {selectedFile && !errors.file && (
              <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                <h4 className='text-sm font-medium text-gray-900 mb-3'>
                  Selected File Preview:
                </h4>
                <div className='flex items-start gap-4'>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt='Preview'
                      className='h-24 w-24 object-cover rounded border'
                    />
                  ) : (
                    <div className='h-24 w-24 bg-gray-200 rounded border flex items-center justify-center'>
                      {getFileIcon(selectedFile.name, 'file')}
                    </div>
                  )}
                  <div className='flex-1 text-sm text-gray-600'>
                    <p className='font-medium'>📎 {selectedFile.name}</p>
                    <p>
                      📏 Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p>🔖 Type: {selectedFile.type}</p>
                    <p className='text-green-600 mt-2 flex items-center'>
                      <FiCheck className='w-3 h-3 mr-1' />
                      File is valid for {isUpdating ? 'update' : 'upload'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Guidelines */}
        <div className='bg-gray-50 p-4 rounded-lg border'>
          <h3 className='font-medium text-gray-800 mb-2'>📋 Guidelines</h3>
          <ul className='list-disc pl-5 text-sm text-gray-600 space-y-1'>
            <li>📷 Ensure the document is clear and all text is readable</li>
            <li>📏 File size should not exceed 5MB</li>
            <li>
              📄 Accepted formats: Images (JPEG, PNG, GIF, BMP, WebP) or
              Documents (PDF, DOC, DOCX)
            </li>
            <li>🔓 Only unverified documents can be updated</li>
            <li>🔒 Contact admin if you need to change a verified document</li>
            {isUpdating && (
              <li className='text-blue-600'>
                🔄 Updating existing document will replace the current file
              </li>
            )}
          </ul>
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          className='w-full py-3 text-lg font-semibold'
          disabled={
            isUploading ||
            isUpdatingDoc ||
            (existingDocument?.is_verified && !isUpdating) ||
            (!isUpdating && existingDocument && !existingDocument.is_verified)
          }
        >
          {isUploading || isUpdatingDoc ? (
            <>
              <FiLoader className='w-5 h-5 mr-2 animate-spin' />
              {isUpdating ? 'Updating Document...' : 'Uploading Document...'}
            </>
          ) : isUpdating ? (
            <>
              <FiUpload className='w-5 h-5 mr-2' />
              Update Document
            </>
          ) : existingDocument?.is_verified ? (
            <>
              <FiShield className='w-5 h-5 mr-2' />
              Document Already Verified
            </>
          ) : existingDocument ? (
            <>
              <FiEdit3 className='w-5 h-5 mr-2' />
              Use Edit Button Above
            </>
          ) : (
            <>
              <FiUpload className='w-5 h-5 mr-2' />
              Upload Document
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

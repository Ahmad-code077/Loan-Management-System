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
} from '@/lib/store/authApi';
import { authUtils } from '@/lib/auth/authUtils';
import {
  FiUpload,
  FiFile,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiLoader,
} from 'react-icons/fi';

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

  // API hooks
  const [uploadDocument, { isLoading: isUploading, error: uploadError }] =
    useUploadDocumentMutation();
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
  const existingDocument = userDocuments?.find(
    (doc) => doc.document_type === documentType
  );

  useEffect(() => {
    if (file && file[0]) {
      const selectedFileObj = file[0];
      setSelectedFile(selectedFileObj);

      // Create preview for images
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
      'application/pdf',
    ];

    if (!allowedTypes.includes(file.type)) {
      return 'File must be JPEG, PNG, or PDF';
    }

    return true;
  };

  const onSubmit = async (data) => {
    try {
      if (!selectedFile) {
        alert('Please select a file to upload');
        return;
      }

      // Validate file
      const fileValidation = validateFile(selectedFile);
      if (fileValidation !== true) {
        alert(fileValidation);
        return;
      }

      // Check if document is being updated and if it's verified
      if (existingDocument && existingDocument.is_verified) {
        alert(
          'This document is already verified and cannot be updated. Please contact admin if you need to make changes.'
        );
        return;
      }

      console.log('Preparing upload:', {
        document_type: data.document_type,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
      });

      const formData = {
        document_type: data.document_type,
        file: selectedFile,
      };

      const result = await uploadDocument(formData).unwrap();

      console.log('Document uploaded successfully:', result);

      // Show success message
      alert(
        `Document uploaded successfully! ${
          existingDocument ? 'Previous document has been updated.' : ''
        }`
      );

      // Reset form
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);

      // Refetch user documents
      refetchDocuments();

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Upload error details:', error);

      let errorMessage = 'Failed to upload document. Please try again.';

      // Handle different types of errors
      if (error?.status === 500) {
        errorMessage =
          'Server error occurred. Please check your file format and try again.';
      } else if (error?.status === 413) {
        errorMessage =
          'File is too large. Please choose a file smaller than 5MB.';
      } else if (error?.status === 400) {
        errorMessage =
          'Invalid file or document type. Please check your selection.';
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.detail) {
        errorMessage = error.data.detail;
      }

      alert(errorMessage);
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
          <h3 className='font-medium text-blue-800 mb-2'>Upload Information</h3>
          <p className='text-sm text-blue-700'>
            Uploading as:{' '}
            <span className='font-medium'>{currentUser.username}</span> (
            {currentUser.email})
          </p>
          <p className='text-xs text-blue-600 mt-1'>
            User ID: {currentUser.id}
          </p>
        </div>
      )}

      {/* Show user's current documents */}
      {userDocuments && userDocuments.length > 0 && (
        <div className='bg-gray-50 p-4 rounded-lg border'>
          <h3 className='font-medium text-gray-800 mb-3'>
            Your Current Documents
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {userDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`p-3 rounded border ${
                  doc.is_verified
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className='flex items-center gap-2 mb-1'>
                  {doc.is_verified ? (
                    <FiCheck className='w-4 h-4 text-green-600' />
                  ) : (
                    <FiAlertCircle className='w-4 h-4 text-yellow-600' />
                  )}
                  <span className='text-sm font-medium'>
                    {
                      DOCUMENT_TYPES.find((t) => t.value === doc.document_type)
                        ?.label
                    }
                  </span>
                </div>
                <p className='text-xs text-gray-600'>
                  {doc.is_verified ? 'Verified' : 'Pending verification'}
                </p>
                <p className='text-xs text-gray-500'>
                  {new Date(doc.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Type Warning */}
      {existingDocument && (
        <div
          className={`p-4 rounded-lg border ${
            existingDocument.is_verified
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <div className='flex items-center gap-2 mb-2'>
            {existingDocument.is_verified ? (
              <FiCheck className='w-5 h-5 text-green-600' />
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
            You already have a{' '}
            {DOCUMENT_TYPES.find((t) => t.value === documentType)?.label}{' '}
            document.
            {existingDocument.is_verified
              ? ' It is verified and cannot be updated.'
              : ' Uploading a new file will replace the existing unverified document.'}
          </p>
          <p className='text-xs mt-1 text-gray-600'>
            Uploaded:{' '}
            {new Date(existingDocument.uploaded_at).toLocaleDateString()}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Document Type Selection */}
        <div>
          <Label htmlFor='document_type' className='text-sm font-medium'>
            Document Type *
          </Label>
          <select
            id='document_type'
            {...register('document_type', {
              required: 'Document type is required',
            })}
            className={`w-full mt-1 rounded-md border p-2 bg-white ${
              errors.document_type ? 'border-red-500' : 'border-gray-300'
            }`}
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
                        'application/pdf',
                      ];
                      return (
                        allowedTypes.includes(files[0].type) ||
                        'File must be JPEG, PNG, or PDF'
                      );
                    },
                  },
                })}
                className='hidden'
                accept='.pdf,.jpg,.jpeg,.png'
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
                    : 'PDF, JPEG, PNG (Max 5MB)'}
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
                      <FiFile className='h-8 w-8 text-gray-400' />
                    </div>
                  )}
                  <div className='flex-1 text-sm text-gray-600'>
                    <p className='font-medium'>{selectedFile.name}</p>
                    <p>
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p>Type: {selectedFile.type}</p>
                    <p className='text-green-600 mt-2 flex items-center'>
                      <FiCheck className='w-3 h-3 mr-1' />
                      File is valid for upload
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Guidelines */}
        <div className='bg-gray-50 p-4 rounded-lg border'>
          <h3 className='font-medium text-gray-800 mb-2'>Upload Guidelines</h3>
          <ul className='list-disc pl-5 text-sm text-gray-600 space-y-1'>
            <li>Ensure the document is clear and all text is readable</li>
            <li>File size should not exceed 5MB</li>
            <li>Accepted formats: PDF, JPEG, PNG</li>
            <li>Only unverified documents can be updated</li>
            <li>Contact admin if you need to change a verified document</li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          className='w-full py-3 text-lg font-semibold'
          disabled={isUploading || existingDocument?.is_verified}
        >
          {isUploading ? (
            <>
              <FiLoader className='w-5 h-5 mr-2 animate-spin' />
              Uploading Document...
            </>
          ) : existingDocument?.is_verified ? (
            <>
              <FiX className='w-5 h-5 mr-2' />
              Cannot Update Verified Document
            </>
          ) : existingDocument ? (
            <>
              <FiUpload className='w-5 h-5 mr-2' />
              Update Document
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

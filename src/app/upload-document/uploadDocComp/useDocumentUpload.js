import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  useUploadDocumentMutation,
  useGetUserDocumentsQuery,
  useUpdateDocumentMutation,
} from '@/lib/store/authApi';
import { useToast } from '@/hooks/use-toast';
import {
  validateFile,
  API_TYPE_TO_VALUE,
  scrollToElement,
} from './documentHelpers';

export const useDocumentUpload = () => {
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

  // Form setup
  const form = useForm({
    defaultValues: {
      document_type: '',
      file: null,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = form;
  const file = watch('file');
  const documentType = watch('document_type');

  // Check existing document
  const existingDocument = userDocuments?.find((doc) => {
    return API_TYPE_TO_VALUE[doc.document_type] === documentType;
  });

  // Handle file preview
  useEffect(() => {
    if (file && file[0]) {
      const selectedFileObj = file[0];
      setSelectedFile(selectedFileObj);

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

    setDocumentToUpdate(document);
    setIsUpdating(true);

    const documentTypeValue = API_TYPE_TO_VALUE[document.document_type];
    setValue('document_type', documentTypeValue);

    scrollToElement('scroll-to-document-type');

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

  // Form submission
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
        result = await updateDocument({
          id: documentToUpdate.id,
          documentData: formData,
        }).unwrap();

        toast({
          title: 'Update Successful',
          description: 'Document updated successfully!',
          variant: 'default',
        });
      } else {
        result = await uploadDocument(formData).unwrap();

        toast({
          title: 'Upload Successful',
          description: 'Document uploaded successfully!',
          variant: 'default',
        });
      }

      // Reset form and states
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsUpdating(false);
      setDocumentToUpdate(null);

      refetchDocuments();

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Operation error details:', error);

      let errorMessage = `Failed to ${
        isUpdating ? 'update' : 'upload'
      } document. Please try again.`;
      let errorTitle = `${isUpdating ? 'Update' : 'Upload'} Failed`;

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

  return {
    // States
    selectedFile,
    previewUrl,
    isUpdating,
    documentToUpdate,
    userDocuments,
    existingDocument,
    loadingDocuments,
    documentsError,
    isUploading,
    isUpdatingDoc,

    // Form
    form,
    register,
    handleSubmit,
    errors,

    // Handlers
    handleViewDocument,
    handleEditDocument,
    handleCancelUpdate,
    onSubmit,
  };
};

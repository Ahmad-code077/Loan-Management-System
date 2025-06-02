'use client';

import CurrentDocumentsSection from '@/app/upload-document/uploadDocComp/CurrentDocumentsSection';
import DocumentTypeSelector from '@/app/upload-document/uploadDocComp/DocumentTypeSelector';
import DocumentWarningSection from '@/app/upload-document/uploadDocComp/DocumentWarningSection';
import FileUploadSection from '@/app/upload-document/uploadDocComp/FileUploadSection';
import SubmitButton from '@/app/upload-document/uploadDocComp/SubmitButton';
import UploadGuidelines from '@/app/upload-document/uploadDocComp/UploadGuidelines';
import { useDocumentUpload } from '@/app/upload-document/uploadDocComp/useDocumentUpload';
import UserInfoSection from '@/app/upload-document/uploadDocComp/UserInfoSection';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';

export default function DocumentUploadForm() {
  const {
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
    register,
    handleSubmit,
    errors,

    // Handlers
    handleViewDocument,
    handleEditDocument,
    handleCancelUpdate,
    onSubmit,
  } = useDocumentUpload();

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
      {/* User Info Section */}
      <UserInfoSection
        isUpdating={isUpdating}
        documentToUpdate={documentToUpdate}
        handleCancelUpdate={handleCancelUpdate}
      />

      {/* Current Documents Section */}
      <CurrentDocumentsSection
        userDocuments={userDocuments}
        isUpdating={isUpdating}
        documentToUpdate={documentToUpdate}
        handleViewDocument={handleViewDocument}
        handleEditDocument={handleEditDocument}
      />

      {/* Document Warning Section */}
      <DocumentWarningSection
        existingDocument={existingDocument}
        isUpdating={isUpdating}
      />

      {/* Upload Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Document Type Selector */}
        <DocumentTypeSelector
          register={register}
          errors={errors}
          isUpdating={isUpdating}
        />

        {/* File Upload Section */}
        <FileUploadSection
          register={register}
          errors={errors}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          isUpdating={isUpdating}
        />

        {/* Upload Guidelines */}
        <UploadGuidelines isUpdating={isUpdating} />

        {/* Submit Button */}
        <SubmitButton
          isUploading={isUploading}
          isUpdatingDoc={isUpdatingDoc}
          isUpdating={isUpdating}
          existingDocument={existingDocument}
        />
      </form>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoanApplicationForm from '@/components/loans/LoanApplicationForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authUtils } from '@/lib/auth/authUtils';
import {
  FiArrowLeft,
  FiUpload,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiFileText,
} from 'react-icons/fi';
import Link from 'next/link';
import { useGetUserDocumentsQuery } from '@/lib/store/authApi';

const REQUIRED_DOCUMENT_TYPES = [
  {
    type: 'cnic_front',
    name: 'CNIC Front',
    description: 'Valid CNIC front copy',
    apiDisplayNames: ['CNIC Front'],
    apiChoiceKeys: ['cnic_front'],
    requiresBoth: false,
  },
  {
    type: 'cnic_back',
    name: 'CNIC Back',
    description: 'Valid CNIC back copy',
    apiDisplayNames: ['CNIC Back'],
    apiChoiceKeys: ['cnic_back'],
    requiresBoth: false,
  },
  {
    type: 'salary_slip',
    name: 'Salary Slip',
    description: 'Recent salary slip or income proof',
    apiDisplayNames: ['Salary Slip'],
    apiChoiceKeys: ['salary_slip'],
    requiresBoth: false,
  },
];

export default function ApplyLoanPage() {
  const router = useRouter();
  const {
    data: userDocuments = [],
    isLoading: documentsLoading,
    error: documentsError,
    refetch: refetchDocuments,
  } = useGetUserDocumentsQuery();

  // Check authentication
  useEffect(() => {
    const user = authUtils.getCurrentUser();
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  // Updated document status check - Each document checked individually
  const getDocumentStatus = () => {
    const uploadedDisplayNames = userDocuments.map((doc) => doc.document_type);

    return REQUIRED_DOCUMENT_TYPES.map((reqDoc) => {
      // Check if we have the display name
      const hasDisplayName = reqDoc.apiDisplayNames.some((displayName) =>
        uploadedDisplayNames.includes(displayName)
      );

      // Or check if we have the choice key (fallback)
      const hasChoiceKey = reqDoc.apiChoiceKeys.some((choiceKey) =>
        uploadedDisplayNames.includes(choiceKey)
      );

      const isUploaded = hasDisplayName || hasChoiceKey;

      // Get the specific document
      const documents = userDocuments.filter(
        (doc) =>
          reqDoc.apiDisplayNames.includes(doc.document_type) ||
          reqDoc.apiChoiceKeys.includes(doc.document_type)
      );

      return {
        ...reqDoc,
        isUploaded,
        documents, // Array with single document (or empty)
        uploadedCount: documents.length,
        requiredCount: 1, // Each document is individual
      };
    });
  };

  const documentStatus = getDocumentStatus();

  const allDocumentsUploaded = documentStatus.every((doc) => doc.isUploaded);
  const uploadedCount = documentStatus.filter((doc) => doc.isUploaded).length;

  // Loading state
  if (documentsLoading) {
    return (
      <main className='min-h-screen bg-gray-50 py-8'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='mb-6'>
              <Link
                href='/dashboard'
                className='inline-flex items-center text-primary hover:text-primary/80 mb-4'
              >
                <FiArrowLeft className='w-4 h-4 mr-2' />
                Back to Dashboard
              </Link>
            </div>

            <Card className='p-8 shadow-lg border-0 text-center'>
              <FiLoader className='w-8 h-8 animate-spin text-primary mx-auto mb-4' />
              <h2 className='text-xl font-semibold mb-2'>
                Checking Document Status...
              </h2>
              <p className='text-gray-600'>
                Please wait while we verify your uploaded documents.
              </p>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (documentsError) {
    return (
      <main className='min-h-screen bg-gray-50 py-8'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='mb-6'>
              <Link
                href='/dashboard'
                className='inline-flex items-center text-primary hover:text-primary/80 mb-4'
              >
                <FiArrowLeft className='w-4 h-4 mr-2' />
                Back to Dashboard
              </Link>
            </div>

            <Card className='p-8 shadow-lg border-0 text-center'>
              <FiXCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
              <h2 className='text-xl font-semibold mb-2 text-red-600'>
                Error Loading Documents
              </h2>
              <p className='text-gray-600 mb-4'>
                Failed to check your document status. Please try again.
              </p>
              <div className='flex gap-2 justify-center'>
                <Button onClick={() => refetchDocuments()} variant='outline'>
                  <FiLoader className='w-4 h-4 mr-2' />
                  Try Again
                </Button>
                <Link href='/dashboard'>
                  <Button>Back to Dashboard</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  // All 3 documents uploaded - Show loan application form
  if (allDocumentsUploaded) {
    return (
      <main className='min-h-screen bg-gray-50 py-8'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            {/* Header */}
            <div className='mb-6'>
              <Link
                href='/dashboard'
                className='inline-flex items-center text-primary hover:text-primary/80 mb-4'
              >
                <FiArrowLeft className='w-4 h-4 mr-2' />
                Back to Dashboard
              </Link>
              <h1 className='text-3xl font-bold text-gray-900'>
                Apply for a Loan
              </h1>
              <p className='text-gray-600 mt-2'>
                Fill out the form below to submit your loan application. All
                fields marked with * are required.
              </p>
            </div>

            {/* Document Status Success */}
            <Card className='p-4 mb-6 bg-green-50 border-green-200'>
              <div className='flex items-center gap-2 text-green-800'>
                <FiCheckCircle className='w-5 h-5' />
                <div>
                  <p className='font-medium'>All Required Documents Uploaded</p>
                  <p className='text-sm text-green-700'>
                    You have successfully uploaded all 3 required documents. You
                    can now proceed with your loan application.
                  </p>
                  <div className='text-xs text-green-600 mt-1'>
                    Documents verified: CNIC Front, CNIC Back, Salary Slip
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Form Card */}
            <Card className='p-8 shadow-lg border-0'>
              <LoanApplicationForm />
            </Card>
          </div>
        </div>
      </main>
    );
  }

  // Documents missing - Show upload requirement message
  return (
    <main className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='mb-6'>
            <Link
              href='/dashboard'
              className='inline-flex items-center text-primary hover:text-primary/80 mb-4'
            >
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Back to Dashboard
            </Link>
            <h1 className='text-3xl font-bold text-gray-900'>
              Apply for a Loan
            </h1>
          </div>

          {/* Document Requirement Message */}
          <Card className='p-8 shadow-lg border-0'>
            <div className='text-center mb-6'>
              <FiAlertTriangle className='w-16 h-16 text-yellow-500 mx-auto mb-4' />
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                Documents Required
              </h2>
              <p className='text-gray-600 text-lg'>
                You need to upload all 3 required documents before applying for
                a loan.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className='mb-6'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium text-gray-700'>
                  Document Upload Progress
                </span>
                <span className='text-sm text-gray-500'>
                  {uploadedCount} of {REQUIRED_DOCUMENT_TYPES.length} completed
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-primary h-2 rounded-full transition-all duration-300'
                  style={{
                    width: `${
                      (uploadedCount / REQUIRED_DOCUMENT_TYPES.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Document Status List - Now shows 3 separate checks */}
            <div className='space-y-4 mb-8'>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                Required Documents Status (3 Documents):
              </h3>

              {documentStatus.map((doc, index) => (
                <div
                  key={doc.type}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    doc.isUploaded
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      {doc.isUploaded ? (
                        <FiCheckCircle className='w-5 h-5 text-green-600' />
                      ) : (
                        <FiXCircle className='w-5 h-5 text-red-600' />
                      )}
                      <div>
                        <h4 className='font-medium text-gray-900'>
                          {index + 1}. {doc.name}
                        </h4>
                        <p className='text-sm text-gray-600'>
                          {doc.description}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      {doc.isUploaded ? (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                          <FiCheckCircle className='w-3 h-3 mr-1' />
                          Uploaded ✓
                        </span>
                      ) : (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                          <FiXCircle className='w-3 h-3 mr-1' />
                          Not Uploaded
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Show uploaded document details */}
                  {doc.documents.length > 0 && (
                    <div className='mt-3 space-y-1'>
                      <p className='text-xs font-medium text-gray-600'>
                        Uploaded File:
                      </p>
                      {doc.documents.map((document, docIndex) => (
                        <div
                          key={document.id || docIndex}
                          className='text-xs text-gray-500 flex items-center justify-between'
                        >
                          <span>• {document.document_type}</span>
                          <span className='text-gray-400'>
                            {new Date(
                              document.uploaded_at
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Status Summary */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
              <h4 className='font-medium text-blue-900 mb-2'>
                Current Status Summary:
              </h4>
              <div className='text-sm text-blue-800 space-y-1'>
                {documentStatus.map((doc) => (
                  <div key={doc.type} className='flex justify-between'>
                    <span>{doc.name}:</span>
                    <span
                      className={
                        doc.isUploaded
                          ? 'text-green-600 font-medium'
                          : 'text-red-600'
                      }
                    >
                      {doc.isUploaded ? '✓ Uploaded' : '✗ Missing'}
                    </span>
                  </div>
                ))}
              </div>
              <div className='mt-2 pt-2 border-t border-blue-200'>
                <div className='flex justify-between font-medium'>
                  <span>Total Progress:</span>
                  <span
                    className={
                      allDocumentsUploaded ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {uploadedCount}/3 Documents Uploaded
                  </span>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className='bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6'>
              <div className='flex items-start gap-3'>
                <FiAlertTriangle className='w-5 h-5 text-amber-600 mt-0.5' />
                <div className='text-left'>
                  <h4 className='font-medium text-amber-900 mb-1'>
                    Document Requirements (3 Documents Total):
                  </h4>
                  <ul className='text-sm text-amber-800 space-y-1'>
                    <li>
                      • <strong>CNIC Front:</strong> Clear photo of CNIC front
                      side
                    </li>
                    <li>
                      • <strong>CNIC Back:</strong> Clear photo of CNIC back
                      side
                    </li>
                    <li>
                      • <strong>Salary Slip:</strong> Recent income proof
                      document
                    </li>
                  </ul>
                  <p className='text-xs text-amber-700 mt-2 font-medium'>
                    All 3 documents must be uploaded to proceed with loan
                    application.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='text-center space-y-4'>
              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <Link href='/upload-document' className='flex-1 sm:flex-none'>
                  <Button size='lg' className='w-full sm:w-auto'>
                    <FiUpload className='w-5 h-5 mr-2' />
                    Upload Missing Documents
                  </Button>
                </Link>

                <Button
                  variant='outline'
                  size='lg'
                  onClick={() => refetchDocuments()}
                  className='w-full sm:w-auto'
                >
                  <FiLoader className='w-5 h-5 mr-2' />
                  Refresh Status
                </Button>
              </div>

              <p className='text-sm text-gray-500 mt-4'>
                Upload all 3 documents, then return to this page to complete
                your loan application.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetUserDocumentsQuery } from '@/lib/store/authApi';
import {
  FiFileText,
  FiImage,
  FiFile,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiEye,
} from 'react-icons/fi';
import Link from 'next/link';

export default function DocumentsList() {
  const {
    data: documents = [],
    isLoading,
    error,
    refetch,
  } = useGetUserDocumentsQuery();

  // Get document type icon
  const getDocumentIcon = (documentType) => {
    switch (documentType) {
      case 'cnic_front':
      case 'cnic_back':
        return <FiFileText className='w-4 h-4 text-blue-600' />;
      case 'salary_slip':
        return <FiFile className='w-4 h-4 text-green-600' />;
      default:
        return <FiFile className='w-4 h-4 text-gray-600' />;
    }
  };

  // Get document type label
  const getDocumentTypeLabel = (documentType) => {
    switch (documentType) {
      case 'cnic_front':
        return 'CNIC Front';
      case 'cnic_back':
        return 'CNIC Back';
      case 'salary_slip':
        return 'Salary Slip';
      default:
        return documentType;
    }
  };

  // Get verification status
  const getVerificationStatus = (isVerified) => {
    if (isVerified) {
      return (
        <Badge className='bg-green-100 text-green-800 border-green-200'>
          <FiCheck className='w-3 h-3 mr-1' />
          Verified
        </Badge>
      );
    }
    return (
      <Badge className='bg-yellow-100 text-yellow-800 border-yellow-200'>
        <FiClock className='w-3 h-3 mr-1' />
        Pending
      </Badge>
    );
  };

  // Handle file viewing
  const handleViewDocument = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className='text-center py-6'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2'></div>
        <div className='text-muted-foreground'>Loading your documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-6'>
        <div className='flex items-center justify-center gap-2 text-red-600 mb-2'>
          <FiAlertCircle className='w-5 h-5' />
          <span>Failed to load documents</span>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => refetch()}
          className='mt-2'
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className='text-center py-6'>
        <FiFileText className='w-12 h-12 text-gray-400 mx-auto mb-3' />
        <div className='text-muted-foreground mb-3'>
          No documents uploaded yet
        </div>
        <Link href='/upload-document'>
          <Button size='sm'>Upload Documents</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className='p-4 hover:shadow-lg transition-shadow border border-border'
        >
          <div className='flex justify-between items-start'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-2'>
                {getDocumentIcon(doc.document_type)}
                <div>
                  <h3 className='font-semibold text-card-foreground'>
                    {getDocumentTypeLabel(doc.document_type)}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Document ID: #{doc.id}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 text-sm text-muted-foreground mb-2'>
                <span>
                  Uploaded:{' '}
                  {new Date(doc.uploaded_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span>
                  {new Date(doc.uploaded_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className='flex items-center gap-2'>
                {getVerificationStatus(doc.is_verified)}
                {doc.file && (
                  <Badge variant='outline' className='text-xs'>
                    {doc.file.split('.').pop()?.toUpperCase() || 'FILE'}
                  </Badge>
                )}
              </div>
            </div>

            <div className='flex flex-col gap-2 ml-4'>
              {doc.file && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleViewDocument(doc.file)}
                  className='text-blue-600 hover:text-blue-800 border-blue-200 hover:bg-blue-50'
                >
                  <FiEye className='w-4 h-4 mr-1' />
                  View
                </Button>
              )}

              {!doc.is_verified && (
                <Link href='/upload-document'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-orange-600 hover:text-orange-800 hover:bg-orange-50'
                  >
                    Update
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Additional document info */}
          {doc.file && (
            <div className='mt-3 pt-3 border-t border-border'>
              <div className='text-xs text-muted-foreground'>
                <span className='font-medium'>File:</span>{' '}
                {doc.file.split('/').pop()}
              </div>
            </div>
          )}
        </Card>
      ))}

      {/* Add upload button at the bottom */}
      <div className='pt-4 border-t border-border'>
        <Link href='/upload-document'>
          <Button variant='outline' className='w-full'>
            <FiFileText className='w-4 h-4 mr-2' />
            Upload More Documents
          </Button>
        </Link>
      </div>
    </div>
  );
}

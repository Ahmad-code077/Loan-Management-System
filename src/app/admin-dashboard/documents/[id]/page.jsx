// Update: src/app/admin-dashboard/documents/[id]/page.jsx
'use client';

import { useParams } from 'next/navigation';
import { useGetDocumentDetailsQuery } from '@/lib/store/authApi';
import DocsDetailHeader from './docsComponents/DocsDetailHeader';
import DocsPreviewCard from './docsComponents/DocsPreviewCard';
import DocsInfoCard from './docsComponents/DocsInfoCard';
import DocsUserInfoCard from './docsComponents/DocsUserInfoCard';
import DocsVerificationCard from './docsComponents/DocsVerificationCard.jsx'; // ✅ Import new component

export default function DocumentDetailPage() {
  const { id } = useParams();

  // Use the real API hook directly
  const {
    data: document,
    isLoading: loading,
    error,
    refetch, // ✅ Add refetch to update data after verification
  } = useGetDocumentDetailsQuery(id);

  // ✅ Handle document update after verification
  const handleDocumentUpdated = (updatedDocument) => {
    console.log('Document updated, refetching data...');
    refetch(); // Refresh the document data
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-8'>
          <h1 className='text-3xl font-bold text-foreground'>
            Document Not Found
          </h1>
          <p className='text-muted-foreground mt-1'>
            The requested document could not be found.
          </p>
          {error && (
            <p className='text-red-500 mt-2'>
              Error: {error?.data?.message || error?.status || 'Unknown error'}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <DocsDetailHeader document={document} />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <DocsPreviewCard document={document} />
          <DocsInfoCard document={document} />
        </div>

        <div className='space-y-6'>
          <DocsUserInfoCard document={document} />
          {/* ✅ Add verification card */}
          <DocsVerificationCard
            document={document}
            onDocumentUpdated={handleDocumentUpdated}
          />
        </div>
      </div>
    </div>
  );
}

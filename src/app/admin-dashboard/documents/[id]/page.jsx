'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DocsDetailHeader from './docsComponents/DocsDetailHeader';
import DocsInfoCard from './docsComponents/DocsInfoCard';
import DocsPreviewCard from './docsComponents/DocsPreviewCard';
import DocsUserInfoCard from './docsComponents/DocsUserInfoCard';
import { useDocuments } from '../hooks/useDocuments';

export default function DocumentDetailPage() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getDocumentById } = useDocuments();

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    const result = await getDocumentById(id);
    if (result.success) {
      setDocument(result.data);
    }
    setLoading(false);
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

  if (!document) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-8'>
          <h1 className='text-3xl font-bold text-foreground'>
            Document Not Found
          </h1>
          <p className='text-muted-foreground mt-1'>
            The requested document could not be found.
          </p>
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
        </div>
      </div>
    </div>
  );
}

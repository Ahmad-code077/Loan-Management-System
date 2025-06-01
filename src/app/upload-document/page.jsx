'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DocumentUploadForm from '@/components/documents/DocumentUploadForm';
import { Card } from '@/components/ui/card';

export default function UploadDocumentPage() {
  const router = useRouter();
  return (
    <main className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <Card className='max-w-2xl mx-auto p-6'>
          <h1 className='text-2xl font-bold mb-6'>Upload Document</h1>
          <DocumentUploadForm />
        </Card>
      </div>
    </main>
  );
}

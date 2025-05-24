'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DocumentsList() {
  const [isLoading, setIsLoading] = useState(true);
  const [documents] = useState([
    {
      id: 1,
      title: 'Income Statement',
      file_url: '#',
      uploaded_at: '2025-05-01',
      type: 'pdf',
    },
    {
      id: 2,
      title: 'Bank Statement',
      file_url: '#',
      uploaded_at: '2025-05-15',
      type: 'pdf',
    },
    {
      id: 3,
      title: 'ID Proof',
      file_url: '#',
      uploaded_at: '2025-05-10',
      type: 'image',
    },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className='text-center text-gray-500'>Loading documents...</div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className='text-center text-gray-500'>
        No documents found. Upload documents to get started!
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {documents.map((doc) => (
        <Card key={doc.id} className='p-4 hover:shadow-lg transition-shadow'>
          <div className='flex justify-between items-center'>
            <div>
              <h3 className='font-semibold flex items-center gap-2'>
                {doc.type === 'pdf' ? (
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                )}
                {doc.title}
              </h3>
              <p className='text-sm text-gray-600'>
                Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant='outline'
              size='sm'
              className='text-blue-600 hover:text-blue-800'
            >
              View
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

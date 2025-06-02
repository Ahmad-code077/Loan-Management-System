'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DocumentUploadForm from '@/components/documents/DocumentUploadForm';
import { Card } from '@/components/ui/card';
import { authUtils } from '@/lib/auth/authUtils';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import Link from 'next/link';

export default function UploadDocumentPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!authUtils.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Check if user is admin (admins shouldn't upload personal documents)
    const user = authUtils.getCurrentUser();
    if (user?.is_superuser === true) {
      router.push('/admin-dashboard');
      return;
    }
  }, [router]);

  return (
    <main className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <div className='max-w-3xl mx-auto'>
          {/* Header */}
          <div className='mb-6'>
            <Link
              href='/dashboard'
              className='inline-flex items-center text-primary hover:text-primary/80 mb-4 transition-colors'
            >
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Back to Dashboard
            </Link>
            <div className='flex items-center gap-3 mb-2'>
              <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center'>
                <FiUpload className='w-5 h-5 text-primary-foreground' />
              </div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Upload Document
              </h1>
            </div>
            <p className='text-gray-600'>
              Upload your required documents for loan verification. Make sure
              all documents are clear and readable.
            </p>
          </div>

          {/* Main Form Card */}
          <Card className='p-8 shadow-lg border-0'>
            <DocumentUploadForm />
          </Card>

          {/* Help Information */}
          <Card className='mt-6 p-6 bg-blue-50 border-blue-200'>
            <h2 className='text-lg font-semibold text-blue-800 mb-3'>
              Document Requirements
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
              <div>
                <h3 className='font-medium text-blue-700 mb-2'>CNIC Front</h3>
                <ul className='text-blue-600 space-y-1'>
                  <li>• Clear photo of front side</li>
                  <li>• All text readable</li>
                  <li>• No shadows or glare</li>
                </ul>
              </div>
              <div>
                <h3 className='font-medium text-blue-700 mb-2'>CNIC Back</h3>
                <ul className='text-blue-600 space-y-1'>
                  <li>• Clear photo of back side</li>
                  <li>• Address clearly visible</li>
                  <li>• Signature visible</li>
                </ul>
              </div>
              <div>
                <h3 className='font-medium text-blue-700 mb-2'>Salary Slip</h3>
                <ul className='text-blue-600 space-y-1'>
                  <li>• Recent salary slip (PDF preferred)</li>
                  <li>• All amounts visible</li>
                  <li>• Company stamp/seal</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoanApplicationForm from '@/components/loans/LoanApplicationForm';
import { Card } from '@/components/ui/card';
import { authUtils } from '@/lib/auth/authUtils';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function ApplyLoanPage() {
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

          {/* Main Form Card */}
          <Card className='p-8 shadow-lg border-0'>
            <LoanApplicationForm />
          </Card>
        </div>
      </div>
    </main>
  );
}

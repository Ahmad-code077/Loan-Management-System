'use client';

import { useState } from 'react';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoanList from '@/components/dashboard/LoanList';
import DocumentsList from '@/components/dashboard/DocumentsList';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const [userProfile] = useState({
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    full_name: 'John Doe',
    phone: '+1234567890',
    created_at: '2025-01-01',
  });

  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader profile={userProfile} />

      <main className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card className='p-6 border border-border shadow-sm'>
            <h2 className='text-xl font-semibold mb-4 flex items-center gap-2 text-primary'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              Your Loans
            </h2>
            <LoanList />
          </Card>

          <Card className='p-6 border border-border shadow-sm'>
            <h2 className='text-xl font-semibold mb-4 flex items-center gap-2 text-primary'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              Your Documents
            </h2>
            <DocumentsList />
          </Card>
        </div>

        <div className='mt-8'>
          <Card className='p-6 border border-border shadow-sm'>
            <h2 className='text-xl font-semibold mb-4 flex items-center gap-2 text-primary'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                />
              </svg>
              Account Overview
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <Card className='p-4 bg-card hover:bg-accent transition-colors'>
                <h3 className='text-sm text-muted-foreground'>Total Loans</h3>
                <p className='text-2xl font-bold text-primary'>3</p>
              </Card>
              <Card className='p-4 bg-card hover:bg-accent transition-colors'>
                <h3 className='text-sm text-muted-foreground'>Active Loans</h3>
                <p className='text-2xl font-bold text-primary'>1</p>
              </Card>
              <Card className='p-4 bg-card hover:bg-accent transition-colors'>
                <h3 className='text-sm text-muted-foreground'>Documents</h3>
                <p className='text-2xl font-bold text-primary'>3</p>
              </Card>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

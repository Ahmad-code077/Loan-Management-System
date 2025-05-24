'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LoanList() {
  const [isLoading, setIsLoading] = useState(true);
  const [loans] = useState([
    {
      id: 1,
      loan_type: 'Personal Loan',
      amount: 5000,
      status: 'approved',
      created_at: '2025-05-01',
    },
    {
      id: 2,
      loan_type: 'Business Loan',
      amount: 15000,
      status: 'pending',
      created_at: '2025-05-15',
    },
    {
      id: 3,
      loan_type: 'Education Loan',
      amount: 10000,
      status: 'rejected',
      created_at: '2025-05-10',
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
    return <div className='text-center text-gray-500'>Loading loans...</div>;
  }

  if (loans.length === 0) {
    return (
      <div className='text-center text-gray-500'>
        No loans found. Apply for a loan to get started!
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {loans.map((loan) => (
        <Card key={loan.id} className='p-4 hover:shadow-lg transition-shadow'>
          <div className='flex justify-between items-start'>
            <div>
              <h3 className='font-semibold'>{loan.loan_type}</h3>
              <p className='text-sm text-gray-600'>
                Amount: ${loan.amount.toLocaleString()}
              </p>
              <p className='text-sm text-gray-600'>
                Applied: {new Date(loan.created_at).toLocaleDateString()}
              </p>
            </div>
            <Badge
              className={
                loan.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : loan.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }
            >
              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

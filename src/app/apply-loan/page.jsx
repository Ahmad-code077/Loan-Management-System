'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoanApplicationForm from '@/components/loans/LoanApplicationForm';
import { Card } from '@/components/ui/card';

export default function ApplyLoanPage() {
  const router = useRouter();
  const [loanTypes, setLoanTypes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch loan types
    const fetchLoanTypes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/loan-types/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setLoanTypes(data);
        }
      } catch (error) {
        console.error('Failed to fetch loan types:', error);
      }
    };

    fetchLoanTypes();
  }, [router]);

  return (
    <main className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <Card className='max-w-2xl mx-auto p-6'>
          <h1 className='text-2xl font-bold mb-6'>Apply for a Loan</h1>
          <LoanApplicationForm loanTypes={loanTypes} />
        </Card>
      </div>
    </main>
  );
}

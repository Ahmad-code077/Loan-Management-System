'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardHeader({ profile }) {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className='bg-white shadow'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold'>Welcome, {profile.username}</h1>
            <p className='text-gray-600'>{profile.email}</p>
          </div>

          <div className='space-x-4'>
            <Button
              variant='outline'
              onClick={() => router.push('/apply-loan')}
            >
              Apply for Loan
            </Button>

            <Button
              variant='outline'
              onClick={() => router.push('/upload-document')}
            >
              Upload Document
            </Button>

            <Button variant='ghost' onClick={() => router.push('/profile')}>
              Profile
            </Button>

            <Button variant='destructive' onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

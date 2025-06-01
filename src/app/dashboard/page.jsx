'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoanList from '@/components/dashboard/LoanList';
import DocumentsList from '@/components/dashboard/DocumentsList';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLogoutMutation } from '@/lib/store/authApi';
import { authUtils } from '@/lib/auth/authUtils';
import { FiLogOut, FiUser } from 'react-icons/fi';

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage
    const updateUserProfile = () => {
      const user = authUtils.getCurrentUser();
      if (user) {
        // Transform the stored user data to match the expected format
        setUserProfile({
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.username, // Use username as full_name since that's not in the stored data
          phone: user.phone || 'Not provided', // Default if not available
          created_at: user.created_at || new Date().toISOString().split('T')[0], // Default to current date
          is_superuser: user.is_superuser || false,
        });
      } else {
        // If no user data, redirect to login
        router.push('/login');
      }
    };

    // Initial load
    updateUserProfile();

    // Listen for auth refresh events to update user data
    const handleAuthRefresh = () => {
      updateUserProfile();
    };

    window.addEventListener('auth-refresh', handleAuthRefresh);

    return () => {
      window.removeEventListener('auth-refresh', handleAuthRefresh);
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push('/login');
    } catch (error) {
      // Even if logout API fails, clear local data and redirect
      authUtils.clearAuth();
      router.push('/login');
    }
  };

  // Show loading state while user data is being fetched
  if (!userProfile) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header with logout button */}
      <div className='bg-card shadow-sm border-b border-border'>
        <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center'>
              <FiUser className='w-5 h-5 text-primary-foreground' />
            </div>
            <div>
              <h1 className='text-xl font-semibold text-foreground'>
                Welcome back, {userProfile.username}!
              </h1>
              <p className='text-sm text-muted-foreground'>
                {userProfile.email}
              </p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            disabled={logoutLoading}
            variant='outline'
            className='hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200'
          >
            <FiLogOut className='w-4 h-4 mr-2' />
            {logoutLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>

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

        {/* User Account Information Card */}
        <div className='mt-8'>
          <Card className='p-6 border border-border shadow-sm'>
            <h2 className='text-xl font-semibold mb-4 flex items-center gap-2 text-primary'>
              <FiUser className='w-5 h-5' />
              Account Information
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <Card className='p-4 bg-card hover:bg-accent transition-colors'>
                <h3 className='text-sm text-muted-foreground'>User ID</h3>
                <p className='text-lg font-semibold text-primary'>
                  #{userProfile.id}
                </p>
              </Card>
              <Card className='p-4 bg-card hover:bg-accent transition-colors'>
                <h3 className='text-sm text-muted-foreground'>Username</h3>
                <p
                  className='text-lg font-semibold text-primary truncate'
                  title={userProfile.username}
                >
                  {userProfile.username}
                </p>
              </Card>
              <Card className='p-4 bg-card hover:bg-accent transition-colors'>
                <h3 className='text-sm text-muted-foreground'>Email</h3>
                <p
                  className='text-lg font-semibold text-primary truncate'
                  title={userProfile.email}
                >
                  {userProfile.email}
                </p>
              </Card>
              <Card className='p-4 bg-card hover:bg-accent transition-colors'>
                <h3 className='text-sm text-muted-foreground'>Account Type</h3>
                <p className='text-lg font-semibold text-primary'>
                  {userProfile.is_superuser ? 'Admin' : 'Regular User'}
                </p>
              </Card>
            </div>
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

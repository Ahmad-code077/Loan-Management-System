'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiArrowLeft, FiUser, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import EditProfileForm from './EditProfileForm';
import { useGetProfileQuery } from '@/lib/store/authApi';

export default function EditProfilePage() {
  const router = useRouter();

  // ✅ Get user data from API query
  const {
    data: user,
    isLoading: loading,
    error,
    refetch,
  } = useGetProfileQuery();

  console.log('User profile data:', user);

  // ✅ Show loading state
  if (loading) {
    return (
      <div className='container mx-auto px-6 py-8'>
        <Card className='max-w-2xl mx-auto'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <FiLoader className='w-8 h-8 animate-spin text-primary mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>Loading...</h3>
              <p className='text-muted-foreground'>
                Please wait while we load your profile.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Show error state
  if (error || !user) {
    return (
      <div className='container mx-auto px-6 py-8'>
        <Card className='max-w-2xl mx-auto'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <h3 className='text-lg font-medium mb-2 text-red-600'>
                Failed to Load Profile
              </h3>
              <p className='text-muted-foreground mb-4'>
                {error?.data?.message || 'Unable to load your profile data.'}
              </p>
              <div className='flex gap-3 justify-center'>
                <Button onClick={() => refetch()}>Try Again</Button>
                <Button
                  variant='outline'
                  onClick={() => router.push('/profile')}
                >
                  Back to Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-6 py-8'>
      <div className='max-w-2xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <Link href='/profile'>
              <Button variant='outline' size='sm'>
                <FiArrowLeft className='w-4 h-4 mr-2' />
                Back to Profile
              </Button>
            </Link>
            <div>
              <h1 className='text-2xl font-bold text-foreground'>
                Edit Profile
              </h1>
              <p className='text-muted-foreground'>
                Update your personal information
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Card */}
        <Card className='border-border'>
          <CardHeader className='pb-6'>
            <CardTitle className='flex items-center space-x-2'>
              <FiUser className='w-5 h-5 text-primary' />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* ✅ Pass user data to form */}
            <EditProfileForm user={user} onProfileUpdate={refetch} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

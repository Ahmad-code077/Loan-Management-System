'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetProfileQuery } from '@/lib/store/authApi';
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiEdit,
  FiLoader,
  FiEdit3,
} from 'react-icons/fi';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: profile, isLoading, error, refetch } = useGetProfileQuery();

  if (isLoading) {
    return (
      <main className='min-h-screen bg-gray-50 py-8'>
        <div className='container mx-auto px-4'>
          <Card className='max-w-2xl mx-auto p-6'>
            <div className='flex items-center justify-center py-8'>
              <div className='text-center'>
                <FiLoader className='w-8 h-8 animate-spin text-blue-600 mx-auto mb-4' />
                <p className='text-gray-600'>Loading profile...</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='min-h-screen bg-gray-50 py-8'>
        <div className='container mx-auto px-4'>
          <Card className='max-w-2xl mx-auto p-6'>
            <div className='text-center py-8'>
              <div className='text-red-500 mb-4'>
                <FiUser className='w-12 h-12 mx-auto mb-2' />
                <h2 className='text-xl font-semibold'>
                  Failed to load profile
                </h2>
                <p className='text-gray-600 mt-2'>
                  {error?.data?.detail || 'Unable to fetch profile data'}
                </p>
              </div>
              <Button onClick={() => refetch()} className='mt-4'>
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto space-y-6'>
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center'>
                    <FiUser className='w-8 h-8 text-blue-600' />
                  </div>
                  <div>
                    <CardTitle className='text-2xl'>
                      {profile?.first_name && profile?.last_name
                        ? `${profile.first_name} ${profile.last_name}`
                        : profile?.username || 'User Profile'}
                    </CardTitle>
                    <p className='text-gray-600'>@{profile?.username}</p>
                  </div>
                </div>
                <Link href='/profile/edit'>
                  <Button variant='outline' size='sm'>
                    <FiEdit3 className='w-4 h-4 mr-2' />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <FiUser className='w-5 h-5 mr-2 text-blue-600' />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-gray-500'>
                    First Name
                  </label>
                  <p className='text-lg'>
                    {profile?.first_name || 'Not provided'}
                  </p>
                </div>

                <div className='space-y-1'>
                  <label className='text-sm font-medium text-gray-500'>
                    Last Name
                  </label>
                  <p className='text-lg'>
                    {profile?.last_name || 'Not provided'}
                  </p>
                </div>

                <div className='space-y-1'>
                  <label className='text-sm font-medium text-gray-500'>
                    Username
                  </label>
                  <p className='text-lg font-mono'>{profile?.username}</p>
                </div>

                <div className='space-y-1'>
                  <label className='text-sm font-medium text-gray-500'>
                    Email Address
                  </label>
                  <p className='text-lg flex items-center'>
                    <FiMail className='w-4 h-4 mr-2 text-gray-400' />
                    {profile?.email || 'Not provided'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

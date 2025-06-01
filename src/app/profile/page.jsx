'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetProfileQuery } from '@/lib/store/authApi';
import { FiUser, FiMail, FiCalendar, FiEdit, FiLoader } from 'react-icons/fi';

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
                <Button variant='outline'>
                  <FiEdit className='w-4 h-4 mr-2' />
                  Edit Profile
                </Button>
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

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <FiCalendar className='w-5 h-5 mr-2 text-green-600' />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-gray-500'>
                    User ID
                  </label>
                  <p className='text-lg font-mono'>#{profile?.id}</p>
                </div>

                <div className='space-y-1'>
                  <label className='text-sm font-medium text-gray-500'>
                    Account Status
                  </label>
                  <Badge
                    className={`w-fit ${
                      profile?.is_active
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    {profile?.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {profile?.date_joined && (
                  <div className='space-y-1'>
                    <label className='text-sm font-medium text-gray-500'>
                      Member Since
                    </label>
                    <p className='text-lg'>
                      {new Date(profile.date_joined).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                )}

                {profile?.last_login && (
                  <div className='space-y-1'>
                    <label className='text-sm font-medium text-gray-500'>
                      Last Login
                    </label>
                    <p className='text-lg'>
                      {new Date(profile.last_login).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Permissions/Groups (if available) */}
          {(profile?.groups?.length > 0 ||
            profile?.user_permissions?.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Permissions & Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {profile?.groups?.length > 0 && (
                    <div>
                      <label className='text-sm font-medium text-gray-500 block mb-2'>
                        Groups
                      </label>
                      <div className='flex flex-wrap gap-2'>
                        {profile.groups.map((group, index) => (
                          <Badge key={index} variant='secondary'>
                            {group.name || group}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile?.user_permissions?.length > 0 && (
                    <div>
                      <label className='text-sm font-medium text-gray-500 block mb-2'>
                        Permissions
                      </label>
                      <div className='flex flex-wrap gap-2'>
                        {profile.user_permissions.map((permission, index) => (
                          <Badge key={index} variant='outline'>
                            {permission.name || permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Debug Information (only show in development) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className='border-dashed border-gray-300'>
              <CardHeader>
                <CardTitle className='text-gray-500'>
                  Debug Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className='text-xs bg-gray-100 p-4 rounded overflow-auto max-h-60'>
                  {JSON.stringify(profile, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

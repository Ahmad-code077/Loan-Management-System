'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FiArrowLeft,
  FiEdit,
  FiMail,
  FiUser,
  FiSettings,
  FiTrash2,
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
} from 'react-icons/fi';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGetUserDetailsQuery } from '@/lib/store/authApi';
import { useToast } from '@/hooks/use-toast';
import EditUserModal from '../EditUserModal';
import DeleteUserModal from '../DeleteUserModal';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { toast } = useToast();

  // API hooks
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useGetUserDetailsQuery(id);
  console.log('user details:', user);

  const handleUserUpdated = (updatedUser) => {
    refetchUser(); // Refetch user data from API
    setShowEditModal(false);

    toast({
      title: 'User Updated',
      description: 'User information has been successfully updated.',
      variant: 'default',
    });
  };

  const handleUserDeleted = () => {
    setShowDeleteModal(false);

    toast({
      title: 'User Deleted',
      description: 'User has been successfully deleted.',
      variant: 'default',
    });

    // Navigate back to users list after a short delay
    setTimeout(() => {
      router.push('/admin-dashboard/users');
    }, 1500);
  };

  // Loading state
  if (userLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center space-x-4'>
          <Link href='/admin-dashboard/users'>
            <Button
              variant='outline'
              size='sm'
              className='border-border text-foreground hover:bg-accent'
            >
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Back to Users
            </Button>
          </Link>
        </div>

        <Card className='border border-border bg-card'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <FiLoader className='w-8 h-8 animate-spin text-primary mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>
                Loading User Details...
              </h3>
              <p className='text-muted-foreground'>
                Please wait while we fetch the user information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (userError) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center space-x-4'>
          <Link href='/admin-dashboard/users'>
            <Button
              variant='outline'
              size='sm'
              className='border-border text-foreground hover:bg-accent'
            >
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Back to Users
            </Button>
          </Link>
        </div>

        <Card className='border border-border bg-card'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <FiAlertCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2 text-red-600'>
                Failed to Load User
              </h3>
              <p className='text-muted-foreground mb-4'>
                {userError?.data?.message || userError?.status === 404
                  ? 'The requested user could not be found.'
                  : 'Something went wrong while fetching user details.'}
              </p>
              <div className='flex gap-2 justify-center'>
                <Button onClick={() => refetchUser()} variant='outline'>
                  <FiRefreshCw className='w-4 h-4 mr-2' />
                  Try Again
                </Button>
                <Link href='/admin-dashboard/users'>
                  <Button>Back to Users List</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User not found
  if (!user) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center space-x-4'>
          <Link href='/admin-dashboard/users'>
            <Button
              variant='outline'
              size='sm'
              className='border-border text-foreground hover:bg-accent'
            >
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>
              User Not Found
            </h1>
            <p className='text-muted-foreground mt-1'>
              The requested user with ID #{id} could not be found.
            </p>
          </div>
        </div>

        <Card className='border border-border bg-card'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <FiUser className='w-16 h-16 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>User Not Found</h3>
              <p className='text-muted-foreground mb-4'>
                The requested user could not be found in the system.
              </p>
              <Link href='/admin-dashboard/users'>
                <Button>Back to Users List</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Link href='/admin-dashboard/users'>
            <Button
              variant='outline'
              size='sm'
              className='border-border text-foreground hover:bg-accent'
            >
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>User Details</h1>
            <p className='text-muted-foreground mt-1'>
              View and manage user information
            </p>
          </div>
        </div>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            className='border-border'
            onClick={() => refetchUser()}
            disabled={userLoading}
          >
            <FiRefreshCw
              className={`w-4 h-4 mr-2 ${userLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>

          <Button
            onClick={() => setShowEditModal(true)}
            className='bg-primary text-primary-foreground hover:bg-primary/90'
          >
            <FiEdit className='w-4 h-4 mr-2' />
            Edit User
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <Card className='border border-border bg-card'>
            <CardHeader>
              <CardTitle className='flex items-center text-card-foreground'>
                <FiUser className='w-5 h-5 mr-2' />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    User ID
                  </label>
                  <p className='text-lg font-medium text-card-foreground'>
                    #{user.id}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Username
                  </label>
                  <p className='text-lg font-medium text-card-foreground'>
                    {user.username || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Email Address
                  </label>
                  <p className='text-lg text-card-foreground'>
                    {user.email || 'No email provided'}
                  </p>
                </div>

                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    First Name
                  </label>
                  <p className='text-lg text-card-foreground'>
                    {user.first_name || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Last Name
                  </label>
                  <p className='text-lg text-card-foreground'>
                    {user.last_name || 'Not provided'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card className='border border-border bg-card'>
            <CardHeader>
              <CardTitle className='flex items-center text-card-foreground'>
                <FiSettings className='w-5 h-5 mr-2' />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Button
                variant='outline'
                className='w-full border-border text-foreground hover:bg-accent'
                onClick={() => setShowEditModal(true)}
              >
                <FiEdit className='w-4 h-4 mr-2' />
                Edit User Details
              </Button>

              <Button
                variant='outline'
                className='w-full border-border text-destructive hover:bg-destructive/10'
                onClick={() => setShowDeleteModal(true)}
              >
                <FiTrash2 className='w-4 h-4 mr-2' />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <EditUserModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {/* Delete User Modal - Keep as dummy for now */}
      {showDeleteModal && (
        <DeleteUserModal
          user={user}
          onClose={() => setShowDeleteModal(false)}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </div>
  );
}

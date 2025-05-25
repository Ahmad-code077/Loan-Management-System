'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FiArrowLeft,
  FiEdit,
  FiMail,
  FiUser,
  FiSettings,
} from 'react-icons/fi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { users } from '../page';

export default function UserDetailPage() {
  const { id } = useParams();
  const userId = parseInt(id);

  const user = users.find((u) => u.id === userId);

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
              The requested user could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleEditUser = () => {
    console.log('Edit user:', userId);
  };

  const handleSendEmail = () => {
    if (!user.email) {
      alert('This user has no email address.');
      return;
    }
    console.log('Send email to user:', userId);
  };

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
          {user.email && (
            <Button
              variant='outline'
              onClick={handleSendEmail}
              className='border-border text-foreground hover:bg-accent'
            >
              <FiMail className='w-4 h-4 mr-2' />
              Send Email
            </Button>
          )}
          <Button
            onClick={handleEditUser}
            className='bg-primary text-primary-foreground hover:bg-primary/90'
          >
            <FiEdit className='w-4 h-4 mr-2' />
            Edit User
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* User Information */}
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
                    ID
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
                    {user.username}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Email
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

        {/* User Actions */}
        <div className='space-y-6'>
          <Card className='border border-border bg-card'>
            <CardHeader>
              <CardTitle className='flex items-center text-card-foreground'>
                <FiSettings className='w-5 h-5 mr-2' />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Button
                variant='outline'
                className='w-full border-border text-foreground hover:bg-accent'
                onClick={handleEditUser}
              >
                Edit User Details
              </Button>
              {user.email && (
                <Button
                  variant='outline'
                  className='w-full border-border text-foreground hover:bg-accent'
                  onClick={handleSendEmail}
                >
                  Send Email
                </Button>
              )}
              <Button
                variant='outline'
                className='w-full border-border text-destructive hover:bg-destructive/10'
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

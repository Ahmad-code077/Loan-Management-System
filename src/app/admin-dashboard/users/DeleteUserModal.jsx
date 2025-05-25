'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiX, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { deleteUser } from './dummyUserData';
import { useState } from 'react';

export default function DeleteUserModal({ user, onClose, onUserDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const deletedUser = deleteUser(user.id);
      if (deletedUser) {
        onUserDeleted(deletedUser);
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md border border-border bg-card'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center text-card-foreground'>
            <FiTrash2 className='w-5 h-5 mr-2 text-destructive' />
            Delete User
          </CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={onClose}
            className='border-border'
            disabled={isDeleting}
          >
            <FiX className='w-4 h-4' />
          </Button>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-start space-x-3'>
            <div className='flex-shrink-0'>
              <FiAlertTriangle className='w-6 h-6 text-destructive mt-1' />
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-card-foreground mb-2'>
                Are you sure?
              </h3>
              <p className='text-muted-foreground mb-4'>
                This action cannot be undone. This will permanently delete the
                user account and remove all associated data.
              </p>

              {/* User Info */}
              <div className='bg-muted/20 rounded-lg p-3 border border-border'>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Username:</span>
                    <span className='text-card-foreground font-medium'>
                      {user.username}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>ID:</span>
                    <span className='text-card-foreground font-medium'>
                      #{user.id}
                    </span>
                  </div>
                  {user.email && (
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Email:</span>
                      <span className='text-card-foreground font-medium'>
                        {user.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='flex space-x-2 pt-4'>
            <Button
              variant='outline'
              onClick={onClose}
              className='flex-1 border-border'
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className='flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90'
              disabled={isDeleting}
            >
              <FiTrash2 className='w-4 h-4 mr-2' />
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

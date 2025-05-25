'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiX, FiUser, FiSave } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editUserSchema } from '@/schema/userSchema';
import { updateUser } from './dummyUserData';

export default function EditUserModal({ user, onClose, onUserUpdated }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      username: user.username,
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const updatedUser = updateUser(user.id, data);
      if (updatedUser) {
        onUserUpdated(updatedUser);
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md border border-border bg-card max-h-[90vh] overflow-y-auto'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center text-card-foreground'>
            <FiUser className='w-5 h-5 mr-2' />
            Edit User
          </CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={onClose}
            className='border-border'
          >
            <FiX className='w-4 h-4' />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Username field */}
            <div className='space-y-2'>
              <Input
                {...register('username')}
                placeholder='Username'
                className='bg-input border-border text-foreground'
              />
              {errors.username && (
                <span className='text-sm text-destructive'>
                  {errors.username.message}
                </span>
              )}
            </div>

            {/* Email field */}
            <div className='space-y-2'>
              <Input
                {...register('email')}
                type='email'
                placeholder='Email'
                className='bg-input border-border text-foreground'
              />
              {errors.email && (
                <span className='text-sm text-destructive'>
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* First Name field */}
            <div className='space-y-2'>
              <Input
                {...register('first_name')}
                placeholder='First Name'
                className='bg-input border-border text-foreground'
              />
              {errors.first_name && (
                <span className='text-sm text-destructive'>
                  {errors.first_name.message}
                </span>
              )}
            </div>

            {/* Last Name field */}
            <div className='space-y-2'>
              <Input
                {...register('last_name')}
                placeholder='Last Name'
                className='bg-input border-border text-foreground'
              />
              {errors.last_name && (
                <span className='text-sm text-destructive'>
                  {errors.last_name.message}
                </span>
              )}
            </div>

            <div className='flex space-x-2 pt-4'>
              <Button
                type='submit'
                className='flex-1 bg-primary text-primary-foreground hover:bg-primary/90'
                disabled={isSubmitting}
              >
                <FiSave className='w-4 h-4 mr-2' />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='flex-1 border-border'
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

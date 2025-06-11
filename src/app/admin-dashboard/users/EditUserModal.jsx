'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiX, FiLoader, FiCheck, FiUser, FiLock } from 'react-icons/fi';
import { useUpdateUserMutation } from '@/lib/store/authApi';
import { useToast } from '@/hooks/use-toast';

// ✅ Updated validation schema - only first_name and last_name are editable
const userProfileSchema = z.object({
  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .regex(
      /^[a-zA-Z\s]+$/,
      'First name should only contain letters and spaces'
    ),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name should only contain letters and spaces'),
});

export default function EditUserModal({ user, onClose, onUserUpdated }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // API hook for updating user
  const [updateUser] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
    },
  });

  // Watch form values for preview
  const watchedValues = watch();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log('Updating user with data:', data);

      // ✅ Only send first_name and last_name
      const result = await updateUser({
        id: user.id,
        userData: {
          first_name: data.first_name.trim(),
          last_name: data.last_name.trim(),
        },
      }).unwrap();

      console.log('User updated successfully:', result);

      toast({
        title: 'User Updated ✅',
        description: `${data.first_name} ${data.last_name}'s profile has been updated successfully.`,
        variant: 'default',
      });

      onUserUpdated(result);
      onClose();
    } catch (error) {
      console.error('Failed to update user:', error);

      let errorMessage = 'Failed to update user. Please try again.';

      if (error?.data?.first_name) {
        errorMessage = `First name: ${error.data.first_name[0]}`;
      } else if (error?.data?.last_name) {
        errorMessage = `Last name: ${error.data.last_name[0]}`;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.detail) {
        errorMessage = error.data.detail;
      } else if (error?.data) {
        // Handle field-specific errors
        const fieldErrors = Object.values(error.data).flat();
        if (fieldErrors.length > 0) {
          errorMessage = fieldErrors.join(', ');
        }
      }

      toast({
        title: 'Update Failed ❌',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center gap-2'>
            <FiUser className='w-5 h-5 text-primary' />
            <h2 className='text-xl font-bold text-foreground'>
              Edit User Profile
            </h2>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={onClose}
            disabled={isSubmitting}
          >
            <FiX className='w-4 h-4' />
          </Button>
        </div>

        {/* Current User Info - Read Only */}
        <div className='mb-6 p-4 bg-muted/30 rounded-lg border border-border'>
          <h4 className='font-medium text-foreground mb-3 flex items-center'>
            <FiLock className='w-4 h-4 mr-2 text-muted-foreground' />
            Read-only Information
          </h4>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Username:</span>
              <span className='font-medium text-foreground'>
                {user.username}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Email:</span>
              <span className='font-medium text-foreground'>{user.email}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>User ID:</span>
              <span className='font-medium text-foreground'>#{user.id}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* First Name - Editable */}
          <div>
            <label className='block text-sm font-medium mb-2 text-foreground'>
              First Name *
            </label>
            <Input
              {...register('first_name')}
              placeholder='Enter first name'
              className={`bg-background border-border ${
                errors.first_name ? 'border-red-500' : ''
              }`}
              disabled={isSubmitting}
            />
            {errors.first_name && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.first_name.message}
              </p>
            )}
          </div>

          {/* Last Name - Editable */}
          <div>
            <label className='block text-sm font-medium mb-2 text-foreground'>
              Last Name *
            </label>
            <Input
              {...register('last_name')}
              placeholder='Enter last name'
              className={`bg-background border-border ${
                errors.last_name ? 'border-red-500' : ''
              }`}
              disabled={isSubmitting}
            />
            {errors.last_name && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.last_name.message}
              </p>
            )}
          </div>

          {/* Preview Changes */}
          {isDirty && (
            <div className='bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800'>
              <h4 className='font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center'>
                <FiCheck className='w-4 h-4 mr-2' />
                Preview Changes
              </h4>
              <div className='text-sm text-blue-700 dark:text-blue-300'>
                <p>
                  <strong>Current:</strong> {user.first_name} {user.last_name}
                </p>
                <p>
                  <strong>New:</strong> {watchedValues.first_name}{' '}
                  {watchedValues.last_name}
                </p>
              </div>
            </div>
          )}

          {/* Restrictions Notice */}
          <div className='bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800'>
            <h4 className='font-medium text-amber-900 dark:text-amber-100 mb-2'>
              ℹ️ Editing Restrictions
            </h4>
            <div className='text-sm text-amber-700 dark:text-amber-300 space-y-1'>
              <p>• Only first name and last name can be edited</p>
              <p>• Username and email cannot be changed</p>
              <p>• Contact system administrator for account changes</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='pt-4 border-t border-border'>
            <div className='flex space-x-3'>
              <Button
                type='submit'
                className='flex-1'
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className='w-4 h-4 mr-2 animate-spin' />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiCheck className='w-4 h-4 mr-2' />
                    Update User
                  </>
                )}
              </Button>
              <Button
                type='button'
                variant='outline'
                className='flex-1'
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Form Status */}
          {!isDirty && (
            <p className='text-center text-sm text-muted-foreground'>
              Make changes to enable the update button
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

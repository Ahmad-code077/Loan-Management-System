'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateUserProfileMutation } from '@/lib/store/authApi';
import { FiSave, FiLoader, FiX, FiCheck } from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';

// ✅ Zod validation schema
const profileUpdateSchema = z.object({
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

export default function EditProfileForm({ user, onProfileUpdate }) {
  const router = useRouter();
  const { toast } = useToast();

  // ✅ API hook for updating profile
  const [updateProfile, { isLoading: updating }] =
    useUpdateUserProfileMutation();

  // ✅ React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
    },
    mode: 'onChange', // Validate on change
  });

  // Watch form values for real-time preview
  const watchedValues = watch();

  // ✅ Form submission handler
  const onSubmit = async (data) => {
    try {
      console.log('Updating profile with:', data);

      // ✅ Call API with only first_name and last_name
      const result = await updateProfile({
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
      }).unwrap();

      console.log('Profile updated successfully:', result);

      // ✅ Trigger profile data refresh
      if (onProfileUpdate) {
        await onProfileUpdate();
      }

      toast({
        title: 'Profile Updated Successfully! ✅',
        description: 'Your name has been updated.',
        variant: 'default',
      });

      // ✅ Redirect after successful update
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error) {
      console.error('Profile update failed:', error);

      // ✅ Handle specific error messages
      let errorMessage = 'Failed to update profile. Please try again.';

      if (error?.data?.first_name) {
        errorMessage = `First name: ${error.data.first_name[0]}`;
      } else if (error?.data?.last_name) {
        errorMessage = `Last name: ${error.data.last_name[0]}`;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.detail) {
        errorMessage = error.data.detail;
      }

      toast({
        title: 'Update Failed ❌',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // ✅ Reset form to original values
  const handleReset = () => {
    reset({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Current Profile Info */}
      <div className='bg-muted/30 p-4 rounded-lg border border-border'>
        <h4 className='font-medium text-foreground mb-2 flex items-center'>
          <FiCheck className='w-4 h-4 mr-2 text-green-600' />
          Current Information
        </h4>
        <div className='text-sm text-muted-foreground space-y-1'>
          <p>
            <strong>Full Name:</strong> {user?.first_name} {user?.last_name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Username:</strong> {user?.username}
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* First Name */}
        <div className='space-y-2'>
          <Label htmlFor='first_name' className='text-sm font-medium'>
            First Name *
          </Label>
          <Input
            id='first_name'
            {...register('first_name')}
            type='text'
            placeholder='Enter your first name'
            className={errors.first_name ? 'border-red-500' : ''}
            disabled={updating}
          />
          {errors.first_name && (
            <p className='text-red-500 text-sm flex items-center'>
              <FiX className='w-3 h-3 mr-1' />
              {errors.first_name.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className='space-y-2'>
          <Label htmlFor='last_name' className='text-sm font-medium'>
            Last Name *
          </Label>
          <Input
            id='last_name'
            {...register('last_name')}
            type='text'
            placeholder='Enter your last name'
            className={errors.last_name ? 'border-red-500' : ''}
            disabled={updating}
          />
          {errors.last_name && (
            <p className='text-red-500 text-sm flex items-center'>
              <FiX className='w-3 h-3 mr-1' />
              {errors.last_name.message}
            </p>
          )}
        </div>
      </div>

      {/* Preview Changes */}
      {isDirty && (
        <div className='bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
          <h4 className='font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center'>
            <FiCheck className='w-4 h-4 mr-2' />
            Preview Changes
          </h4>
          <div className='text-sm text-blue-700 dark:text-blue-300'>
            <p>
              <strong>New name will be:</strong> {watchedValues.first_name}{' '}
              {watchedValues.last_name}
            </p>
          </div>
        </div>
      )}

      {/* Read-only Information */}
      <div className='bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800'>
        <h4 className='font-medium text-amber-900 dark:text-amber-100 mb-2'>
          ℹ️ Read-only Information
        </h4>
        <div className='text-sm text-amber-700 dark:text-amber-300 space-y-1'>
          <p>• Email and username cannot be changed from this form</p>
          <p>• Only first name and last name can be updated</p>
          <p>• Contact support if you need to change other details</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex flex-col sm:flex-row gap-3 pt-4'>
        <Button
          type='submit'
          disabled={updating || !isDirty || !isValid}
          className='flex-1'
        >
          {updating ? (
            <>
              <FiLoader className='w-4 h-4 mr-2 animate-spin' />
              Updating Profile...
            </>
          ) : (
            <>
              <FiSave className='w-4 h-4 mr-2' />
              Save Changes
            </>
          )}
        </Button>

        <Button
          type='button'
          variant='outline'
          onClick={handleReset}
          disabled={updating || !isDirty}
          className='flex-1'
        >
          <FiX className='w-4 h-4 mr-2' />
          Reset Changes
        </Button>

        <Button
          type='button'
          variant='ghost'
          onClick={() => router.push('/profile')}
          disabled={updating}
        >
          Cancel
        </Button>
      </div>

      {/* Form Status */}
      {!isDirty && (
        <p className='text-center text-sm text-muted-foreground'>
          Make changes to your name to enable the save button
        </p>
      )}

      {/* Validation Status */}
      {isDirty && !isValid && (
        <p className='text-center text-sm text-red-500'>
          Please fix the errors above before saving
        </p>
      )}
    </form>
  );
}

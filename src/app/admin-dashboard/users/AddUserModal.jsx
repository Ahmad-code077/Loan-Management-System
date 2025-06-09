'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiX, FiLoader, FiUserPlus } from 'react-icons/fi';
import { useRegisterMutation } from '@/lib/store/authApi';
import { useToast } from '@/hooks/use-toast';

// Validation schema for user registration
const registerUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AddUserModal({ onClose, onUserAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // API hook for registering user
  const [registerUser] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Filter out empty strings and undefined values
      const filteredData = {};
      Object.keys(data).forEach((key) => {
        if (data[key] !== '' && data[key] !== undefined) {
          filteredData[key] = data[key];
        }
      });

      const result = await registerUser(filteredData).unwrap();

      toast({
        title: 'User Created',
        description: 'New user has been successfully registered.',
        variant: 'default',
      });

      onUserAdded(result);
    } catch (error) {
      console.error('Failed to register user:', error);

      let errorMessage = 'Failed to create user. Please try again.';
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.data) {
        // Handle field-specific errors
        const fieldErrors = Object.values(error.data).flat();
        if (fieldErrors.length > 0) {
          errorMessage = fieldErrors.join(', ');
        }
      }

      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center gap-2'>
            <FiUserPlus className='w-5 h-5 text-primary' />
            <h2 className='text-xl font-bold'>Add New User</h2>
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

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>Username *</label>
            <Input
              {...register('username')}
              placeholder='Enter username'
              className={errors.username ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.username && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Email *</label>
            <Input
              type='email'
              {...register('email')}
              placeholder='Enter email address'
              className={errors.email ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Password *</label>
            <Input
              type='password'
              {...register('password')}
              placeholder='Enter password'
              className={errors.password ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>First Name</label>
            <Input
              {...register('first_name')}
              placeholder='Enter first name (optional)'
              className={errors.first_name ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.first_name && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Last Name</label>
            <Input
              {...register('last_name')}
              placeholder='Enter last name (optional)'
              className={errors.last_name ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.last_name && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.last_name.message}
              </p>
            )}
          </div>

          <div className='pt-4 border-t border-gray-200'>
            <div className='flex space-x-3'>
              <Button type='submit' className='flex-1' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <FiLoader className='w-4 h-4 mr-2 animate-spin' />
                    Creating...
                  </>
                ) : (
                  <>
                    <FiUserPlus className='w-4 h-4 mr-2' />
                    Create User
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
        </form>

        <div className='mt-4 p-3 bg-gray-50 rounded-lg'>
          <p className='text-xs text-gray-500'>
            <strong>Note:</strong> Fields marked with * are required. The new
            user will be able to log in immediately with the provided
            credentials.
          </p>
        </div>
      </div>
    </div>
  );
}

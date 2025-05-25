// filepath: c:\Users\PMLS\Desktop\shahzaib\src\app\admin-dashboard\users\AddUserModal.jsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiX, FiUser } from 'react-icons/fi';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addUserSchema } from '@/schema/userSchema';
import { addUser } from './dummyUserData';
import { useState } from 'react';

export default function AddUserModal({ onClose, onUserAdded }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log('data', data);
      // Remove password fields before saving (in real app, hash password)
      const { password, confirm_password, ...userData } = data;
      addUser(userData);
      reset();
      onUserAdded();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  console.log('zod errors', errors);
  // Close modal after submission
  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md border border-border bg-card max-h-[90vh] overflow-y-auto'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center text-card-foreground'>
            <FiUser className='w-5 h-5 mr-2' />
            Add New User
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

            {/* Password field */}
            <div className='space-y-2'>
              <div className='relative'>
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  className='bg-input border-border text-foreground pr-10'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                >
                  {showPassword ? (
                    <EyeOffIcon className='h-4 w-4' />
                  ) : (
                    <EyeIcon className='h-4 w-4' />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className='text-sm text-destructive'>
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password field */}
            <div className='space-y-2'>
              <div className='relative'>
                <Input
                  {...register('confirm_password')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirm Password'
                  className='bg-input border-border text-foreground pr-10'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className='h-4 w-4' />
                  ) : (
                    <EyeIcon className='h-4 w-4' />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <span className='text-sm text-destructive'>
                  {errors.confirm_password.message}
                </span>
              )}
            </div>

            <div className='flex space-x-2 pt-4'>
              <Button
                type='submit'
                className='flex-1 bg-primary text-primary-foreground hover:bg-primary/90'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add User'}
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

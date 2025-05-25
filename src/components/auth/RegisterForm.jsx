'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import AuthLayout from './AuthLayout';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { useRegisterMutation } from '@/lib/store/authApi';

// Define the registration schema with Zod
const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Please enter a valid email address'),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    password: z.string().min(6, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'], // path of error
  });

export default function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
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
      const result = await register(data).unwrap();

      console.log('result at register ', result);
      // Show success toast
      toast({
        title: 'Registration Successful',
        description:
          'Your account has been created successfully. Please log in.',
        variant: 'default',
      });

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);

      let errorMessage = 'Registration failed. Please try again.';

      if (error.data) {
        if (typeof error.data === 'string') {
          errorMessage = error.data;
        } else if (error.data.detail) {
          errorMessage = error.data.detail;
        } else if (typeof error.data === 'object') {
          errorMessage = Object.entries(error.data)
            .map(
              ([field, errors]) =>
                `${field}: ${Array.isArray(errors) ? errors[0] : errors}`
            )
            .join('\n');
        }
      }

      // Show error toast
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthLayout
      title='Create an Account'
      subtitle='Register to start managing your loans efficiently'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {/* Username field */}
        <div className='space-y-2'>
          <Input
            {...registerField('username')}
            placeholder='Username'
            className='w-full'
          />
          {errors.username && (
            <span className='text-sm text-destructive'>
              {errors.username.message}
            </span>
          )}
        </div>

        {/* First Name field */}
        <div className='space-y-2'>
          <Input
            {...registerField('first_name')}
            placeholder='First Name'
            className='w-full'
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
            {...registerField('last_name')}
            placeholder='Last Name'
            className='w-full'
          />
          {errors.last_name && (
            <span className='text-sm text-destructive'>
              {errors.last_name.message}
            </span>
          )}
        </div>

        {/* Email field */}
        <div className='space-y-2'>
          <Input
            type='email'
            {...registerField('email')}
            placeholder='Email'
            className='w-full'
          />
          {errors.email && (
            <span className='text-sm text-destructive'>
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password field */}
        <div className='space-y-2'>
          <div className='relative'>
            <Input
              type={showPassword ? 'text' : 'password'}
              {...registerField('password')}
              placeholder='Password'
              className='w-full pr-10'
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
              type={showConfirmPassword ? 'text' : 'password'}
              {...registerField('confirm_password')}
              placeholder='Confirm Password'
              className='w-full pr-10'
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

        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
}

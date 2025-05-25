'use client';

import { useForm } from 'react-hook-form';
import { useLoginMutation } from '@/lib/store/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import AuthLayout from './AuthLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiEye, FiEyeOff, FiUser, FiShield } from 'react-icons/fi';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data) => {
    try {
      const result = await login(data);
      console.log('result at login ', result);

      // Check if login was successful
      if (result.data) {
        toast({
          title: 'Welcome back! 👋',
          description: 'Successfully logged into your account',
          variant: 'default',
        });
        router.push('/dashboard');
      }
      // Handle case where result has error
      else if (result.error) {
        toast({
          title: 'Login failed',
          description:
            result.error?.data?.error || 'Please check your credentials',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log('error at login ', error);
      toast({
        title: 'Login failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };
  return (
    <AuthLayout
      title={
        <div className='flex items-center gap-2 text-primary'>
          <FiShield className='w-6 h-6' />
          <span>Welcome back</span>
        </div>
      }
      subtitle='Enter your credentials to access your account'
    >
      <div className='space-y-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <div className='relative'>
              <FiUser className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
              <Input
                {...register('username', { required: 'Username is required' })}
                type='text'
                placeholder='Enter your username'
                className='pl-10'
              />
            </div>
            {errors.username && (
              <span className='text-sm text-destructive flex items-center gap-1'>
                <FiUser className='w-4 h-4' />
                {errors.username.message}
              </span>
            )}
          </div>

          <div className='space-y-2'>
            <div className='relative'>
              <FiLock className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
              <Input
                {...register('password', { required: 'Password is required' })}
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                className='pl-10 pr-10'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
              >
                {showPassword ? (
                  <FiEyeOff className='w-4 h-4' />
                ) : (
                  <FiEye className='w-4 h-4' />
                )}
              </button>
            </div>
            {errors.password && (
              <span className='text-sm text-destructive flex items-center gap-1'>
                <FiLock className='w-4 h-4' />
                {errors.password.message}
              </span>
            )}
          </div>

          <div className='flex items-center justify-between text-sm'>
            <Link
              href='/forgot-password'
              className='text-primary hover:text-primary/80 transition-colors'
            >
              Forgot password?
            </Link>
            <Link
              href='/register'
              className='text-primary hover:text-primary/80 transition-colors'
            >
              Create account
            </Link>
          </div>

          <Button
            type='submit'
            className='w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                Signing in...
              </>
            ) : (
              <>
                <FiLock className='mr-2 h-4 w-4' />
                Sign in securely
              </>
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}

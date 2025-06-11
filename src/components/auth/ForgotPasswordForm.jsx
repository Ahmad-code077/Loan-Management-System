'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import AuthLayout from './AuthLayout';
import { useToast } from '@/hooks/use-toast';
import { usePasswordResetMutation } from '@/lib/store/authApi';

export default function ForgotPasswordForm() {
  const { toast } = useToast();

  // ✅ Use RTK Query mutation instead of custom fetch
  const [passwordReset, { isLoading }] = usePasswordResetMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log('Sending password reset for:', data.email);

      // ✅ Use the RTK Query mutation
      const result = await passwordReset(data).unwrap();

      console.log('Password reset sent successfully:', result);

      toast({
        title: 'Reset Email Sent ✅',
        description: 'Please check your email for password reset instructions.',
        variant: 'default',
      });

      // ✅ Clear the form after successful submission
      reset();
    } catch (error) {
      console.error('Password reset failed:', error);

      // ✅ Handle specific error messages
      let errorMessage = 'Failed to send reset email. Please try again later.';

      if (error?.data?.email) {
        errorMessage = `Email: ${error.data.email[0]}`;
      } else if (error?.data?.detail) {
        errorMessage = error.data.detail;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.non_field_errors) {
        errorMessage = error.data.non_field_errors[0];
      }

      toast({
        title: 'Reset Failed ❌',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthLayout
      title='Forgot Password'
      subtitle='Enter your email to receive password reset instructions'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='space-y-2'>
          <Input
            type='email'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            placeholder='Email address'
            className='w-full'
            disabled={isLoading}
          />
          {errors.email && (
            <span className='text-sm text-destructive'>
              {errors.email.message}
            </span>
          )}
        </div>

        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
          {isLoading ? 'Sending instructions...' : 'Send reset instructions'}
        </Button>

        {/* ✅ Additional help text */}
        <div className='text-center'>
          <p className='text-sm text-muted-foreground'>
            Don&apos;t receive an email? Check your spam folder or{' '}
            <button
              type='button'
              className='text-primary hover:underline'
              onClick={() => window.location.reload()}
            >
              try again
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

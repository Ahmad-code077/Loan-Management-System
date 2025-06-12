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
      console.log('🔄 Starting password reset for:', data.email);

      // ✅ Use the RTK Query mutation
      const result = await passwordReset(data).unwrap();

      console.log('✅ Password reset sent successfully:', result);

      toast({
        title: 'Reset Email Sent ✅',
        description: 'Please check your email for password reset instructions.',
        variant: 'default',
      });

      // ✅ Clear the form after successful submission
      reset();
    } catch (error) {
      // ✅ Enhanced debug logging
      console.log('❌ Password reset failed - Full error object:');
      console.log('Error:', error);
      console.log('Error status:', error?.status);
      console.log('Error data:', error?.data);
      console.log('Error message paths:');
      console.log('  - error.data?.error:', error?.data?.error);
      console.log('  - error.data?.detail:', error?.data?.detail);
      console.log('  - error.data?.message:', error?.data?.message);
      console.log('  - error.data?.email:', error?.data?.email);
      console.log(
        '  - error.data?.non_field_errors:',
        error?.data?.non_field_errors
      );

      // ✅ Simple error handling - show backend error directly
      let errorMessage = 'Failed to send reset email. Please try again later.';

      // ✅ Extract error message from backend response
      if (error?.data?.error) {
        console.log('✅ Using error.data.error:', error.data.error);
        errorMessage = error.data.error;
      } else if (error?.data?.detail) {
        console.log('✅ Using error.data.detail:', error.data.detail);
        errorMessage = error.data.detail;
      } else if (error?.data?.message) {
        console.log('✅ Using error.data.message:', error.data.message);
        errorMessage = error.data.message;
      } else if (error?.data?.email && Array.isArray(error.data.email)) {
        console.log('✅ Using error.data.email[0]:', error.data.email[0]);
        errorMessage = error.data.email[0];
      } else if (error?.data?.email) {
        console.log('✅ Using error.data.email:', error.data.email);
        errorMessage = error.data.email;
      } else if (
        error?.data?.non_field_errors &&
        Array.isArray(error.data.non_field_errors)
      ) {
        console.log(
          '✅ Using error.data.non_field_errors[0]:',
          error.data.non_field_errors[0]
        );
        errorMessage = error.data.non_field_errors[0];
      } else if (error?.data?.non_field_errors) {
        console.log(
          '✅ Using error.data.non_field_errors:',
          error.data.non_field_errors
        );
        errorMessage = error.data.non_field_errors;
      } else {
        console.log('⚠️ Using fallback error message');
      }

      console.log('📢 Final error message to show:', errorMessage);

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

        {/* ✅ Simple help text */}
        <div className='text-center space-y-2'>
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

          <p className='text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <a
              href='/register'
              className='text-primary hover:underline font-medium'
            >
              Create one here
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

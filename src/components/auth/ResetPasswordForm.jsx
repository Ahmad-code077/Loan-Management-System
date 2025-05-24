'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function ResetPasswordForm({ uidb64, token }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/password-reset-confirm/${uidb64}/${token}/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            new_password: data.password,
            re_new_password: data.password_confirm,
          }),
        }
      );

      if (response.ok) {
        toast({
          title: 'Password Reset Successful',
          description:
            'Your password has been reset. Please log in with your new password.',
          variant: 'default',
        });
        router.push('/login');
      } else {
        const error = await response.json();
        toast({
          title: 'Password Reset Failed',
          description:
            error.detail || 'Please try again with a valid reset link.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset password. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <div className='relative'>
          <Input
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: 'New password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
            placeholder='New Password'
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

      <div className='space-y-2'>
        <div className='relative'>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('password_confirm', {
              required: 'Please confirm your new password',
              validate: (val) => {
                if (watch('password') != val) {
                  return 'Passwords do not match';
                }
              },
            })}
            placeholder='Confirm New Password'
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
        {errors.password_confirm && (
          <span className='text-sm text-destructive'>
            {errors.password_confirm.message}
          </span>
        )}
      </div>

      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
        {isLoading ? 'Setting new password...' : 'Set new password'}
      </Button>
    </form>
  );
}

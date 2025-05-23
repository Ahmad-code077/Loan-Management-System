'use client';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '@/lib/store/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      localStorage.setItem('token', result.access);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  return (
    <Card className='p-6 w-full max-w-md'>
      <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <Input
            {...register('username', { required: 'Username is required' })}
            placeholder='Username'
            className='w-full'
          />
          {errors.username && (
            <span className='text-red-500 text-sm'>
              {errors.username.message}
            </span>
          )}
        </div>

        <div>
          <Input
            type='password'
            {...register('password', { required: 'Password is required' })}
            placeholder='Password'
            className='w-full'
          />
          {errors.password && (
            <span className='text-red-500 text-sm'>
              {errors.password.message}
            </span>
          )}
        </div>

        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Card>
  );
}

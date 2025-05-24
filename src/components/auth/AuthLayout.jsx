'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
  title,
  subtitle,
  showBackButton = true,
}) {
  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left side with form */}
      <div className='flex items-center justify-center p-6 bg-background'>
        <div className='w-full max-w-md space-y-6'>
          {showBackButton && (
            <Link
              href='/'
              className='inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Home
            </Link>
          )}

          <div className='space-y-2'>
            <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
            {subtitle && <p className='text-muted-foreground'>{subtitle}</p>}
          </div>

          {children}

          <nav className='pt-6'>
            <ul className='space-y-2 text-sm'>
              {title !== 'Login' && (
                <li>
                  <Link
                    href='/login'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Already have an account? Log in
                  </Link>
                </li>
              )}
              {title !== 'Create an Account' && (
                <li>
                  <Link
                    href='/register'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Don't have an account? Sign up
                  </Link>
                </li>
              )}
              {title !== 'Forgot Password' && (
                <li>
                  <Link
                    href='/forgot-password'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Forgot your password?
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* Right side with info */}
      <div className='hidden lg:block bg-muted'>
        <div className='h-full flex items-center justify-center p-8'>
          <div className='w-full max-w-2xl space-y-8'>
            <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
              <IconComponent />
            </div>
            <div className='space-y-2'>
              <h2 className='text-2xl font-semibold'>
                Welcome to our platform
              </h2>
              <p className='text-muted-foreground'>
                Secure and efficient loan management at your fingertips
              </p>
            </div>
            <div className='grid gap-6'>
              <FeatureItem
                title='Streamlined Process'
                description='Manage all your loans efficiently in one place'
              />
              <FeatureItem
                title='Real-time Updates'
                description='Stay informed with instant notifications and status tracking'
              />
              <FeatureItem
                title='Secure Access'
                description='Your data is protected with industry-standard security'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ title, description }) {
  return (
    <div className='flex space-x-3'>
      <div className='mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center'>
        <CheckIcon />
      </div>
      <div>
        <h3 className='font-medium'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
    </div>
  );
}

function IconComponent() {
  return (
    <svg
      className='w-8 h-8 text-primary'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4'
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className='w-4 h-4 text-primary'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M5 13l4 4L19 7'
      />
    </svg>
  );
}

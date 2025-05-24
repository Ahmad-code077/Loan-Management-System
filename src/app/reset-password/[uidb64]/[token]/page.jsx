'use client';

import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage({ params }) {
  return (
    <main className='min-h-screen flex items-center justify-center p-4'>
      <ResetPasswordForm uidb64={params.uidb64} token={params.token} />
    </main>
  );
}

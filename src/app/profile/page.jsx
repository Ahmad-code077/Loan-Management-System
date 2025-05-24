'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import ProfileForm from '@/components/profile/ProfileForm';
import { Card } from '@/components/ui/card';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/profile/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <Card className='max-w-2xl mx-auto p-6'>
          <h1 className='text-2xl font-bold mb-6'>Profile Settings</h1>
          {/* <ProfileForm initialData={profile} /> */}
        </Card>
      </div>
    </main>
  );
}

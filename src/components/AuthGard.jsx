'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authUtils } from '@/lib/auth/authUtils';

const publicRoutes = ['/login', '/register', '/'];
const protectedRoutes = [
  '/admin-dashboard',
  '/profile',
  '/loans',
  '/documents',
  '/dashboard',
];
const adminRoutes = ['/admin-dashboard'];

export default function AuthGuard({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handleAuthRefresh = () => {
      setTimeout(() => {
        checkAuth();
      }, 500);
    };

    window.addEventListener('auth-refresh', handleAuthRefresh);

    return () => {
      window.removeEventListener('auth-refresh', handleAuthRefresh);
    };
  }, [pathname]);

  const checkAuth = async () => {
    // Check if route is public
    if (publicRoutes.includes(pathname)) {
      const hasAccessToken = !!localStorage.getItem('access_token');
      const hasValidRefresh = authUtils.hasValidRefreshToken();

      if (hasAccessToken && hasValidRefresh) {
        const user = authUtils.getCurrentUser();

        if (user && user.is_superuser === true) {
          router.replace('/admin-dashboard');
          return;
        } else if (user) {
          router.replace('/dashboard');
          return;
        }
      }

      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    // Check if route requires authentication
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      const hasAnyToken = authUtils.isAuthenticated();

      if (!hasAnyToken) {
        router.replace('/login');
        return;
      }

      // Check admin routes
      if (adminRoutes.some((route) => pathname.startsWith(route))) {
        if (authUtils.isAccessTokenValid()) {
          const user = authUtils.getCurrentUser();
          const hasAdminAccess = checkAdminAccess(user);
          console.log('users Data in the Auth Gaurd file', user);
          if (!hasAdminAccess) {
            router.replace('/dashboard');
            return;
          }
        }
      } else {
        if (authUtils.isAccessTokenValid()) {
          const user = authUtils.getCurrentUser();
          console.log('user', user);
          if (user && user.is_superuser === true && pathname === '/dashboard') {
            router.replace('/admin-dashboard');
            return;
          }
        }
      }

      setIsAuthorized(true);
    } else {
      setIsAuthorized(true);
    }

    setIsLoading(false);
  };

  const checkAdminAccess = (user) => {
    return user?.is_superuser === true;
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authUtils } from '@/lib/auth/authUtils';

// Route definitions
const publicRoutes = ['/login', '/register', '/'];
const adminOnlyRoutes = ['/admin-dashboard']; // Only admins can access these
const userRoutes = [
  '/dashboard',
  '/profile',
  '/loans',
  '/documents',
  '/upload-document',
]; // Regular users can access these
const allProtectedRoutes = [...adminOnlyRoutes, ...userRoutes]; // All routes that need authentication

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
      }, 300);
    };

    window.addEventListener('auth-refresh', handleAuthRefresh);
    return () => {
      window.removeEventListener('auth-refresh', handleAuthRefresh);
    };
  }, [pathname]);

  const checkAuth = () => {
    // 1. Check if route is public - no auth needed
    if (publicRoutes.includes(pathname)) {
      handlePublicRoute();
      return;
    }

    // 2. Check if route needs authentication
    if (allProtectedRoutes.some((route) => pathname.startsWith(route))) {
      handleProtectedRoute();
      return;
    }

    // 3. Route doesn't need protection
    setIsAuthorized(true);
    setIsLoading(false);
  };

  const handlePublicRoute = () => {
    // If user is on public route but authenticated, redirect based on role
    if (authUtils.isAuthenticated()) {
      const user = authUtils.getCurrentUser();

      if (user?.is_superuser === true) {
        router.replace('/admin-dashboard');
        return;
      } else if (user) {
        router.replace('/dashboard');
        return;
      }
    }

    // Not authenticated or no user data - allow access to public route
    setIsAuthorized(true);
    setIsLoading(false);
  };

  const handleProtectedRoute = () => {
    // Check if user is authenticated
    if (!authUtils.isAuthenticated()) {
      router.replace('/login');
      return;
    }

    const user = authUtils.getCurrentUser();

    // No user data available - redirect to login
    if (!user) {
      router.replace('/login');
      return;
    }

    const isAdmin = user.is_superuser === true;
    const isAdminRoute = adminOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));

    // Admin trying to access admin routes - allow
    if (isAdmin && isAdminRoute) {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    // Admin trying to access regular user routes (like /dashboard) - redirect to admin dashboard
    if (isAdmin && isUserRoute) {
      router.replace('/admin-dashboard');
      return;
    }

    // Regular user trying to access admin routes - redirect to user dashboard
    if (!isAdmin && isAdminRoute) {
      router.replace('/dashboard');
      return;
    }

    // Regular user trying to access user routes - allow
    if (!isAdmin && isUserRoute) {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    // Fallback - redirect based on role
    if (isAdmin) {
      router.replace('/admin-dashboard');
    } else {
      router.replace('/dashboard');
    }
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

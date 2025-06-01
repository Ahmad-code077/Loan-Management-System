'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  FiUsers,
  FiFileText,
  FiDollarSign,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiHome,
} from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogoutMutation } from '@/lib/store/authApi';
import { authUtils } from '@/lib/auth/authUtils';

const sidebarItems = [
  { href: '/admin-dashboard', icon: FiHome, label: 'Dashboard' },
  { href: '/admin-dashboard/users', icon: FiUsers, label: 'Users' },
  { href: '/admin-dashboard/loans', icon: FiDollarSign, label: 'Loans' },
  { href: '/admin-dashboard/documents', icon: FiFileText, label: 'Documents' },
  {
    href: '/admin-dashboard/loan-types',
    icon: FiSettings,
    label: 'Loan Types',
  },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
  const pathname = usePathname();
  const router = useRouter();

  // Get current user and handle auth refresh events
  useEffect(() => {
    const updateCurrentUser = () => {
      const user = authUtils.getCurrentUser();
      setCurrentUser(user);
    };

    // Initial load
    updateCurrentUser();

    // Listen for auth refresh events
    const handleAuthRefresh = () => {
      updateCurrentUser();
    };

    window.addEventListener('auth-refresh', handleAuthRefresh);

    return () => {
      window.removeEventListener('auth-refresh', handleAuthRefresh);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push('/login');
    } catch (error) {
      // Even if logout API fails, clear local data and redirect
      authUtils.clearAuth();
      router.push('/login');
    }
  };

  // Get user display info with fallbacks
  const getUserDisplayInfo = () => {
    if (currentUser) {
      return {
        name: currentUser.username || currentUser.email || 'Admin',
        email: currentUser.email || 'No email provided',
        initial: (currentUser.username || currentUser.email || 'A')
          .charAt(0)
          .toUpperCase(),
        id: currentUser.id || 'N/A',
        isSuper: currentUser.is_superuser || false,
      };
    }

    // Fallback for when user data is temporarily unavailable
    return {
      name: 'Admin',
      email: 'Loading...',
      initial: 'A',
      id: 'N/A',
      isSuper: true,
    };
  };

  const userInfo = getUserDisplayInfo();

  return (
    <div className='flex h-screen bg-background'>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-sidebar shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-sidebar-border`}
      >
        {/* Sidebar Header */}
        <div className='flex items-center justify-between h-16 px-6 border-b border-sidebar-border bg-gradient-to-r from-primary/5 to-primary/10'>
          <h1 className='text-xl font-bold text-sidebar-foreground flex items-center gap-2'>
            <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
              <FiSettings className='w-4 h-4 text-primary-foreground' />
            </div>
            Admin Panel
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className='lg:hidden text-sidebar-foreground hover:text-sidebar-primary transition-all duration-200 hover:bg-sidebar-accent p-1 rounded-md'
          >
            <FiX className='w-6 h-6' />
          </button>
        </div>

        {/* User Info Section */}
        <div className='px-6 py-4 border-b border-sidebar-border bg-gradient-to-r from-primary/5 to-primary/10'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center'>
              <span className='text-sm font-bold text-primary-foreground'>
                {userInfo.initial}
              </span>
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-sm font-medium text-sidebar-foreground truncate'>
                {userInfo.name}
              </h3>
              <p className='text-xs text-sidebar-foreground/70 truncate'>
                {userInfo.email}
              </p>
              {currentUser && (
                <div className='flex items-center gap-2 mt-1'>
                  <span className='text-xs text-sidebar-foreground/50'>
                    ID: {userInfo.id}
                  </span>
                  {userInfo.isSuper && (
                    <span className='text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium'>
                      ADMIN
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className='mt-6 px-3 flex-1'>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center px-3 py-3 mb-1 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md scale-[1.02] transform'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1 hover:shadow-sm'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className='absolute left-0 top-0 h-full w-1 bg-primary-foreground rounded-r-full'></div>
                )}

                {/* Hover effect background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                    isActive ? 'hidden' : ''
                  }`}
                ></div>

                <Icon
                  className={`w-5 h-5 mr-3 relative z-10 transition-all duration-200 ${
                    isActive
                      ? 'text-primary-foreground'
                      : 'group-hover:scale-110'
                  }`}
                />
                <span className='relative z-10'>{item.label}</span>

                {/* Active pulse effect */}
                {isActive && (
                  <div className='absolute right-3 w-2 h-2 bg-primary-foreground rounded-full animate-pulse'></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className='absolute bottom-0 w-full p-6'>
          <Button
            onClick={handleLogout}
            disabled={logoutLoading}
            variant='outline'
            className='w-full border-sidebar-border text-sidebar-foreground hover:bg-gradient-to-r hover:from-destructive/10 hover:to-destructive/5 hover:border-destructive/20 hover:text-destructive transition-all duration-300 group disabled:opacity-50'
          >
            <FiLogOut className='w-4 h-4 mr-2 group-hover:animate-pulse' />
            {logoutLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <header className='bg-card shadow-sm border-b border-border h-16 flex items-center justify-between px-6 backdrop-blur-sm'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='lg:hidden text-foreground hover:text-primary transition-all duration-200 hover:bg-primary/10 p-2 rounded-lg hover:scale-110'
          >
            <FiMenu className='w-6 h-6' />
          </button>

          <div className='flex items-center space-x-4'>
            <span className='text-sm text-muted-foreground'>Welcome back,</span>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center'>
                <span className='text-xs font-bold text-primary-foreground'>
                  {userInfo.initial}
                </span>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm font-medium text-foreground'>
                  {userInfo.name}
                </span>
                {currentUser && (
                  <span className='text-xs text-muted-foreground'>
                    {userInfo.isSuper ? 'Administrator' : 'User'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 overflow-auto p-6 bg-gradient-to-br from-background to-background/95'>
          {children}
        </main>
      </div>

      {/* Overlay with improved animation */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-300'
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === '/' ||
    path === '/login' ||
    path === '/register' ||
    path === '/forgot-password' ||
    path.startsWith('/reset-password/') ||
    path.startsWith('/api/token');

  // Get all cookies
  const allCookies = request.cookies.getAll();
  console.log('All cookies:', allCookies);

  // Check for authentication tokens with exact names from your backend
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const sessionId = request.cookies.get('sessionid')?.value;

  // User is authenticated if any of these tokens exist
  const isAuthenticated = !!(accessToken || refreshToken || sessionId);

  console.log('Authentication check:', {
    path,
    isAuthenticated,
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    hasSessionId: !!sessionId,
    cookieCount: allCookies.length,
  });

  // Allow API routes to pass through
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Redirect to dashboard if user is authenticated and trying to access auth pages
  if (isPublicPath && isAuthenticated) {
    console.log('Redirecting authenticated user to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to login if user is not authenticated and trying to access protected pages
  if (!isPublicPath && !isAuthenticated) {
    console.log('Redirecting unauthenticated user to login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/profile/:path*',
    '/apply-loan/:path*',
    '/upload-document/:path*',
    '/forgot-password',
    '/reset-password/:path*',
    '/admin-dashboard/:path*',
  ],
};

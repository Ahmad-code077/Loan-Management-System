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

  const token = request.cookies;
  console.log('toekeekdjfladfjlksfjl', token);

  // // Allow API routes to pass through
  // if (path.startsWith('/api/')) {
  //   return NextResponse.next();
  // }

  // // Redirect to dashboard if user is authenticated and trying to access auth pages
  // if (isPublicPath && token) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  // // Redirect to login if user is not authenticated and trying to access protected pages
  // if (!isPublicPath && !token) {
  //   const loginUrl = new URL('/login', request.url);
  //   loginUrl.searchParams.set('from', path);
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

// Configure which routes to run middleware on
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
  ],
};

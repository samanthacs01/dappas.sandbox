import withAuth from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { addFromToUrl } from './core/lib/request';

export const config = {
  matcher: [
    '/((?!api|login|activate-account|link-sent|recover-password|reset-password|_next/static|_next/image|assets|favicon.ico|sw.js|auth/).*)',
  ],
};

export default withAuth(
  function middleware(req) {
    if (
      req.nextauth.token?.role === 'production' &&
      !req.nextUrl.pathname.startsWith('/production')
    ) {
      return NextResponse.redirect(
        new URL(addFromToUrl('/production/overview'), req.url),
      );
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const currentPath = request.nextUrl.pathname;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', currentPath);
    return NextResponse.redirect(loginUrl);
  }

  if (currentPath.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/checkout',
    '/my-cart',
    '/profile',
    '/my-bookings',
    '/admin/:path*'
  ],
};

import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
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
    '/admin/:path*'  // jangan lupa ini kalau mau proteksi /admin
  ],
};

import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const protectedRoutes = ['/dashboard', '/profile', '/requests'];

  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/requests/:path*'],
};
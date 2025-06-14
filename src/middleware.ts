import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('Middleware called for path:', request.nextUrl.pathname);

  // Check if the user is trying to access admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      console.log('Allowing access to login page');
      return NextResponse.next()
    }

    // For now, allow all admin routes for testing
    console.log('Allowing access to admin route:', request.nextUrl.pathname);
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
import { NextResponse, type NextRequest } from 'next/server'
import { verifySessionToken } from './auth'

/**
 * Middleware function to verify user session token and enforce role-based route authorization.
 * @param request The incoming Next.js HTTP request object.
 * @returns Response object redirecting or passing through request.
 */
export async function updateSession(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value
  const user = sessionToken ? await verifySessionToken(sessionToken) : null

  const { pathname } = request.nextUrl

  if (
    !user &&
    !pathname.startsWith('/auth') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.includes('.') &&
    pathname !== '/'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Role-based route authorization
  if (user) {
    const role = user.role || 'USER';

    if (pathname.startsWith('/superadmin')) {
      if (role !== 'SUPERADMIN') {
        const url = request.nextUrl.clone();
        url.pathname = role === 'ADMIN' ? '/admin' : '/protected';
        return NextResponse.redirect(url);
      }
    }

    if (pathname.startsWith('/admin')) {
      if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
        const url = request.nextUrl.clone();
        url.pathname = '/protected';
        return NextResponse.redirect(url);
      }
    }

    // Redirect logged-in users visiting auth pages to their land page
    if (pathname === '/auth/login' || pathname === '/auth/sign-up') {
      const url = request.nextUrl.clone();
      url.pathname = role === 'SUPERADMIN' ? '/superadmin' : role === 'ADMIN' ? '/admin' : '/protected';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next()
}

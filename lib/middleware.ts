import { NextResponse, type NextRequest } from 'next/server'
import { verifySessionToken } from './auth'

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

  return NextResponse.next()
}

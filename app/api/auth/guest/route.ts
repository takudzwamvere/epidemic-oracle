import { NextResponse } from 'next/server';
import { createSessionToken } from '@/lib/auth';
import { GUEST_CONFIG } from '@/lib/users';

/**
 * Instant 1-Click Guest Authentication Route.
 * GET or POST directly authenticates as Guest and sets the session cookie.
 */
export async function GET(request: Request) {
  return handleGuestAuth(request);
}

export async function POST(request: Request) {
  return handleGuestAuth(request);
}

async function handleGuestAuth(request: Request) {
  try {
    const token = await createSessionToken({
      id: 'guest-session',
      email: GUEST_CONFIG.email,
      role: 'ADMIN',
      username: GUEST_CONFIG.username,
      province: GUEST_CONFIG.province,
    });

    const url = new URL('/admin', request.url);
    const response = NextResponse.redirect(url);

    response.cookies.set({
      name: 'session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Guest auth error:', error);
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

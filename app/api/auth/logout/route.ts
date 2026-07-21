import { NextResponse } from 'next/server';

/**
 * Handles POST requests to log out users by clearing the session cookie.
 * @returns JSON response confirming successful logout with maxAge 0 session cookie.
 */
export async function POST() {
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  );

  response.cookies.set({
    name: 'session',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}

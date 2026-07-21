import { NextResponse, NextRequest } from 'next/server';
import { getSessionUser } from '@/lib/auth';

/**
 * Handles GET requests to retrieve the active session user details.
 * @param request NextRequest instance containing request context and cookies.
 * @returns JSON response with current user details or authentication error.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/users';
import { createSessionToken } from '@/lib/auth';

/**
 * In-memory user registration route without database requirement.
 */
export async function POST(request: Request) {
  try {
    const { username, email, password, province } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    const newUser = createUser({
      username,
      email,
      province: province || 'Harare',
      is_active: true,
      role: 'USER',
    });

    const token = await createSessionToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      username: newUser.username,
      province: newUser.province,
    });

    const response = NextResponse.json(
      { success: true, message: 'Account created successfully', user: newUser },
      { status: 201 }
    );

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
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

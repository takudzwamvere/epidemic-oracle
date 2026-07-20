import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSessionToken } from '@/lib/auth';

/**
 * POST endpoint for handling user registration, password hashing, and session cookie creation.
 */
export async function POST(request: Request) {
  try {
    const { email, password, username, province } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const resolvedUsername = username || email.split('@')[0];
    const resolvedProvince = province || 'Harare';

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        username: resolvedUsername,
        province: resolvedProvince,
        is_active: true,
        role: 'USER',
      },
    });

    const token = await createSessionToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      username: newUser.username,
      province: newUser.province,
    });

    const response = NextResponse.json(
      { success: true, message: 'Account created successfully', user: { email: newUser.email, username: newUser.username, role: newUser.role, province: newUser.province } },
      { status: 201 }
    );

    response.cookies.set({
      name: 'session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
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

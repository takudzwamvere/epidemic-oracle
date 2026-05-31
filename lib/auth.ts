import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-super-secret-key-32-chars-long-epidemic-prediction'
);

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function createSessionToken(user: { id: string; email: string; role: string; username: string; province: string }): Promise<string> {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
    province: user.province,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSessionUser(request: NextRequest): Promise<any> {
  const token = request.cookies.get('session')?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

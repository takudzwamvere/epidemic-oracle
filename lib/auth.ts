import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-super-secret-key-32-chars-long-epidemic-prediction'
);

/**
 * Hashes a plaintext password using bcrypt.
 * @param password The plaintext password to hash.
 * @returns A promise resolving to the password hash.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * Verifies a plaintext password against a bcrypt hash.
 * @param password The plaintext password to check.
 * @param hash The stored hash to verify against.
 * @returns A promise resolving to true if matching, false otherwise.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Creates and signs a new JWT session token for the user.
 * @param user The user object containing session details.
 * @returns A signed JWT string token.
 */
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

export interface SessionUser {
  id: string;
  email: string;
  role: string;
  username: string;
  province: string;
}

/**
 * Verifies and decodes a JWT session token.
 * @param token The signed JWT session token.
 * @returns The decoded SessionUser payload, or null if invalid.
 */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

/**
 * Retrieves the session user from the request's cookies.
 * @param request The incoming request object.
 * @returns A promise resolving to the SessionUser, or null if not authenticated.
 */
export async function getSessionUser(request: Request | NextRequest): Promise<SessionUser | null> {
  const nextReq = request as NextRequest;
  const token = nextReq.cookies?.get?.('session')?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

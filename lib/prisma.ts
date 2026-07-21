import { PrismaClient } from '../app/generated/prisma';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Singleton instance of PrismaClient to prevent multiple connections in development mode.
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

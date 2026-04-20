import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = (() => {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const rawUrl = process.env.DATABASE_URL;

  if (!rawUrl || rawUrl.length < 10) {
    if (typeof window === 'undefined') {
      console.error("CRITICAL: DATABASE_URL is invalid or missing.");
    }
    return new PrismaClient();
  }

  // Sanitize the URL to remove any hidden whitespace or control characters
  const sanitizedUrl = rawUrl.trim().replace(/[\r\n]/g, '');

  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }

  return client;
})();

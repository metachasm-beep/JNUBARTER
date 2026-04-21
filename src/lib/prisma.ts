import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

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

  // Deep sanitize the URL: remove quotes, newlines, and whitespace
  const sanitizedUrl = rawUrl.trim()
    .replace(/^["']|["']$/g, '') // Remove wrapping quotes
    .replace(/[\r\n]/g, '')
    .replace(/\s/g, '');

  if (typeof window === 'undefined') {
    console.log(`[Prisma] Initializing with Neon Adapter. URL length: ${sanitizedUrl.length}`);
  }

  // PRISMA 7: Must use Driver Adapter for Neon/Postgres
  // Pass the config object directly to the adapter
  const adapter = new PrismaNeon({ connectionString: sanitizedUrl });

  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }

  return client;
})();

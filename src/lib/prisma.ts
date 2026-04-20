import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

// Required for Neon serverless to work in Node.js environments (like Vercel builds)
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws
}

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = (() => {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  if (!connectionString) {
    // If we're on the server and no DB URL is found, we throw a descriptive error
    // instead of letting the Pool fail silently with localhost
    if (typeof window === 'undefined') {
      console.error("CRITICAL: DATABASE_URL is not set in environment variables.");
    }
    // Fallback to a plain client (will likely fail later, but avoids crash on module load)
    return new PrismaClient();
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool as any);
  
  const client = new PrismaClient({
    adapter,
    log: ['query'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }

  return client;
})();

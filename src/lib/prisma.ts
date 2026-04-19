import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-pg'
import ws from 'ws'

// Required for Neon serverless to work in Node.js environments (like Vercel builds)
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws
}

const connectionString = process.env.DATABASE_URL || ''

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

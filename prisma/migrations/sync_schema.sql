-- ============================================================
-- BARTER — Schema Synchronization Script
-- Run this in your Neon/Postgres SQL Editor
-- ============================================================

-- 1. Update Listing table with missing columns
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "isFlagged" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "flagReason" TEXT;
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "isSystem" BOOLEAN NOT NULL DEFAULT false;

-- 2. Create AuditLog table
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT REFERENCES "User"("id"),
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create UsageLog table
CREATE TABLE IF NOT EXISTS "UsageLog" (
    "id" TEXT PRIMARY KEY,
    "feature" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create SystemConfig table
CREATE TABLE IF NOT EXISTS "SystemConfig" (
    "id" TEXT PRIMARY KEY DEFAULT 'GLOBAL',
    "config" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create VerificationReport table
CREATE TABLE IF NOT EXISTS "VerificationReport" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id"),
    "status" TEXT NOT NULL,
    "findings" TEXT,
    "evidence" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Add role to User if missing
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'USER';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isSuspended" BOOLEAN NOT NULL DEFAULT false;

-- 7. Add school, hostel, program etc to User if missing (from newer schema)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "school" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "hostel" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "program" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "year" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bio" TEXT;

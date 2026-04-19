-- ============================================================
-- JNU BARTER — Neon Database Migration (Gemini Optimized)
-- Run this in: Neon Dashboard → SQL Editor
-- ============================================================

-- 1. Enable pgvector extension (Required for Semantic Search #1)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create Enums
DO $$ BEGIN
    CREATE TYPE "ListingType" AS ENUM ('OFFER', 'WANT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "Category" AS ENUM ('SERVICE', 'COMMODITY');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "EffortEstimate" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "SwapStatus" AS ENUM ('PROPOSED', 'COUNTERED', 'ACCEPTED', 'EXECUTED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "NotificationType" AS ENUM ('VOUCH_PROMPT', 'SWAP_MATCHED', 'SWAP_EXPIRED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. Create Tables
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "image" TEXT,
    "bio" TEXT,
    "school" TEXT,
    "hostel" TEXT,
    "program" TEXT,
    "year" TEXT,
    "skills" TEXT[],
    "interests" TEXT[],
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Listing" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id"),
    "type" "ListingType" NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'SERVICE',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT,
    "images" TEXT[],
    "tags" TEXT[],
    "effortEstimate" "EffortEstimate",
    "condition" TEXT,
    "embedding" vector(768), -- Optimized for Gemini text-embedding-004
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast vector similarity search
CREATE INDEX IF NOT EXISTS "Listing_embedding_idx" ON "Listing" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);

CREATE TABLE IF NOT EXISTS "Swap" (
    "id" TEXT PRIMARY KEY,
    "initiatorId" TEXT NOT NULL REFERENCES "User"("id"),
    "receiverId" TEXT NOT NULL REFERENCES "User"("id"),
    "status" "SwapStatus" NOT NULL DEFAULT 'PROPOSED',
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '72 hours'),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "SwapItem" (
    "id" TEXT PRIMARY KEY,
    "swapId" TEXT NOT NULL REFERENCES "Swap"("id"),
    "listingId" TEXT NOT NULL REFERENCES "Listing"("id"),
    "addedById" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT PRIMARY KEY,
    "swapId" TEXT NOT NULL REFERENCES "Swap"("id"),
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Vouch" (
    "id" TEXT PRIMARY KEY,
    "swapId" TEXT UNIQUE NOT NULL REFERENCES "Swap"("id"),
    "senderId" TEXT NOT NULL REFERENCES "User"("id"),
    "receiverId" TEXT NOT NULL REFERENCES "User"("id"),
    "content" TEXT NOT NULL,
    "skillsVouched" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id"),
    "type" "NotificationType" NOT NULL,
    "refId" TEXT NOT NULL REFERENCES "Swap"("id"),
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "PushSubscription" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "endpoint" TEXT UNIQUE NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    UNIQUE("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT PRIMARY KEY,
    "sessionToken" UNIQUE NOT NULL,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "expires" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" UNIQUE NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    UNIQUE("identifier", "token")
);

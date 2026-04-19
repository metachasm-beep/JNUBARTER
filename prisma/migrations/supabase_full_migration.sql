-- ============================================================
-- JNU BARTER — Full Database Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable pgvector for semantic search (#1)
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateEnum
CREATE TYPE IF NOT EXISTS "ListingType" AS ENUM ('OFFER', 'WANT');
CREATE TYPE IF NOT EXISTS "Category" AS ENUM ('SERVICE', 'COMMODITY');
CREATE TYPE IF NOT EXISTS "EffortEstimate" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE IF NOT EXISTS "SwapStatus" AS ENUM ('PROPOSED', 'COUNTERED', 'ACCEPTED', 'EXECUTED', 'CANCELLED');
CREATE TYPE IF NOT EXISTS "NotificationType" AS ENUM ('VOUCH_PROMPT', 'SWAP_MATCHED', 'SWAP_EXPIRED');

-- CreateTable: User
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- CreateTable: Account
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
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
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateTable: Session
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateTable: VerificationToken
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateTable: Listing (with vector embedding column for #1)
CREATE TABLE IF NOT EXISTS "Listing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ListingType" NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'SERVICE',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT,
    "images" TEXT[],
    "tags" TEXT[],
    "effortEstimate" "EffortEstimate",
    "condition" TEXT,
    "embedding" vector(1536),  -- OpenAI text-embedding-3-small dimension
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);
-- IVFFlat index for fast approximate cosine similarity search
CREATE INDEX IF NOT EXISTS "Listing_embedding_idx" ON "Listing" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);

-- CreateTable: Swap
CREATE TABLE IF NOT EXISTS "Swap" (
    "id" TEXT NOT NULL,
    "initiatorId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "SwapStatus" NOT NULL DEFAULT 'PROPOSED',
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '72 hours',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Swap_pkey" PRIMARY KEY ("id")
);

-- CreateTable: SwapItem
CREATE TABLE IF NOT EXISTS "SwapItem" (
    "id" TEXT NOT NULL,
    "swapId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    CONSTRAINT "SwapItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Message
CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT NOT NULL,
    "swapId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Vouch
CREATE TABLE IF NOT EXISTS "Vouch" (
    "id" TEXT NOT NULL,
    "swapId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "skillsVouched" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vouch_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Vouch_swapId_key" ON "Vouch"("swapId");

-- CreateTable: Notification
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "refId" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PushSubscription (for #10)
CREATE TABLE IF NOT EXISTS "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- Foreign Keys
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Swap" ADD CONSTRAINT "Swap_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Swap" ADD CONSTRAINT "Swap_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SwapItem" ADD CONSTRAINT "SwapItem_swapId_fkey" FOREIGN KEY ("swapId") REFERENCES "Swap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SwapItem" ADD CONSTRAINT "SwapItem_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_swapId_fkey" FOREIGN KEY ("swapId") REFERENCES "Swap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Vouch" ADD CONSTRAINT "Vouch_swapId_fkey" FOREIGN KEY ("swapId") REFERENCES "Swap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Vouch" ADD CONSTRAINT "Vouch_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Vouch" ADD CONSTRAINT "Vouch_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_refId_fkey" FOREIGN KEY ("refId") REFERENCES "Swap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Supabase RPC: semantic_listing_search (for #1)
CREATE OR REPLACE FUNCTION semantic_listing_search(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id text,
  title text,
  description text,
  type "ListingType",
  category "Category",
  tags text[],
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.title,
    l.description,
    l.type,
    l.category,
    l.tags,
    1 - (l.embedding <=> query_embedding) AS similarity
  FROM "Listing" l
  WHERE l.embedding IS NOT NULL
    AND 1 - (l.embedding <=> query_embedding) > match_threshold
  ORDER BY l.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Supabase RPC: update_listing_embedding (for #1)
CREATE OR REPLACE FUNCTION update_listing_embedding(
  p_listing_id text,
  p_embedding vector(1536)
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE "Listing"
  SET embedding = p_embedding,
      "updatedAt" = CURRENT_TIMESTAMP
  WHERE id = p_listing_id;
END;
$$;

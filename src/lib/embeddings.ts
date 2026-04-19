/**
 * JNU BARTER — Semantic Embedding Engine (Gemini Powered)
 * Uses Google text-embedding-004 (768d).
 * This model is free within generous quotas (1500 RPM).
 */

import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const EMBEDDING_MODEL = "text-embedding-004";

/**
 * Generate a semantic embedding vector for a listing's title + description.
 * Returns null gracefully if GOOGLE_AI_API_KEY is absent.
 */
export async function embedText(text: string): Promise<number[] | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.warn("[embeddings] GOOGLE_AI_API_KEY not set — skipping embedding");
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    
    const result = await model.embedContent(text.slice(0, 5000));
    const embedding = result.embedding.values;

    return embedding;
  } catch (err) {
    console.error("[embeddings] Gemini failed:", err);
    return null;
  }
}

/**
 * Formats a listing for embedding — combines title, description, tags.
 */
export function listingToEmbedText(
  title: string,
  description: string,
  tags: string[] = []
): string {
  return [
    title,
    description,
    tags.length > 0 ? `Tags: ${tags.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join(". ");
}

/**
 * Persist an embedding vector for a listing via Prisma raw SQL.
 */
export async function persistListingEmbedding(
  listingId: string,
  embedding: number[]
): Promise<void> {
  try {
    const vectorString = `[${embedding.join(",")}]`;
    
    await prisma.$executeRawUnsafe(
      `UPDATE "Listing" SET embedding = $1::vector, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2`,
      vectorString,
      listingId
    );
  } catch (err) {
    console.error("[embeddings] persist failed:", err);
  }
}

import { NextResponse } from "next/server";
import { embedText } from "@/lib/embeddings";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const threshold = parseFloat(searchParams.get("threshold") ?? "0.65");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10"), 20);

  if (!query || query.trim().length < 3) {
    return NextResponse.json(
      { error: "Query must be at least 3 characters" },
      { status: 400 }
    );
  }

  // Generate embedding for the user's query
  const embedding = await embedText(query);

  // If no embedding (no API key), fall back to Postgres full-text search
  if (!embedding) {
    const fallback = await prisma.listing.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { has: query.toLowerCase() } },
        ],
      },
      include: {
        user: {
          select: { id: true, name: true, school: true, reputation: true, isVerified: true },
        },
      },
      take: limit,
    });
    return NextResponse.json({
      results: fallback,
      mode: "full-text-fallback",
    });
  }

  try {
    const vectorString = `[${embedding.join(",")}]`;

    // Direct pgvector cosine similarity search in Neon/Postgres
    // (1 - cosine_distance) = cosine_similarity
    const matches: any[] = await prisma.$queryRawUnsafe(
      `SELECT id, title, description, type, category, tags,
       1 - (embedding <=> $1::vector) AS similarity
       FROM "Listing"
       WHERE embedding IS NOT NULL
       AND 1 - (embedding <=> $1::vector) > $2
       ORDER BY embedding <=> $1::vector
       LIMIT $3`,
      vectorString,
      threshold,
      limit
    );

    // Hydrate results with full User data from Prisma
    const ids = matches.map((m) => m.id);
    const listings = await prisma.listing.findMany({
      where: { id: { in: ids } },
      include: {
        user: {
          select: { id: true, name: true, school: true, reputation: true, isVerified: true },
        },
      },
    });

    // Restore original similarity ordering
    const ordered = matches
      .map((m) => listings.find((l) => l.id === m.id))
      .filter(Boolean);

    return NextResponse.json({ results: ordered, mode: "semantic" });
  } catch (error: any) {
    console.error("[semantic-search] error:", error);
    return NextResponse.json(
      { error: "Search failed", detail: error.message },
      { status: 500 }
    );
  }
}

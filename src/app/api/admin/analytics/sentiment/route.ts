import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch recent listings to analyze
    const listings = await prisma.listing.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: { title: true, description: true }
    });

    const content = listings.map(l => `${l.title}: ${l.description}`).join("\n");

    // 2. In a real scenario, we'd call an LLM here. 
    // For now, we'll simulate the AI analysis logic based on keyword density.
    const words = content.toLowerCase().split(/\W+/);
    const positiveWords = ["help", "tutor", "share", "collaboration", "learning", "expert"];
    const negativeWords = ["broken", "scam", "useless", "pay", "money", "urgent"];
    
    let score = 50; // Neutral start
    words.forEach(w => {
      if (positiveWords.includes(w)) score += 2;
      if (negativeWords.includes(w)) score -= 3;
    });

    score = Math.max(0, Math.min(100, score));
    
    let label = "STABLE";
    if (score > 70) label = "VIBRANT";
    if (score < 30) label = "TURBULENT";

    // 3. Create the Audit Log entry
    const log = await (prisma.auditLog as any).create({
      data: {
        action: "SENTIMENT_ANALYSIS",
        entity: "NETWORK",
        userId: (session.user as any).id,
        metadata: { score, label, analyzedCount: listings.length }
      }
    });

    return NextResponse.json({ sentiment: { score, label }, log });
  } catch (error) {
    console.error("Sentiment analysis failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

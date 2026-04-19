import { NextResponse } from "next/server";
import { findBarterChains } from "@/lib/barter-engine";

export const dynamic = "force-dynamic";
export const revalidate = 60; // cache for 60s — chains don't change that fast

export async function GET() {
  try {
    const chains = await findBarterChains();
    return NextResponse.json({ chains });
  } catch (error) {
    console.error("[GET /api/chains]", error);
    // Return empty array rather than 500 — Neo4j may not be connected in dev
    return NextResponse.json({ chains: [] });
  }
}

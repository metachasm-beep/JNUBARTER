import { NextResponse } from "next/server";
import { findBarterChains } from "@/lib/barter-engine";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const chains = await findBarterChains(session.user.id);
    return NextResponse.json({ chains });
  } catch (error) {
    console.error("[GET /api/chains]", error);
    // Return empty array rather than 500 — Neo4j may not be connected in dev
    return NextResponse.json({ chains: [] });
  }
}

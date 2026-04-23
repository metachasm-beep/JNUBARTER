import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const total = await prisma.listing.count();
    const listings = await prisma.listing.findMany({
      take: 10,
      include: { user: { select: { name: true, isVerified: true } } }
    });
    
    return NextResponse.json({
      total,
      count: listings.length,
      listings: listings.map(l => ({
        id: l.id,
        title: l.title,
        type: l.type,
        isVerified: l.user.isVerified,
        isFlagged: l.isFlagged
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

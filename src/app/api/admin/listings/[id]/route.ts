import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch listing to log its deletion
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    // 2. Perform deletion and log
    await prisma.$transaction([
      prisma.listing.delete({ where: { id } }),
      prisma.auditLog.create({
        data: {
          userId: listing.userId,
          action: "LISTING_PURGED",
          entity: "LISTING",
          entityId: id,
          metadata: { 
            title: listing.title, 
            reason: "Administrative moderation",
            purgedBy: "ADMIN"
          }
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Listing deletion failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

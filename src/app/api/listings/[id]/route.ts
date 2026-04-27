import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { inngest } from "@/lib/inngest/client";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const isAdmin = (session.user as any)?.role === "ADMIN" || (session.user.email && ADMIN_EMAILS.includes(session.user.email));
    const isOwner = listing.userId === session.user.id;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.listing.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/listings/[id]]", error);
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
  }
}

import { ADMIN_EMAILS } from "@/lib/constants";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = (session.user as any)?.role === "ADMIN" || (session.user.email && ADMIN_EMAILS.includes(session.user.email));
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body;

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: { id: true, name: true, school: true }
        }
      }
    });

    if (status === "APPROVED") {
      await inngest.send({
        name: "barter/listing.approved",
        data: { listingId: id }
      });
    }

    return NextResponse.json({ listing: updatedListing });
  } catch (error) {
    console.error("[PATCH /api/listings/[id]]", error);
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
  }
}

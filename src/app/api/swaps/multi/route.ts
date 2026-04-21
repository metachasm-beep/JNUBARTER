import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { participants } = await req.json();

    if (!Array.isArray(participants) || participants.length < 3) {
      return NextResponse.json(
        { error: "A multi-swap requires at least 3 participants." },
        { status: 400 }
      );
    }

    // Ensure the current user is part of the swap
    const isUserIncluded = participants.some((p: any) => p.userId === session.user.id);
    if (!isUserIncluded) {
      return NextResponse.json(
        { error: "You must be a participant to initiate this swap." },
        { status: 403 }
      );
    }

    // Create the MultiSwap and participants atomically
    const multiSwap = await prisma.multiSwap.create({
      data: {
        status: "PROPOSED",
        participants: {
          create: participants.map((p: any) => ({
            userId: p.userId,
            givingListingId: p.givingListingId,
            receivingTag: p.receivingTag,
            // The initiator auto-confirms their part
            hasConfirmed: p.userId === session.user.id,
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            givingListing: { select: { id: true, title: true } }
          }
        }
      }
    });

    return NextResponse.json({ multiSwap });
  } catch (error) {
    console.error("[POST /api/swaps/multi]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

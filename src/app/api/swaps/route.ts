import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId, receiverId } = await req.json();

    if (!listingId || !receiverId) {
      return new NextResponse("Missing data", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if swap already exists
    const existingSwap = await prisma.swap.findFirst({
      where: {
        initiatorId: user.id,
        receiverId: receiverId,
        status: { in: ["PROPOSED", "ACCEPTED", "COUNTERED"] },
        items: {
          some: { listingId: listingId }
        }
      }
    });

    if (existingSwap) {
      return NextResponse.json(existingSwap);
    }

    // Create new swap
    const swap = await prisma.swap.create({
      data: {
        initiatorId: user.id,
        receiverId: receiverId,
        items: {
          create: {
            listingId: listingId,
            addedById: user.id,
          },
        },
      },
    });

    return NextResponse.json(swap);
  } catch (error) {
    console.error("[SWAPS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

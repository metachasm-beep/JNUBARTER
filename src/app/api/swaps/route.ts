import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { swapLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  try {
    const session = await auth();
    console.log("[SWAPS_POST] Session:", !!session, "User ID:", session?.user?.id);
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 🛡️ IDENTITY GATE: Only verified members may initiate swaps.
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isVerified: true },
    });
    if (!dbUser?.isVerified) {
      return NextResponse.json(
        {
          error: "ID_NOT_VERIFIED",
          message:
            "Your JNU identity has not been verified yet. Please wait for admin approval before initiating swaps.",
        },
        { status: 403 }
      );
    }

    // Ratelimit guard
    const { success } = await swapLimit.limit(session.user.id);
    if (!success) {
      return new NextResponse("Too many swap requests. Please wait.", { status: 429 });
    }

    const { listingId, receiverId } = await req.json();
    console.log("[SWAPS_POST] Data:", { listingId, receiverId });

    if (!listingId || !receiverId) {
      return new NextResponse("Missing data", { status: 400 });
    }

    const userId = session.user.id;
    if (userId === receiverId) {
      return new NextResponse("Cannot swap with yourself", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

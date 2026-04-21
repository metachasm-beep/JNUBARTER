import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const multiSwapId = params.id;

    // Find the participant record for this user
    const participant = await prisma.multiSwapParticipant.findFirst({
      where: {
        multiSwapId,
        userId: session.user.id,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "You are not a participant in this swap." },
        { status: 403 }
      );
    }

    // Update to confirmed
    await prisma.multiSwapParticipant.update({
      where: { id: participant.id },
      data: { hasConfirmed: true },
    });

    // Check if everyone has confirmed
    const allParticipants = await prisma.multiSwapParticipant.findMany({
      where: { multiSwapId },
    });

    const allConfirmed = allParticipants.every((p) => p.hasConfirmed);

    let finalSwap;
    if (allConfirmed) {
      // Execute the multi-swap
      finalSwap = await prisma.multiSwap.update({
        where: { id: multiSwapId },
        data: { status: "EXECUTED" },
        include: { participants: true }
      });
      // In a real system, you would also trigger notifications and transfer ownership of assets here.
    } else {
      finalSwap = await prisma.multiSwap.findUnique({
        where: { id: multiSwapId },
        include: { participants: true }
      });
    }

    return NextResponse.json({ multiSwap: finalSwap, allConfirmed });
  } catch (error) {
    console.error("[PATCH /api/swaps/multi/confirm]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

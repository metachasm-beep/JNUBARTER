import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { inngest } from "@/lib/inngest";

interface RouteContext {
  params: { id: string };
}

/**
 * PATCH /api/swaps/[id]/execute
 * Called when both parties confirm in NegotiationChat.
 * Moves swap to EXECUTED and fires the Inngest vouch-prompt event.
 */
export async function PATCH(_req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const swap = await prisma.swap.findUnique({
    where: { id: params.id },
    select: { initiatorId: true, receiverId: true, status: true },
  });

  if (!swap) {
    return NextResponse.json({ error: "Swap not found" }, { status: 404 });
  }

  const userId = session.user.id;
  if (swap.initiatorId !== userId && swap.receiverId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (swap.status === "EXECUTED") {
    return NextResponse.json({ message: "Already executed" });
  }

  if (swap.status === "CANCELLED") {
    return NextResponse.json(
      { error: "Cannot execute a cancelled swap" },
      { status: 409 }
    );
  }

  // Move to EXECUTED
  const updated = await prisma.swap.update({
    where: { id: params.id },
    data: { status: "EXECUTED" },
    select: { id: true, status: true, initiatorId: true, receiverId: true },
  });

  // Fire Inngest event — triggers vouch prompts + reputation bumps
  await inngest.send({
    name: "barter/swap.executed",
    data: {
      swapId: updated.id,
      initiatorId: updated.initiatorId,
      receiverId: updated.receiverId,
    },
  });

  return NextResponse.json({ swap: updated });
}

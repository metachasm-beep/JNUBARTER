import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

// GET /api/swaps/[id]/messages — load message history
export async function GET(
  _req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const swap = await prisma.swap.findUnique({
      where: { id },
      select: { initiatorId: true, receiverId: true },
    });

    if (!swap) {
      return NextResponse.json({ error: "Swap not found" }, { status: 404 });
    }

    // Only parties to the swap can read messages
    const userId = session.user.id;
    if (swap.initiatorId !== userId && swap.receiverId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { swapId: id },
      orderBy: { createdAt: "asc" },
      take: 200, // reasonable cap
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("[GET /api/swaps/[id]/messages]", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/swaps/[id]/messages — persist a new message
export async function POST(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content } = await req.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Verify the user is a participant in this swap
    const swap = await prisma.swap.findUnique({
      where: { id },
      select: { initiatorId: true, receiverId: true, status: true },
    });

    if (!swap) {
      return NextResponse.json({ error: "Swap not found" }, { status: 404 });
    }

    const userId = session.user.id;
    if (swap.initiatorId !== userId && swap.receiverId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Don't allow messages on cancelled/completed swaps
    if (swap.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Cannot message on a cancelled swap" },
        { status: 409 }
      );
    }

    const message = await prisma.message.create({
      data: {
        swapId: id,
        senderId: userId,
        content: content.trim().slice(0, 2000), // length cap
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/swaps/[id]/messages]", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}

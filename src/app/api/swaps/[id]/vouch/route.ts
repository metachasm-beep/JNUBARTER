import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { z } from "zod";

const VouchSchema = z.object({
  receiverId: z.string().min(1),
  content: z.string().min(10).max(500),
  skillsVouched: z.array(z.string()).max(10),
});

export async function POST(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = VouchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const swap = await prisma.swap.findUnique({
    where: { id },
    select: { initiatorId: true, receiverId: true, status: true },
  });

  if (!swap || swap.status !== "EXECUTED") {
    return NextResponse.json(
      { error: "Swap must be EXECUTED before vouching" },
      { status: 409 }
    );
  }

  const senderId = session.user.id;
  if (swap.initiatorId !== senderId && swap.receiverId !== senderId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const vouch = await prisma.vouch.create({
      data: {
        swapId: id,
        senderId,
        receiverId: parsed.data.receiverId,
        content: parsed.data.content,
        skillsVouched: parsed.data.skillsVouched,
      },
    });

    return NextResponse.json({ vouch }, { status: 201 });
  } catch (error: any) {
    // Unique constraint — vouch already exists for this swap
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Vouch already submitted for this swap" },
        { status: 409 }
      );
    }
    throw error;
  }
}

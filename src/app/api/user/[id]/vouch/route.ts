import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: targetUserId } = await params;

    const vouch = await prisma.profileVouch.findUnique({
      where: {
        voterId_votedId: {
          voterId: session.user.id,
          votedId: targetUserId,
        },
      },
    });

    return NextResponse.json({ hasVouched: !!vouch });
  } catch (error) {
    console.error("[PROFILE_VOUCH_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: targetUserId } = await params;

    if (session.user.id === targetUserId) {
      return new NextResponse("Cannot vouch for yourself", { status: 400 });
    }

    await prisma.$transaction([
      prisma.profileVouch.create({
        data: {
          voterId: session.user.id,
          votedId: targetUserId,
        },
      }),
      prisma.user.update({
        where: { id: targetUserId },
        data: { reputation: { increment: 5 } },
      }),
    ]);

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("[PROFILE_VOUCH_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: targetUserId } = await params;

    await prisma.$transaction([
      prisma.profileVouch.delete({
        where: {
          voterId_votedId: {
            voterId: session.user.id,
            votedId: targetUserId,
          },
        },
      }),
      prisma.user.update({
        where: { id: targetUserId },
        data: { reputation: { decrement: 5 } },
      }),
    ]);

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("[PROFILE_VOUCH_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

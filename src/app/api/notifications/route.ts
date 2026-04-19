import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

/**
 * GET /api/notifications
 * Returns unread notifications for the current user.
 *
 * POST /api/notifications/[id]/read — mark as read (see below)
 */
export async function GET(_req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id, read: false },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      swap: {
        select: {
          id: true,
          status: true,
          initiatorId: true,
          receiverId: true,
        },
      },
    },
  });

  return NextResponse.json({ notifications });
}

/**
 * PATCH /api/notifications — mark all as read
 */
export async function PATCH(_req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { isSuspended } = await req.json();

    const user = await (prisma.user as any).update({
      where: { id: params.id },
      data: { isSuspended },
    });

    // Log the action
    await (prisma.auditLog as any).create({
      data: {
        action: isSuspended ? "USER_SUSPENDED" : "USER_ACTIVATED",
        entity: `USER:${params.id}`,
        userId: (session.user as any).id,
        metadata: { targetUser: user.email }
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to toggle suspension:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { role } = await req.json();

    if (!["USER", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await (prisma.user as any).update({
      where: { id },
      data: { role },
    });

    // Log the action
    await (prisma.auditLog as any).create({
      data: {
        action: "ROLE_CHANGE",
        entity: `USER:${id}`,
        userId: (session.user as any).id,
        metadata: { newRole: role, targetUser: user.email }
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to update role:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

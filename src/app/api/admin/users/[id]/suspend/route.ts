import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    console.log(`Suspending user ${userId}...`);

    // Update the user to be suspended
    await prisma.user.update({
      where: { id: userId },
      data: { isSuspended: true, role: "USER" } // Ensure they aren't admin if they were
    });

    // Log the suspension
    await prisma.auditLog.create({
      data: {
        userId,
        action: "SUSPENSION",
        entity: "USER",
        entityId: userId,
        metadata: { reason: "Admin revocation" }
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Revocation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

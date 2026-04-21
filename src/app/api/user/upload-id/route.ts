import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { idCardBase64 } = await req.json();

    // 1. Update User with ID Card URL (base64 for now)
    await prisma.user.update({
      where: { id: (session.user as any).id },
      data: { idCardUrl: idCardBase64 }
    });

    // 2. Create/Update a Verification Report with PENDING_REVIEW status
    await prisma.verificationReport.create({
      data: {
        userId: (session.user as any).id,
        status: "PENDING_REVIEW",
        findings: "User has uploaded a JNU ID Card. Awaiting administrative manual verification.",
        evidence: {
          timestamp: new Date().toISOString(),
          method: "MANUAL_ID_REVIEW",
          hasImage: true
        }
      }
    });

    // 3. Log the action
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "ID_UPLOADED",
        entity: "USER",
        entityId: (session.user as any).id,
        metadata: { method: "MANUAL_ID_REVIEW" }
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("ID Upload failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // 1. Update the user to VERIFIED and create a Success Report
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { isVerified: true }
      }),
      prisma.verificationReport.create({
        data: {
          userId,
          status: "VERIFIED",
          findings: "Student identity successfully authenticated via Manual ID Review. JNU ID card verified by admin.",
          evidence: {
            timestamp: new Date().toISOString(),
            method: "MANUAL_ID_REVIEW",
            approvedBy: "ADMIN"
          }
        }
      }),
      prisma.auditLog.create({
        data: {
          userId,
          action: "ID_APPROVED",
          entity: "USER",
          entityId: userId,
          metadata: { method: "MANUAL_ID_REVIEW" }
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Verification approval failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

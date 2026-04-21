import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // 1. Clear the ID Card URL and set report to REJECTED
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { idCardUrl: null }
      }),
      prisma.verificationReport.create({
        data: {
          userId,
          status: "REJECTED",
          findings: "Student ID Card rejected by admin. Image may be unclear, expired, or fraudulent.",
          evidence: {
            timestamp: new Date().toISOString(),
            reason: "Admin Rejection"
          }
        }
      }),
      prisma.auditLog.create({
        data: {
          userId,
          action: "ID_REJECTED",
          entity: "USER",
          entityId: userId,
          metadata: { note: "Administrative rejection of ID card submission." }
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Rejection failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

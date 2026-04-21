import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { deleteIdPhoto } from "@/lib/storage";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // 0. Get current ID to delete it
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { idCardUrl: true }
    });

    if (user?.idCardUrl && !user.idCardUrl.startsWith('http')) {
      await deleteIdPhoto(user.idCardUrl);
    }

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

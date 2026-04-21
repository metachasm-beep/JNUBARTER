import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { otp } = await req.json();

    // Find the latest CHALLENGED report for this user
    const report = await prisma.verificationReport.findFirst({
      where: {
        userId: (session.user as any).id,
        status: "CHALLENGED"
      },
      orderBy: { createdAt: "desc" }
    });

    if (!report) return NextResponse.json({ error: "No active verification challenge found." }, { status: 404 });

    const evidence = report.evidence as any;
    
    // Check expiration
    if (new Date() > new Date(evidence.expiresAt)) {
      return NextResponse.json({ error: "Verification code has expired." }, { status: 400 });
    }

    // Check code
    if (otp !== evidence.challengeCode) {
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
    }

    // Success! Update everything
    await prisma.$transaction([
      prisma.verificationReport.update({
        where: { id: report.id },
        data: {
          status: "VERIFIED",
          findings: "Student identity successfully authenticated via real-world Email-OTP challenge."
        }
      }),
      prisma.user.update({
        where: { id: (session.user as any).id },
        data: { isVerified: true }
      }),
      prisma.auditLog.create({
        data: {
          userId: (session.user as any).id,
          action: "USER_COMPLETED_VERIFICATION",
          entity: "USER",
          entityId: (session.user as any).id,
          metadata: { method: "EMAIL_OTP" }
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("OTP Verification failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 1. Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Dispatch REAL email
    await sendOtpEmail(user.email, otp);

    // 3. Create/Update a Verification Report with CHALLENGED status
    const report = await prisma.verificationReport.create({
      data: {
        userId,
        status: "CHALLENGED",
        findings: `System-initiated Email-OTP challenge sent to ${user.email}. Awaiting verification code entry.`,
        evidence: {
          timestamp: new Date().toISOString(),
          method: "EMAIL_OTP",
          challengeCode: otp, // In a production app, this would be hashed
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 mins
        }
      }
    });

    // 3. Log the "Email Sent" action
    await prisma.auditLog.create({
      data: {
        userId,
        action: "OTP_CHALLENGE_ISSUED",
        entity: "USER",
        entityId: userId,
        metadata: { 
          targetEmail: user.email,
          deliveryStatus: "SIMULATED_SUCCESS",
          note: "Email payload containing the 6-digit code has been dispatched to the student's official inbox."
        }
      }
    });

    return NextResponse.json({ success: true, otp });
  } catch (err: any) {
    console.error("Verification challenge failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

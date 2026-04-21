import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadToDrive } from "@/lib/google-drive";

export async function POST(req: Request) {
  try {
    const session = await auth();
    console.log("[ID_UPLOAD] Session:", !!session, "User ID:", session?.user?.id);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { idCardBase64 } = await req.json();
    if (!idCardBase64) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    const userId = session.user.id;
    console.log("[ID_UPLOAD] Processing upload for user:", userId);

    // 1. Upload to Google Drive
    const fileName = `JNU_ID_${userId}_${Date.now()}.jpg`;
    const driveUrl = await uploadToDrive(idCardBase64, fileName);
    console.log("[ID_UPLOAD] Drive URL:", driveUrl);

    // 2. Update User with ID Card URL
    await prisma.user.update({
      where: { id: userId },
      data: { idCardUrl: driveUrl }
    });

    // 2. Create/Update a Verification Report with PENDING_REVIEW status
    await prisma.verificationReport.create({
      data: {
        userId: userId,
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
        userId: userId,
        action: "ID_UPLOADED",
        entity: "USER",
        entityId: userId,
        metadata: { method: "MANUAL_ID_REVIEW" }
      }
    });

    console.log("[ID_UPLOAD] Success for user:", userId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("ID Upload failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

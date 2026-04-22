import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSignedUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: { select: { listings: true, swapsInitiated: true, swapsReceived: true } },
        verificationReports: { take: 1, orderBy: { createdAt: "desc" } },
        listings: { take: 10, orderBy: { createdAt: "desc" } },
        auditLogs: { take: 10, orderBy: { createdAt: "desc" } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate signed URL for ID photo if needed
    let idCardUrl = user.idCardUrl;
    if (idCardUrl && !idCardUrl.startsWith("http")) {
      idCardUrl = await getSignedUrl(idCardUrl);
    }

    return NextResponse.json({ ...user, idCardUrl });
  } catch (err: any) {
    console.error("[AdminUser GET]", err);
    return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
  }
}

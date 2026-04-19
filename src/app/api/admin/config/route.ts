import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

/**
 * Enhancement #8 — Liquid Glass UI Command Surface
 * Allows admins to live-update CSS tokens (blur, primary, etc.)
 */
export async function GET() {
  const config = await prisma.systemConfig.findUnique({ where: { id: "GLOBAL" } });
  return NextResponse.json(config?.config || {
    glassBlur: "24px",
    noirIntensity: "0.05",
    primaryAccent: "#eab308", // Yellow-500
    iridescentSpeed: "10s"
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const newConfig = await req.json();

  const config = await prisma.systemConfig.upsert({
    where: { id: "GLOBAL" },
    update: { config: newConfig },
    create: { id: "GLOBAL", config: newConfig }
  });

  return NextResponse.json(config.config);
}

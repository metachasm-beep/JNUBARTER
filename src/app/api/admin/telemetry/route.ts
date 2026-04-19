import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

/**
 * Enhancement #2 — Canary Watch
 * Enhancement #3 — Cost-Aware LLM Pipeline (Aggregates)
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Canary Health Checks
    const dbHealth = await prisma.$queryRaw`SELECT 1`.then(() => "HEALTHY").catch(() => "UNSTABLE");
    const userCount = await prisma.user.count();

    // 2. LLM Cost Aggregates
    const usageStats = await prisma.usageLog.aggregate({
      _sum: { tokens: true, cost: true },
      _count: { id: true }
    });

    // 3. System Pulse (Active Swaps)
    const activeSwaps = await prisma.swap.count({
      where: { status: { in: ["PROPOSED", "COUNTERED", "ACCEPTED"] } }
    });

    return NextResponse.json({
      health: {
        database: dbHealth,
        system: "OPERATIONAL",
        lastPulse: new Date().toISOString()
      },
      telemetry: {
        totalRequests: usageStats._count.id,
        totalTokens: usageStats._sum.tokens || 0,
        estimatedCost: usageStats._sum.cost || 0
      },
      activity: {
        nodes: userCount,
        liveChains: activeSwaps
      }
    });
  } catch (err) {
    return NextResponse.json({ status: "DEGRADED", error: String(err) }, { status: 500 });
  }
}

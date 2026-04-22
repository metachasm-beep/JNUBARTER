import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { sendAlert } from "@/lib/alerts";

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
    // 1. Canary Health Checks with Latency Measurement
    const start = Date.now();
    let dbLatency = 0;
    const dbHealth = await (prisma as any).$queryRaw`SELECT 1`
      .then(() => {
        dbLatency = Date.now() - start;
        return "HEALTHY";
      })
      .catch(() => "UNSTABLE");
    
    const userCount = await (prisma.user as any).count().catch(() => 0);

    // 2. LLM Cost Aggregates
    const usageStats = await (prisma.usageLog as any).aggregate({
      _sum: { tokens: true, cost: true },
      _count: { id: true }
    }).catch(() => ({ _sum: { tokens: 0, cost: 0 }, _count: { id: 0 } }));

    const totalCost = usageStats._sum.cost || 0;

    // 3. System Pulse (Active Swaps)
    const activeSwaps = await (prisma.swap as any).count({
      where: { status: { in: ["PROPOSED", "COUNTERED", "ACCEPTED"] } }
    }).catch(() => 0);

    // --- ALERTS TRIGGER ---
    if (dbHealth === "UNSTABLE") {
      await sendAlert("INFRASTRUCTURE", "Primary Database (Neon) is UNSTABLE or Offline.");
    } else if (dbLatency > 800) {
      await sendAlert("INFRASTRUCTURE", "High Latency Detected on Primary Database", { latency: `${dbLatency}ms` });
    }

    if (totalCost > 2.00) {
      await sendAlert("BILLING", "Daily LLM Spend Exceeded Soft Limit", { cost: `$${totalCost.toFixed(4)}` });
    }

    return NextResponse.json({
      health: {
        database: dbHealth,
        latency: dbLatency,
        system: dbHealth === "HEALTHY" && dbLatency < 800 ? "OPERATIONAL" : "DEGRADED",
        lastPulse: new Date().toISOString()
      },
      telemetry: {
        totalRequests: usageStats._count.id,
        totalTokens: usageStats._sum.tokens || 0,
        estimatedCost: totalCost
      },
      activity: {
        nodes: userCount,
        liveChains: activeSwaps
      }
    });
  } catch (err) {
    await sendAlert("SYSTEM", `Telemetry pipeline crashed: ${String(err)}`);
    return NextResponse.json({ status: "DEGRADED", error: String(err) }, { status: 500 });
  }
}

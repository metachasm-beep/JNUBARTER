import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const [verifiedNodes, activeSwaps] = await Promise.all([
      prisma.user.count({
        where: { isVerified: true }
      }),
      prisma.swap.count({
        where: {
          status: {
            in: ["PROPOSED", "COUNTERED", "ACCEPTED"]
          }
        }
      })
    ]);

    return NextResponse.json({
      verifiedNodes: verifiedNodes > 0 ? verifiedNodes : 0,
      activeSwaps: activeSwaps > 0 ? activeSwaps : 0
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({ verifiedNodes: 0, activeSwaps: 0 });
  }
}

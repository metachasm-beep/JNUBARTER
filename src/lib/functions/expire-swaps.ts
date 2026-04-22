import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { getNeo4jDriver } from "@/lib/neo4j";

/**
 * Runs every 6 hours.
 * Finds all PROPOSED swaps past their expiresAt deadline,
 * marks them CANCELLED, releases Neo4j listing locks, and
 * notifies both parties with a SWAP_EXPIRED notification.
 */
export const expireStaleSwaps = inngest.createFunction(
  { 
    id: "expire-stale-swaps", 
    name: "Auto-Cancel Expired Swaps",
    triggers: [{ cron: "0 */6 * * *" }]
  },
  async ({ step }: any) => {
    // Step 1 — Find expired swaps
    const expired = await step.run("find-expired", async () => {
      return prisma.swap.findMany({
        where: {
          status: "PROPOSED",
          expiresAt: { lt: new Date() },
        },
        select: {
          id: true,
          initiatorId: true,
          receiverId: true,
          items: { select: { listingId: true } },
        },
      });
    }) as Array<{ id: string; initiatorId: string; receiverId: string; items: { listingId: string }[] }>;

    if (expired.length === 0) return { cancelled: 0 };

    const expiredIds = expired.map((s) => s.id);

    // Step 2 — Mark swaps as CANCELLED in Postgres
    await step.run("cancel-in-postgres", async () => {
      await prisma.swap.updateMany({
        where: { id: { in: expiredIds } },
        data: { status: "CANCELLED" },
      });
    });

    // Step 3 was Neo4j lock release, which was dead code. Swap state is fully managed in Postgres.

    // Step 4 — Notify both parties for each expired swap
    await step.run("notify-parties", async () => {
      const notifications = expired.flatMap((swap: { id: string; initiatorId: string; receiverId: string }) => [
        { userId: swap.initiatorId, type: "SWAP_EXPIRED" as const, refId: swap.id },
        { userId: swap.receiverId, type: "SWAP_EXPIRED" as const, refId: swap.id },
      ]);
      await prisma.notification.createMany({
        data: notifications,
        skipDuplicates: true,
      });
    });

    // Step 5 — Send push notifications (non-blocking)
    await step.run("send-push-notifications", async () => {
      const uniqueUserIds = [...new Set(expired.flatMap(s => [s.initiatorId, s.receiverId]))];
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/push/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
          },
          body: JSON.stringify({
            userIds: uniqueUserIds,
            payload: {
              title: "⌛ Swap Expired",
              body: "One of your proposed exchanges has expired and was automatically cancelled.",
              url: "/swaps",
            },
          }),
        });
      } catch (err) {
        console.error("[expire-stale-swaps] push failed:", err);
      }
    });

    return { cancelled: expired.length };
  }
);

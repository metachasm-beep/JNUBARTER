import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";

/**
 * Fires when a swap reaches EXECUTED state (both parties confirmed).
 * Creates VOUCH_PROMPT notifications for both parties and bumps reputation.
 */
export const onSwapExecuted = (inngest as any).createFunction(
  { id: "on-swap-executed", name: "Vouch Prompt on Swap Execution" },
  { event: "barter/swap.executed" },
  async ({ event, step }: any) => {
    const { swapId, initiatorId, receiverId } = event.data as {
      swapId: string;
      initiatorId: string;
      receiverId: string;
    };

    // Step 1 — Persist VOUCH_PROMPT notifications for both parties
    await step.run("create-vouch-notifications", async () => {
      await prisma.notification.createMany({
        data: [
          {
            userId: initiatorId,
            type: "VOUCH_PROMPT",
            refId: swapId,
          },
          {
            userId: receiverId,
            type: "VOUCH_PROMPT",
            refId: swapId,
          },
        ],
        skipDuplicates: true,
      });
    });

    // Step 2 — Increment reputation for both parties (+10 per completed swap)
    await step.run("bump-reputation", async () => {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: initiatorId },
          data: { reputation: { increment: 10 } },
        }),
        prisma.user.update({
          where: { id: receiverId },
          data: { reputation: { increment: 10 } },
        }),
      ]);
    });

    // Step 3 — Send push notifications (non-blocking)
    await step.run("send-push-notifications", async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/push/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
          },
          body: JSON.stringify({
            userIds: [initiatorId, receiverId],
            payload: {
              title: "✦ Swap Complete!",
              body: "The exchange was successful. Tap to vouch for your peer and build your reputation.",
              url: `/swap/${swapId}`,
            },
          }),
        });
      } catch (err) {
        console.error("[on-swap-executed] push failed:", err);
      }
    });

    return { notified: [initiatorId, receiverId] };
  }
);

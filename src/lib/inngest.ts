import { Inngest } from "inngest";
import { GodmodeEngine } from "./godmode-engine";

export const inngest = new Inngest({ id: "jnu-barter" });

/**
 * Existing: Autonomous swap discovery on profile update.
 */
export const autonomousDiscovery = (inngest as any).createFunction(
  { id: "autonomous-discovery" },
  { event: "barter/profile.updated" },
  async ({ event, step }: any) => {
    const { userId } = event.data;

    const matches = await step.run("graph-discovery", async () => {
      return await GodmodeEngine.findOptimalSwaps(userId);
    });

    if (matches && matches.length > 0) {
      await step.run("log-compressed-event", async () => {
        console.log(`GODMODE: Discovery Context for ${userId} compressed`);
      });
    }

    return { matchCount: matches?.length || 0 };
  }
);

// Enhancement #6 — Vouch prompt + reputation bump on swap execution
export { onSwapExecuted } from "./functions/on-swap-executed";

// Enhancement #7 — Auto-cancel expired PROPOSED swaps every 6h
export { expireStaleSwaps } from "./functions/expire-swaps";

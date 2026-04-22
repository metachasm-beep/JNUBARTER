import { inngest } from "./inngest/client";
import { GodmodeEngine } from "./godmode-engine";
export { inngest };

/**
 * Existing: Autonomous swap discovery on profile update.
 */
export const autonomousDiscovery = inngest.createFunction(
  { 
    id: "autonomous-discovery", 
    name: "Autonomous Swap Discovery",
    triggers: [{ event: "barter/profile.updated" }] 
  },
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

// Enhancement #1 — Safety Guard & Policy Audit
export { auditListingPolicy } from "./functions/audit-listing";

// Enhancement #6 — Deep Research Peer Verifier
export { verifyPeerAuthority } from "./functions/verify-authority";

// Enhancement #9 — Sentiment Engine
export { analyzeNetworkSentiment } from "./functions/sentiment-engine";

// Phase 2 — Neo4j Sync
export { syncListingCreated, reconcileGraph } from "./functions/sync-neo4j";




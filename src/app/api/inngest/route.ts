import { serve } from "inngest/next";
import { inngest, autonomousDiscovery, onSwapExecuted, expireStaleSwaps, auditListingPolicy, verifyPeerAuthority, analyzeNetworkSentiment, syncListingCreated, reconcileGraph, syncProfileUpdated } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [autonomousDiscovery, onSwapExecuted, expireStaleSwaps, auditListingPolicy, verifyPeerAuthority, analyzeNetworkSentiment, syncListingCreated, reconcileGraph, syncProfileUpdated],
});

import { serve } from "inngest/next";
import { inngest, autonomousDiscovery, onSwapExecuted, expireStaleSwaps } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [autonomousDiscovery, onSwapExecuted, expireStaleSwaps],
});

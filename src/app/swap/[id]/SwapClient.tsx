"use client";

import React, { useEffect, useState } from "react";
import NegotiationChat from "@/components/NegotiationChat";
import { Badge } from "@/components/ui/badge";
import { SwapPlaybook } from "@/components/SwapPlaybook";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function SwapClient({ swapId }: { swapId: string }) {
  const { data: session, status } = useSession();
  const [swapData, setSwapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSwap = async () => {
      try {
        const res = await fetch(`/api/swaps/${swapId}`);
        const data = await res.json();
        setSwapData(data.swap);
      } catch (err) {
        console.error("Failed to fetch swap:", err);
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated") {
      fetchSwap();
    }
  }, [swapId, status]);

  if (status === "loading" || loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black gap-4 font-mono">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs uppercase tracking-widest text-stone-500">Initializing Secure Tunnel...</p>
      </div>
    );
  }

  const currentUserRole = session?.user?.id === swapData?.initiatorId ? "A" : "B";

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-mono">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b-4 border-neutral-900 bg-black">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-[10px] uppercase border-primary text-primary px-3 py-1">
            SWAP ID: {swapId}
          </Badge>
          <h1 className="text-xl font-black uppercase tracking-tighter italic">Negotiation Room</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-500 text-black border-none font-black text-[10px] animate-pulse">
            PHASE: {swapData?.status || "DRAFTING"}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        <div className="flex-1">
          <NegotiationChat 
            swapId={swapId} 
            currentUser={currentUserRole} 
            initialItems={swapData?.items?.map((i: any) => i.listing?.title) || []}
          />
        </div>
        <div className="w-80 shrink-0 h-full">
          <SwapPlaybook status={swapData?.status || "PROPOSED"} />
        </div>
      </div>

      <footer className="p-4 bg-neutral-900 border-t-2 border-neutral-800 text-center">
        <p className="text-[9px] opacity-40 uppercase tracking-[0.2em]">
          End-to-end encrypted negotiation // Secured by reciprocity-first protocol
        </p>
      </footer>
    </div>
  );
}

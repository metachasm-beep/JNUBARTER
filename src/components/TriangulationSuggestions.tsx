"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, GitMerge, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface ChainNode {
  id: string;
  name: string;
}

interface ChainListing {
  id: string;
  title: string;
}

interface BarterChain {
  id: string;
  users: ChainNode[];
  listings: ChainListing[];
  tags: string[];
}

export function TriangulationSuggestions() {
  const { data: session } = useSession();
  const [chains, setChains] = useState<BarterChain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitiating, setIsInitiating] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChains() {
      try {
        const res = await fetch("/api/chains");
        if (res.ok) {
          const data = await res.json();
          setChains(data.chains || []);
        }
      } catch (err) {
        console.error("Failed to fetch triangulations", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (session?.user?.id) {
      fetchChains();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const initiateMultiSwap = async (chain: BarterChain) => {
    if (!session?.user?.id) return;
    setIsInitiating(chain.id);

    try {
      // Flow based on Neo4j cycle: u1 -> u3 -> u2 -> u1
      const participants = [
        {
          userId: chain.users[0].id, // u1 (You)
          givingListingId: chain.listings[0].id, // l1
          receivingTag: chain.tags[1], // t2 (what u1 wants)
        },
        {
          userId: chain.users[2].id, // u3
          givingListingId: chain.listings[2].id, // l3
          receivingTag: chain.tags[0], // t1 (what u3 wants)
        },
        {
          userId: chain.users[1].id, // u2
          givingListingId: chain.listings[1].id, // l2
          receivingTag: chain.tags[2], // t3 (what u2 wants)
        }
      ];

      const res = await fetch("/api/swaps/multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants })
      });

      if (!res.ok) throw new Error("Failed to initialize");

      toast.success("Triangulation Protocol Initiated", {
        description: "A 3-way smart contract has been generated. Awaiting peer confirmations."
      });
      
      // Optimistically remove from suggestions
      setChains(prev => prev.filter(c => c.id !== chain.id));

    } catch (error) {
      toast.error("Protocol Error", {
        description: "Failed to establish the 3-way linkage."
      });
    } finally {
      setIsInitiating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 rounded-[2rem] glass-card border-white/5 flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 text-accent animate-spin" />
      </div>
    );
  }

  if (chains.length === 0) {
    return null; // Don't show the section if no complex matches exist
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
          <GitMerge className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter italic text-primary">Triangulation Routes</h3>
          <p className="text-xs font-medium text-stone-600">Complex 3-way reciprocities detected based on your unfulfilled needs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AnimatePresence>
          {chains.map((chain, idx) => {
            const u1 = chain.users[0];
            const u2 = chain.users[1];
            const u3 = chain.users[2];
            const l1 = chain.listings[0];
            const l2 = chain.listings[1];
            const l3 = chain.listings[2];

            return (
              <motion.div
                key={chain.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.1 }}
                className="relative overflow-hidden rounded-[2rem] bg-black/80 backdrop-blur-3xl border border-white/10 p-6 flex flex-col gap-6 shadow-2xl"
              >
                {/* Background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />

                {/* Nodes Representation */}
                <div className="flex flex-col gap-4 relative z-10">
                  {/* Leg 1: You -> U3 */}
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <Badge className="bg-white/10 text-white font-mono shrink-0">You</Badge>
                    <ArrowRight className="h-4 w-4 text-stone-500 shrink-0" />
                    <span className="text-sm font-medium text-stone-300 truncate flex-1">{l1.title}</span>
                    <ArrowRight className="h-4 w-4 text-stone-500 shrink-0" />
                    <Badge variant="outline" className="text-accent border-accent/20 shrink-0">{u3.name}</Badge>
                  </div>

                  {/* Leg 2: U3 -> U2 */}
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 ml-4 opacity-80">
                    <Badge variant="outline" className="text-accent border-accent/20 shrink-0">{u3.name}</Badge>
                    <ArrowRight className="h-4 w-4 text-stone-500 shrink-0" />
                    <span className="text-sm font-medium text-stone-300 truncate flex-1">{l3.title}</span>
                    <ArrowRight className="h-4 w-4 text-stone-500 shrink-0" />
                    <Badge variant="outline" className="text-purple-400 border-purple-400/20 shrink-0">{u2.name}</Badge>
                  </div>

                  {/* Leg 3: U2 -> You */}
                  <div className="flex items-center gap-4 bg-accent/10 p-3 rounded-2xl border border-accent/20 ml-8">
                    <Badge variant="outline" className="text-purple-400 border-purple-400/20 shrink-0">{u2.name}</Badge>
                    <ArrowRight className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-sm font-bold text-accent truncate flex-1">{l2.title}</span>
                    <ArrowRight className="h-4 w-4 text-accent shrink-0" />
                    <Badge className="bg-accent text-primary font-mono shrink-0">You</Badge>
                  </div>
                </div>

                <Button 
                  onClick={() => initiateMultiSwap(chain)}
                  disabled={isInitiating === chain.id}
                  className="w-full h-12 rounded-xl bg-white text-black hover:bg-stone-200 font-black uppercase tracking-widest text-[10px] mt-auto relative z-10 transition-transform active:scale-[0.98]"
                >
                  {isInitiating === chain.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> Initiate 3-Way Protocol
                    </span>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

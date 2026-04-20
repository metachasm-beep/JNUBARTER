"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, GraduationCap, Share2, Search, Zap, Globe, MessageSquare, Bot, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ListingSkeleton } from "@/components/ListingSkeleton";
import { ListingCard } from "@/components/ListingCard";
import { FAQSection } from "@/components/FAQSection";
import { InstallPWA } from "@/components/InstallPWA";
import { useListingsFlat } from "@/hooks/useListings";
import { ChainCard, ChainSkeleton } from "@/components/ChainCard";
import { VouchModal } from "@/components/VouchModal";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import { useChains } from "@/hooks/useChains";
import { useSemanticSearch } from "@/hooks/useSemanticSearch";
import { signIn, signOut, useSession } from "next-auth/react";

// --- Suggestion #8: AI Swap-Mate FAB ---
const SwapMateFAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed bottom-24 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[320px] glass-card p-6 border-iridescent rounded-3xl shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-accent" />
                  <h4 className="font-sans font-bold text-sm text-primary uppercase tracking-tighter">SwapMate AI</h4>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-primary">
                  <X className="h-4 w-4" />
               </button>
            </div>
            <div className="space-y-4">
               <div className="bg-stone-50/50 p-3 rounded-2xl border border-stone-100">
                  <p className="text-[12px] text-secondary leading-relaxed">
                    "I've analyzed your skills. There's a high-probability trade chain available involving <strong>ML Tutoring</strong> and <strong>Photography</strong>."
                  </p>
               </div>
               <Button className="w-full btn-premium h-10 text-[10px] uppercase font-black tracking-widest">
                  View Suggested Chain
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 rounded-full btn-premium flex items-center justify-center shadow-2xl shadow-accent/40 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X className="h-6 w-6 relative z-10" /> : <Sparkles className="h-6 w-6 relative z-10" />}
      </button>
    </div>
  );
};

export default function DiscoveryPage() {
  const { data: session, status } = useSession();
  const { data: listingsData, isLoading: listingsLoading } = useListingsFlat();
  const listings = listingsData?.listings ?? [];
  const { data: chainsData, isLoading: chainsLoading } = useChains();
  const chains = chainsData?.chains ?? [];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data: searchData, isFetching: searchFetching } = useSemanticSearch(searchQuery);
  const isSearchActive = searchQuery.trim().length >= 3;
  const searchResults = searchData?.results ?? [];
  const searchMode = searchData?.mode;

  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const scrollToFold = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden font-sans scroll-smooth">
      
      {/* FOLD 1: LIQUID GLASS HERO */}
      <section className="relative w-full h-screen flex flex-col bg-background overflow-hidden">
        {/* Iridescent Ambient Glow */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[150px] rounded-full" />
           <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-stone-200/40 blur-[150px] rounded-full" />
        </div>

        {/* Suggestion #9: Desktop-to-Mobile QR Integration Concept would be here */}

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
               
               <h1 className="text-7xl md:text-[140px] font-extrabold tracking-[-0.06em] leading-[0.8] text-primary">
                 BEYOND <br/> 
                 <span className="text-accent italic">CURRENCY.</span>
               </h1>
               
               <p className="text-secondary font-medium text-lg md:text-2xl max-w-3xl mx-auto leading-tight">
                 Premium peer-to-peer reciprocity within the global academic ecosystem. No cash. No credit. Pure merit.
               </p>
               
               <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
                  {status !== "authenticated" ? (
                    <Button 
                      onClick={() => signIn("google")}
                      className="rounded-full btn-premium text-[10px] font-black uppercase tracking-widest px-16 h-20 shadow-2xl shadow-accent/20"
                    >
                      Sign In
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => (window.location.href = '/setup')}
                      className="rounded-full btn-premium text-[10px] font-black uppercase tracking-widest px-16 h-20 shadow-2xl shadow-accent/20"
                    >
                      Initialize Node
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline"
                    onClick={() => setIsHowItWorksOpen(true)}
                    className="rounded-full border-stone-200 text-[10px] font-black uppercase tracking-widest px-10 h-20 hover:bg-stone-50/50 transition-colors"
                  >
                    How It Works
                  </Button>

                  <Button 
                    variant="ghost" 
                    onClick={() => scrollToFold('market')}
                    className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-accent px-10 h-20 group"
                  >
                    View Registry <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </div>
            </motion.div>
        </div>
      </section>

      {/* FOLD 2: SEMANTIC REGISTRY */}
      <section id="market" className="max-w-7xl mx-auto px-8 py-32 relative z-20">
        <div className="mb-24 space-y-6 text-center">
            <h3 className="text-5xl font-extrabold tracking-tighter text-primary uppercase">Peer Registry</h3>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full" />
        </div>

        {/* Suggestion #4: Glass Search Bar with Shimmer */}
        <div className="relative max-w-3xl mx-auto mb-20 group">
          <div className="relative glass-card border-iridescent rounded-full overflow-hidden p-1 transition-all group-focus-within:shadow-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill, need, or department..."
              className="w-full h-16 pl-14 pr-6 bg-transparent text-sm font-medium text-primary placeholder:text-stone-300 focus:outline-none"
            />
            {searchFetching && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            )}
          </div>
          {isSearchActive && searchMode && (
            <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-accent text-center mt-4 animate-pulse">
              {searchMode === "semantic" ? "✦ Semantic similarity logic active" : "Vector fallback active"}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {isSearchActive ? (
             searchFetching ? (
               Array(3).fill(0).map((_, i) => <ListingSkeleton key={i} />)
             ) : (
               searchResults.map((listing, idx) => (
                 <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                 >
                   <ListingCard listing={listing} />
                 </motion.div>
               ))
             )
           ) : (
             listingsLoading ? (
               Array(6).fill(0).map((_, i) => <ListingSkeleton key={i} />)
             ) : (
               listings.map((listing, idx) => (
                 <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                 >
                   <ListingCard listing={listing} />
                 </motion.div>
               ))
             )
           )}
        </div>
      </section>

      {/* Suggestion #8: AI FAB */}
      <SwapMateFAB />

      <FAQSection />
      <InstallPWA />
      <VouchModal />
      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
    </div>
  );
}

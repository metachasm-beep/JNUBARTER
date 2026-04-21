"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, ChevronDown, Library, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ListingSkeleton } from "@/components/ListingSkeleton";
import { ListingCard } from "@/components/ListingCard";
import { FAQSection } from "@/components/FAQSection";
import { InstallPWA } from "@/components/InstallPWA";
import { useListingsFlat } from "@/hooks/useListings";
import { VouchModal } from "@/components/VouchModal";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import { InitializeNodeModal } from "@/components/InitializeNodeModal";
import { useSemanticSearch } from "@/hooks/useSemanticSearch";
import { signIn, useSession } from "next-auth/react";
import { Dashboard } from "@/components/Dashboard";
import { usePathname } from "next/navigation";
import { ParallaxHero } from "@/components/ParallaxHero";

export default function DiscoveryPage() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAdmin = (session?.user as any)?.role === "ADMIN" || session?.user?.email === "metachasm@gmail.com";
  const { data: listingsData, isLoading: listingsLoading } = useListingsFlat();
  const listings = listingsData?.listings ?? [];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data: searchData, isFetching: searchFetching } = useSemanticSearch(searchQuery);
  const isSearchActive = searchQuery.trim().length >= 3;
  const searchResults = searchData?.results ?? [];
  const searchMode = searchData?.mode;

  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [hasAttemptedAutoOpen, setHasAttemptedAutoOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only auto-open setup for regular users, and only if they don't have a profile
    if (status === "authenticated" && !isAdmin && session?.user && !(session?.user as any)?.hasProfile && !hasAttemptedAutoOpen) {
      setIsSetupModalOpen(true);
      setHasAttemptedAutoOpen(true);
    }
  }, [status, session, hasAttemptedAutoOpen, isAdmin]);

  useEffect(() => {
    if (status === "authenticated" && isAdmin && pathname === "/") {
      window.location.href = "/admin";
    }
  }, [status, isAdmin, pathname]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 30,
    restDelta: 0.001
  });

  // Global Parallax Translations (Cinematic Silhouette World)
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);
  const midY = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const foreY = useTransform(smoothProgress, [0, 1], ["0%", "60%"]);
  const particleY = useTransform(smoothProgress, [0, 1], ["0%", "45%"]);

  const scrollToFold = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-background pb-20 overflow-x-hidden font-sans scroll-smooth">
        <Dashboard 
          openSetup={(step?: number) => {
            if (step) setSetupStep(step);
            setIsSetupModalOpen(true);
          }} 
        />
        <VouchModal />
        <InitializeNodeModal 
          isOpen={isSetupModalOpen} 
          onClose={() => setIsSetupModalOpen(false)} 
          initialStep={setupStep}
        />
      </div>
    );
  }

  return (
    <main 
      ref={containerRef}
      className="relative min-h-screen bg-black pb-20 overflow-x-hidden font-sans selection:bg-accent selection:text-white scroll-smooth"
    >
      {/* GLOBAL CINEMATIC WORLD (FIXED) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        
        {/* Background cosmic sky */}
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          <img src="/images/parallax/global_bg.png" alt="" className="w-full h-full object-cover opacity-60" />
        </motion.div>

        {/* Midground misty spires */}
        <motion.div style={{ y: midY }} className="absolute inset-0">
          <img src="/images/parallax/global_mid.png" alt="" className="w-full h-full object-cover opacity-80 mix-blend-screen" />
        </motion.div>

        {/* Floating particles */}
        <motion.div style={{ y: particleY }} className="absolute inset-0">
          <img src="/images/parallax/global_particles.png" alt="" className="w-full h-full object-cover opacity-40 scale-110" />
        </motion.div>

        {/* Foreground silhouette occlusion (Sandwiches content) */}
        <motion.div style={{ y: foreY }} className="absolute inset-0 z-40">
          <img src="/images/parallax/global_fore.png" alt="" className="w-full h-full object-cover scale-110 contrast-150" />
        </motion.div>

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-50" />
      </div>

      <div className="relative z-[45] w-full">
        
        {/* FOLD 1: CINEMATIC PARALLAX HERO */}
        <ParallaxHero scrollToMarket={() => scrollToFold('market')} />

        {/* FOLD 2: SEMANTIC REGISTRY */}
        <section id="market" className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 relative">
          <div className="mb-24 space-y-6 text-center">
              <h3 className="text-5xl font-extrabold tracking-tighter text-white uppercase drop-shadow-[0_20px_40px_rgba(0,0,0,1)]">Peer Registry</h3>
              <div className="h-1 w-20 bg-accent mx-auto rounded-full" />
          </div>

          <div className="relative max-w-3xl mx-auto mb-20 group">
            <div className="relative bg-white/5 border border-white/10 backdrop-blur-3xl rounded-full overflow-hidden p-1 transition-all group-focus-within:shadow-[0_0_50px_rgba(255,5,5,0.2)]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by skill, need, or department..."
                className="w-full h-16 pl-14 pr-6 bg-transparent text-sm font-medium text-white placeholder:text-stone-500 focus:outline-none"
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

        {/* Grounded Sections */}
        <section className="bg-black/90 backdrop-blur-3xl border-t border-white/5 py-32 relative z-[45]">
          <FAQSection />
        </section>
        
        <InstallPWA />
        <VouchModal />
        <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
        <InitializeNodeModal 
          isOpen={isSetupModalOpen} 
          onClose={() => setIsSetupModalOpen(false)} 
          initialStep={setupStep}
        />
      </div>

      {/* Global Scroll Indicator */}
      <motion.div 
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left shadow-[0_0_20px_rgba(255,5,5,0.5)]"
      />
    </main>
  );
}

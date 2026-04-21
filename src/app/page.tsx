"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ListingSkeleton } from "@/components/ListingSkeleton";
import { ListingCard } from "@/components/ListingCard";
import { FAQSection } from "@/components/FAQSection";
import { InstallPWA } from "@/components/InstallPWA";
import { useListingsFlat } from "@/hooks/useListings";
import { VouchModal } from "@/components/VouchModal";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import { InitializeNodeModal } from "@/components/InitializeNodeModal";
import { useSemanticSearch } from "@/hooks/useSemanticSearch";
import { useSession } from "next-auth/react";
import { Dashboard } from "@/components/Dashboard";
import { usePathname } from "next/navigation";
import { ParallaxHero } from "@/components/ParallaxHero";
import { DepthFlowExperience } from "@/components/DepthFlowExperience";

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

  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [hasAttemptedAutoOpen, setHasAttemptedAutoOpen] = useState(false);

  useEffect(() => {
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

  // FIX: Use global window scroll instead of element-targeted scroll
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 30,
    restDelta: 0.001
  });

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
      className="relative min-h-[400vh] bg-black overflow-x-hidden font-sans selection:bg-accent selection:text-white scroll-smooth"
    >
      {/* INTEGRATED DEPTHFLOW WORLD (WEBGL SHADER) */}
      <DepthFlowExperience scrollProgress={smoothProgress} />

      {/* CONTENT LAYERS */}
      <div className="relative z-50 w-full">
        
        {/* SCENE 1: THE REVEAL */}
        <section className="relative min-h-screen flex items-center justify-center">
          <ParallaxHero scrollToMarket={() => scrollToFold('market')} />
        </section>

        {/* SCENE 2: THE REGISTRY */}
        <section id="market" className="relative min-h-screen py-32 flex flex-col items-center">
          <div className="max-w-7xl w-full px-8">
            <div className="mb-24 space-y-6 text-center">
                <h3 className="text-6xl font-black tracking-tighter text-white uppercase drop-shadow-[0_20px_40px_rgba(0,0,0,1)]">Peer Registry</h3>
                <div className="h-1 w-20 bg-accent mx-auto rounded-full" />
            </div>

            <div className="relative max-w-3xl mx-auto mb-20 group">
              <div className="relative bg-white/5 border border-white/10 backdrop-blur-3xl rounded-full overflow-hidden p-1 transition-all group-focus-within:shadow-[0_0_50px_rgba(255,5,5,0.2)]">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Query scholarly nodes..."
                  className="w-full h-16 pl-14 pr-6 bg-transparent text-sm font-medium text-white placeholder:text-stone-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {isSearchActive ? (
                 searchFetching ? (
                   Array(3).fill(0).map((_, i) => <ListingSkeleton key={i} />)
                 ) : (
                   searchResults.map((listing, idx) => (
                     <motion.div key={listing.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                       <ListingCard listing={listing} />
                     </motion.div>
                   ))
                 )
               ) : (
                 listingsLoading ? (
                   Array(6).fill(0).map((_, i) => <ListingSkeleton key={i} />)
                 ) : (
                   listings.map((listing, idx) => (
                     <motion.div key={listing.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                       <ListingCard listing={listing} />
                     </motion.div>
                   ))
                 )
               )}
            </div>
          </div>
        </section>

        {/* SCENE 3: GROUNDING */}
        <section className="bg-black/95 backdrop-blur-3xl border-t border-white/5 py-40 relative z-50">
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

      {/* Global Progress */}
      <motion.div 
        style={{ scaleX: smoothProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left shadow-[0_0_20px_rgba(255,5,5,0.5)]"
      />
    </main>
  );
}

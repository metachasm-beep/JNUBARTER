"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
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
    stiffness: 40,
    damping: 25,
    restDelta: 0.001
  });

  // DEPTHFLOW-INSPIRED ANIMATION PARAMETERS
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);
  const midY = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const foreY = useTransform(smoothProgress, [0, 1], ["0%", "70%"]);
  
  // Depth of Field: Background blurs as you scroll into content
  const bgBlur = useTransform(smoothProgress, [0, 0.2, 0.8], [0, 5, 15]);
  const midBlur = useTransform(smoothProgress, [0, 0.3, 0.9], [0, 2, 8]);
  
  // Chromatic Aberration: Layers shift slightly on the X-axis for a "lens" feel
  const shiftX = useTransform(smoothProgress, [0, 1], [0, 15]);

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
      className="relative min-h-screen bg-[#020204] pb-20 overflow-x-hidden font-sans selection:bg-accent selection:text-white scroll-smooth"
    >
      {/* DEPTHFLOW CINEMATIC WORLD (FIXED) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        
        {/* LAYER 0: SOLID NEBULA (BACKGROUND) */}
        <motion.div 
          style={{ y: bgY, filter: `blur(${bgBlur}px)` }}
          className="absolute inset-0"
        >
          <img src="/images/parallax/solid_bg.png" alt="" className="w-full h-full object-cover opacity-80" />
        </motion.div>

        {/* LAYER 1: MISTY SPIRES (MIDGROUND) - WITH CHROMATIC ABERRATION */}
        <motion.div 
          style={{ y: midY, x: shiftX, filter: `blur(${midBlur}px)` }}
          className="absolute inset-0 mix-blend-screen opacity-90"
        >
          <img src="/images/parallax/solid_mid.png" alt="" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div 
          style={{ y: midY, x: -shiftX }}
          className="absolute inset-0 mix-blend-screen opacity-30 contrast-150 brightness-125"
        >
          <img src="/images/parallax/solid_mid.png" alt="" className="w-full h-full object-cover" />
        </motion.div>

        {/* LAYER 2: SILHOUETTE ARCHWAY (FOREGROUND) */}
        <motion.div 
          style={{ y: foreY }}
          className="absolute inset-0 z-40 mix-blend-multiply"
        >
          <img src="/images/parallax/solid_fore.png" alt="" className="w-full h-full object-cover scale-110 contrast-125" />
        </motion.div>

        {/* POST-PROCESSING VIGNETTE & GRAIN */}
        <div className="absolute inset-0 z-50 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] opacity-70" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 z-30 mix-blend-overlay" />
      </div>

      {/* CONTENT SCENES */}
      <div className="relative z-[45] w-full">
        <ParallaxHero scrollToMarket={() => scrollToFold('market')} />

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
                placeholder="Search for skills or nodes..."
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
        </section>

        <section className="bg-black/95 backdrop-blur-3xl border-t border-white/5 py-32 relative z-[45]">
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

      <motion.div 
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left shadow-[0_0_20px_rgba(255,5,5,0.5)]"
      />
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
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
    <main className="relative min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans scroll-smooth">
      
      {/* CLEAN BACKGROUND GRADIENT (SHADCN STYLE) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full">
        
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center">
          <ParallaxHero scrollToMarket={() => scrollToFold('market')} />
        </section>

        {/* MARKETPLACE SECTION */}
        <section id="market" className="relative py-32 flex flex-col items-center border-t bg-muted/30">
          <div className="max-w-7xl w-full px-8">
            <div className="mb-20 space-y-4 text-center">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-bold tracking-tight text-primary uppercase"
                >
                  Peer Registry
                </motion.h3>
                <div className="h-1 w-12 bg-accent mx-auto rounded-full" />
            </div>

            <div className="relative max-w-2xl mx-auto mb-16 group">
              <div className="relative flex items-center bg-background border rounded-full overflow-hidden p-1 shadow-sm transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <Search className="ml-5 size-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills, books, or tutoring..."
                  className="w-full h-14 pl-4 pr-6 bg-transparent text-sm font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {isSearchActive ? (
                 searchFetching ? (
                   Array(3).fill(0).map((_, i) => <ListingSkeleton key={i} />)
                 ) : (
                   searchResults.map((listing, idx) => (
                     <motion.div key={listing.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                       <ListingCard listing={listing} />
                     </motion.div>
                   ))
                 )
               ) : (
                 listingsLoading ? (
                   Array(6).fill(0).map((_, i) => <ListingSkeleton key={i} />)
                 ) : (
                   listings.length > 0 ? (
                     listings.map((listing, idx) => (
                       <motion.div key={listing.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                         <ListingCard listing={listing} />
                       </motion.div>
                     ))
                   ) : (
                     <div className="col-span-full py-24 text-center space-y-4">
                       <div className="h-12 w-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Search className="h-6 w-6 text-stone-300" />
                       </div>
                       <h4 className="text-xl font-bold text-primary uppercase italic">No active flows detected</h4>
                       <p className="text-sm text-stone-400 max-w-xs mx-auto">The registry is currently waiting for new scholarly exchange nodes to initialize.</p>
                     </div>
                   )
                 )
               )}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="relative z-10">
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

      <footer className="py-12 border-t bg-muted/20 text-center">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Jawaharlal Nehru University • 2026
        </p>
      </footer>
    </main>
  );
}

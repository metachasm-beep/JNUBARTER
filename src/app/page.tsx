"use client";

import { useState, useEffect } from "react";
import { ListingType, EffortEstimate } from "@prisma/client";
import { Zap, ArrowRight, Activity, Filter, LayoutGrid, GraduationCap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SpotlightCard from "@/components/SpotlightCard";
import Aurora from "@/components/Aurora";
import Link from "next/link";
import { ListingSkeleton } from "@/components/ListingSkeleton";
import { MobileActionDrawer } from "@/components/MobileActionDrawer";
import { ListingCard } from "@/components/ListingCard";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MOCK_CHAINS = [
  {
    users: ["ROHAN (SIS)", "PRIYA (SLL&CS)", "ARJUN (SS)"],
    listings: ["PYTHON TUTORING", "HINDI-FRENCH TRANS", "DATA ANALYSIS"],
    tags: ["CODING", "LANGUAGES", "ACADEMIC"]
  }
];

const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Python for Research",
    description: "Helping students with data visualization and automation scripts for their thesis.",
    type: "OFFER" as ListingType,
    category: "SERVICE",
    effortEstimate: "HIGH" as EffortEstimate,
    tags: ["python", "research", "sis"],
    user: { name: "ROHAN VERMA", school: "SIS", reputation: 450 },
  },
  {
    id: "2",
    title: "French Literature Review",
    description: "Looking for someone to help proofread my French translation project.",
    type: "WANT" as ListingType,
    category: "SERVICE",
    effortEstimate: "MEDIUM" as EffortEstimate,
    tags: ["french", "sllcs", "audit"],
    user: { name: "PRIYA DAS", school: "SLL&CS", reputation: 320 },
  },
  {
    id: "3",
    title: "Library Seat Swap",
    description: "Offering my reserved study slot in central library for academic help.",
    type: "WANT" as ListingType,
    category: "COMMODITY",
    condition: "RESERVED",
    tags: ["study", "campus", "library"],
    user: { name: "ARJUN SINGH", school: "SSS", reputation: 150 },
  },
];

export default function DiscoveryPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-40 overflow-x-hidden font-sans">
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-zinc-100 px-6 py-4 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
               <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
               <h2 className="text-xs font-black uppercase tracking-tighter italic text-zinc-800 leading-none">JNU_NODE_ALPHA</h2>
               <p className="text-[8px] font-bold text-primary uppercase tracking-[0.2em] mt-0.5">Reputation: 450</p>
            </div>
         </div>
         <Badge variant="outline" className="rounded-full px-4 py-1 text-[9px] font-bold uppercase tracking-widest border-zinc-200 text-zinc-400">
            SIS // DEPT
         </Badge>
      </nav>

      <div className="p-4 md:p-6 space-y-8 md:space-y-12">
        <div className="relative -mx-4 md:-mx-6 -mt-4 md:-mt-6 p-6 md:p-12 overflow-hidden border-b border-zinc-100 bg-zinc-50/50">
          <motion.div 
            animate={{ x: ["-5%", "5%", "-5%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 z-0 opacity-10 scale-125"
          >
            <Aurora 
              colorStops={['#8B0000', '#FF0000', '#8B0000']} 
              amplitude={0.3} 
              speed={0.1} 
            />
          </motion.div>
          
          <header className="relative z-10 space-y-4 md:space-y-6 max-w-2xl">
              <div className="flex items-center gap-2">
                 <Badge className="bg-primary/10 text-primary uppercase text-[8px] md:text-[10px] font-bold px-3 py-1 border-primary/20">
                    Campus Registry v4.0
                 </Badge>
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-[ -0.05em] leading-[0.85] text-primary uppercase italic">
                STUDENT <br/>
                <span className="text-zinc-300">RECIPROCITY</span>
              </h1>
              <p className="text-zinc-500 font-medium text-xs md:text-sm max-w-sm leading-relaxed">
                Premium zero-money network for the JNU student community. 
              </p>
          </header>
        </div>

        <section className="space-y-6">
           <div className="flex items-end justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">Active Nodes</h3>
              <Button variant="ghost" className="text-[9px] font-bold uppercase tracking-widest text-primary">Filter Protocol</Button>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-min">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => <ListingSkeleton key={i} />)
              ) : (
                <>
                  <div className="col-span-2 row-span-2">
                     <ListingCard listing={MOCK_LISTINGS[0]} className="h-full border-primary/10 shadow-xl shadow-primary/5" />
                  </div>
                  <ListingCard listing={MOCK_LISTINGS[1]} />
                  <ListingCard listing={MOCK_LISTINGS[2]} />
                  <div className="col-span-2">
                     <ListingCard listing={MOCK_LISTINGS[0]} />
                  </div>
                  <ListingCard listing={MOCK_LISTINGS[1]} />
                  <ListingCard listing={MOCK_LISTINGS[2]} />
                </>
              )}
           </div>
        </section>

        <section className="space-y-6">
           <div className="flex items-end justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">Triple Chains</h3>
              <p className="text-[8px] font-bold text-zinc-400 uppercase">Automated Reciprocity Discovery</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => <ListingSkeleton key={i} />)
            ) : (
              MOCK_CHAINS.map((chain, idx) => (
                <SpotlightCard key={idx} className="spotlight-card border-zinc-100 bg-white p-8 group rounded-3xl">
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest border-none">
                        Triple Match
                      </Badge>
                      <span className="text-[10px] font-mono text-zinc-300">#{idx + 1}02</span>
                    </div>
                    
                    <div className="space-y-6 relative">
                      <div className="absolute left-4 top-4 bottom-4 w-px bg-zinc-100" />
                      {chain.users.map((user, uIdx) => (
                        <div key={uIdx} className="flex items-center gap-6 relative z-10 transition-transform group-hover:translate-x-1">
                          <div className="h-8 w-8 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[11px] font-bold text-primary">
                            {uIdx + 1}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[11px] font-black tracking-tight text-zinc-800">{user}</p>
                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{chain.listings[uIdx]}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full mt-6 rounded-2xl bg-zinc-900 text-white font-bold uppercase text-[10px] tracking-widest h-14 hover:bg-primary transition-colors">
                      Connect Chain
                    </Button>
                  </div>
                </SpotlightCard>
              ))
            )}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-4">
               <div className="p-2 bg-zinc-50 rounded-xl">
                  <MapPin className="h-5 w-5 text-zinc-400" />
               </div>
               <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-800">All Offers</h2>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">Active service nodes on campus</p>
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => <ListingSkeleton key={i} />)
            ) : (
              MOCK_LISTINGS.map((listing) => (
                <MobileActionDrawer key={listing.id} listing={listing} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

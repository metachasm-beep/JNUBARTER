"use client";

import { useState, useEffect } from "react";
import { ListingType, EffortEstimate } from "@prisma/client";
import { Zap, ArrowRight, Activity, Filter, LayoutGrid, GraduationCap, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SpotlightCard from "@/components/SpotlightCard";
import Aurora from "@/components/Aurora";
import Link from "next/link";
import { ListingSkeleton } from "@/components/ListingSkeleton";
import { MobileActionDrawer } from "@/components/MobileActionDrawer";
import { ListingCard } from "@/components/ListingCard";
import { motion, AnimatePresence } from "framer-motion";

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
];

export default function DiscoveryPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-40 overflow-x-hidden font-sans selection:bg-primary/20">
      {/* Suggestion #3: Stripe-Inspired Gradient HUD */}
      <div className="relative w-full h-[500px] overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_50%_50%,_rgba(139,0,0,0.08)_0%,_rgba(255,255,255,0)_50%)] skew-y-[-6deg]" />
           <div className="absolute top-[10%] right-[-20%] w-[100%] h-[100%] bg-[radial-gradient(circle_at_50%_50%,_rgba(255,0,0,0.04)_0%,_rgba(255,255,255,0)_60%)] skew-y-[-6deg]" />
        </div>

        <nav className="relative z-50 w-full px-8 py-10 flex justify-between items-center max-w-7xl mx-auto">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transform -rotate-12 transition-transform hover:rotate-0 cursor-pointer">
                 <Share2 className="h-6 w-6 text-white" />
              </div>
              <div>
                 <h2 className="text-lg font-black tracking-tighter text-zinc-900 leading-none">JNU BARTER</h2>
                 <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-1 opacity-70">Protocol v5.0</p>
              </div>
           </div>
           
           <div className="hidden md:flex items-center gap-8">
              {['Market', 'Chains', 'Identity', 'Security'].map((item) => (
                <button key={item} className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors">{item}</button>
              ))}
           </div>

           <Button className="rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-widest px-8 shadow-xl shadow-primary/20 h-11 border-none transition-all hover:scale-105">
              Launch Node
           </Button>
        </nav>

        <header className="relative z-10 max-w-7xl mx-auto px-8 pt-20 flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
               <Badge className="bg-zinc-100 text-zinc-500 rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-widest border-none shadow-sm">
                  New: Triangular Trade Discovery Active
               </Badge>
               <h1 className="text-6xl md:text-[120px] font-black tracking-[-0.07em] leading-[0.85] text-zinc-900 mix-blend-multiply">
                 The exchange <br/> 
                 <span className="text-primary italic">is the reward.</span>
               </h1>
               <p className="text-zinc-500 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                 A financial-grade reciprocity engine built for JNU. <br/>
                 Swap expertise, commodities, and time—never money.
               </p>
               
               <div className="flex items-center justify-center gap-4 pt-4">
                  <Button className="rounded-full bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest px-10 h-14 hover:shadow-2xl transition-all">
                    Explore Market
                  </Button>
                  <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-primary px-10 h-14">
                    Learn Protocol <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
               </div>
            </motion.div>
        </header>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-20 relative z-20">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {isLoading ? (
             Array(3).fill(0).map((_, i) => <ListingSkeleton key={i} />)
           ) : (
             MOCK_LISTINGS.map((listing) => (
               <ListingCard 
                key={listing.id} 
                listing={listing} 
                className="bg-white rounded-[32px] border-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-1 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 group"
               />
             ))
           )}
        </section>

        <section className="mt-32 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-12">
               <div className="space-y-4">
                  <h3 className="text-4xl font-black tracking-tighter text-zinc-900">Network Pulse</h3>
                  <p className="text-zinc-500 font-medium max-w-md">Real-time matching nodes active in SIS, SLL&CS, and the Central Library.</p>
               </div>
               <div className="flex gap-2">
                  <Button variant="outline" className="rounded-full border-zinc-200 text-[10px] font-bold uppercase tracking-widest px-6 h-10">All Schools</Button>
                  <Button variant="outline" className="rounded-full border-zinc-200 text-[10px] font-bold uppercase tracking-widest px-6 h-10">High Rep</Button>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
               {isLoading ? (
                  Array(6).fill(0).map((_, i) => <ListingSkeleton key={i} />)
               ) : (
                  Array(12).fill(0).map((_, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square bg-white rounded-3xl shadow-sm border border-zinc-50 flex flex-col items-center justify-center p-6 gap-4 cursor-pointer hover:border-primary/20 hover:shadow-primary/5 transition-all"
                    >
                        <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center">
                           <GraduationCap className="h-6 w-6 text-zinc-300" />
                        </div>
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Node_{i+100}</p>
                    </motion.div>
                  ))
               )}
            </div>
        </section>
      </div>
    </div>
  );
}

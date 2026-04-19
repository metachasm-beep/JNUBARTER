"use client";

import { useState, useEffect } from "react";
import { ListingType, EffortEstimate } from "@prisma/client";
import { ArrowRight, GraduationCap, Share2, Info, ShieldAlert, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ListingSkeleton } from "@/components/ListingSkeleton";
import { ListingCard } from "@/components/ListingCard";
import { FAQSection } from "@/components/FAQSection";
import { InstallPWA } from "@/components/InstallPWA";

const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Python for Quantitative Research",
    description: "Pedagogical assistance for empirical data analysis and visualization via automated scripting for thesis candidates.",
    type: "OFFER" as ListingType,
    category: "SERVICE",
    effortEstimate: "HIGH" as EffortEstimate,
    tags: ["python", "quantitative", "sis"],
    user: { name: "ROHAN VERMA", school: "SIS", reputation: 450 },
  },
  {
    id: "2",
    title: "Francophone Literature Evaluation",
    description: "Seeking peer-review and linguistic validation for a French translation project within the humanities domain.",
    type: "WANT" as ListingType,
    category: "SERVICE",
    effortEstimate: "MEDIUM" as EffortEstimate,
    tags: ["french", "linguistics", "sllcs"],
    user: { name: "PRIYA DAS", school: "SLL&CS", reputation: 320 },
  },
];

export default function DiscoveryPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const scrollToFold = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-20 overflow-x-hidden font-sans selection:bg-primary/20 scroll-smooth">
      
      {/* FOLD 1: EXCLUSIVE HERO & INTRODUCTORY SCHEMA */}
      <section className="relative w-full h-screen flex flex-col bg-white overflow-hidden">
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
                 <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-1 opacity-70">Scholarly Node v5.1</p>
              </div>
           </div>
           
           <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'Registry', id: 'market' },
                { label: 'Network', id: 'pulse' },
                { label: 'Institutional FAQ', id: 'faq' },
                { label: 'Governance', id: 'faq' }
              ].map((item) => (
                <button 
                  key={item.label} 
                  onClick={() => scrollToFold(item.id)}
                  className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors"
                >
                  {item.label}
                </button>
              ))}
           </div>

           <Button 
             onClick={() => window.location.href = '/setup'}
             className="rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-widest px-8 shadow-xl shadow-primary/20 h-11 border-none transition-all hover:scale-105"
           >
              Initialize Node
           </Button>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
               <Badge className="bg-zinc-100 text-zinc-500 rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-widest border-none shadow-sm">
                  Protocol Update: JNU-Email Gated Entry Enforced
               </Badge>
               <h1 className="text-7xl md:text-[140px] font-black tracking-[-0.08em] leading-[0.8] text-zinc-900 mix-blend-multiply">
                 Academic <br/> 
                 <span className="text-primary italic">Reciprocity.</span>
               </h1>
               <p className="text-zinc-500 font-medium text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                 A decentralized scholarly exchange protocol designed for the JNU ecosystem. 
                 Optimize your research potential via bilateral and trilateral resource loops.
               </p>
               
               <div className="flex items-center justify-center gap-6 pt-6">
                  <Button 
                    onClick={() => scrollToFold('market')}
                    className="rounded-full bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest px-12 h-16 hover:shadow-2xl transition-all"
                  >
                    Enter Registry
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => scrollToFold('faq')}
                    className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-primary px-10 h-16"
                  >
                    Technical Specifications <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
               </div>
            </motion.div>
        </div>
        
        <div className="relative z-10 py-12 flex justify-center">
           <motion.div 
             animate={{ y: [0, 10, 0] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.5em] cursor-pointer"
             onClick={() => scrollToFold('market')}
           >
             Scroll to Discovery
           </motion.div>
        </div>
      </section>

      {/* FOLD 2: ACTIVE REGISTRY (MARKET) */}
      <section id="market" className="max-w-7xl mx-auto px-8 py-32 relative z-20">
        <div className="mb-20 space-y-4">
           <h3 className="text-5xl font-black tracking-tighter text-zinc-900 uppercase italic">Active Registry</h3>
           <p className="text-zinc-500 font-medium max-w-xl text-lg">Browse validated scholarly offerings and procurement requests within the university domain.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {isLoading ? (
             Array(3).fill(0).map((_, i) => <ListingSkeleton key={i} />)
           ) : (
             MOCK_LISTINGS.map((listing) => (
               <ListingCard 
                key={listing.id} 
                listing={listing} 
                className="bg-white rounded-[40px] border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] p-2 transition-all hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-4 group"
               />
             ))
           )}
        </div>
      </section>

      {/* FOLD 3: NETWORK PULSE & NODES */}
      <section id="pulse" className="bg-zinc-900 py-40 px-8">
        <div className="max-w-7xl mx-auto space-y-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-800 pb-16">
               <div className="space-y-6">
                  <Badge className="bg-primary/20 text-primary border-none rounded-full px-4 py-1 text-[9px] font-bold uppercase tracking-widest">Live Network</Badge>
                  <h3 className="text-6xl font-black tracking-tighter text-white uppercase">Network Pulse</h3>
                  <p className="text-zinc-400 font-medium max-w-md text-lg leading-relaxed">
                    Real-time visualization of academic matching nodes across SIS, SLL&CS, and SSS clusters.
                  </p>
               </div>
               <div className="flex gap-3">
                  <Button className="rounded-full bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-widest px-8 h-12 border-none">Cluster View</Button>
                  <Button className="rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-8 h-12 border-none">Global Node</Button>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
               {isLoading ? (
                  Array(6).fill(0).map((_, i) => <ListingSkeleton key={i} />)
               ) : (
                  Array(12).fill(0).map((_, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 0, 0, 0.1)" }}
                      className="aspect-square bg-zinc-800/50 rounded-[40px] border border-zinc-700/50 flex flex-col items-center justify-center p-8 gap-6 cursor-pointer transition-all"
                    >
                        <div className="h-16 w-16 rounded-full bg-zinc-700 flex items-center justify-center">
                           <GraduationCap className="h-8 w-8 text-zinc-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Node_{i+200}</p>
                          <p className="text-[8px] font-bold uppercase text-primary mt-1">Verified</p>
                        </div>
                    </motion.div>
                  ))
               )}
            </div>
        </div>
      </section>

      {/* FOLD 4: INSTITUTIONAL FAQ */}
      <FAQSection />

      {/* PWA INSTALLATION TRIGGER */}
      <InstallPWA />
    </div>
  );
}

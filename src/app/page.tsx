"use client";

import { useState, useEffect } from "react";
import { ListingType, EffortEstimate } from "@prisma/client";
import { ArrowRight, GraduationCap, Share2, Info, Zap, Globe, Search, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="min-h-screen bg-[#F8FAFC] pb-20 overflow-x-hidden font-sans selection:bg-primary/20 scroll-smooth">
      
      {/* FOLD 1: APPLE SCHOLASTIC GLASS HERO */}
      <section className="relative w-full h-screen flex flex-col bg-white overflow-hidden border-b border-zinc-100">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[-10%] left-[-5%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,_rgba(139,0,0,0.05)_0%,_rgba(255,255,255,0)_60%)]" />
        </div>

        {/* Glass Navigation Bar */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6">
           <nav className="glass rounded-full px-8 py-4 flex justify-between items-center shadow-xl shadow-black/5 border border-white/20">
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                    <Share2 className="h-4 w-4 text-white" />
                 </div>
                 <h2 className="text-sm font-black tracking-tight text-zinc-800 font-serif italic">JNU BARTER</h2>
              </div>
              <div className="flex items-center gap-6">
                 {['Market', 'Pulse', 'FAQ'].map((item) => (
                   <button 
                    key={item} 
                    onClick={() => scrollToFold(item.toLowerCase())}
                    className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors"
                   >
                    {item}
                   </button>
                 ))}
                 <div className="h-4 w-[1px] bg-zinc-200" />
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <User className="h-4 w-4 text-zinc-400" />
                 </Button>
              </div>
           </nav>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
               <Badge className="bg-primary/5 text-primary rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-widest border border-primary/10">
                  Institutional Reciprocity Protocol v7.0
               </Badge>
               
               <h1 className="text-7xl md:text-[150px] font-black tracking-[-0.07em] leading-[0.8] text-zinc-900 font-serif">
                 Academic <br/> 
                 <span className="text-primary italic font-serif">Exchange.</span>
               </h1>
               
               <p className="text-zinc-500 font-medium text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-sans">
                 A cinematic-grade platform for the non-monetary circulation of intellectual labor within the JNU academic ecosystem.
               </p>
               
               <div className="flex items-center justify-center gap-6 pt-6">
                  <Button 
                    onClick={() => scrollToFold('market')}
                    className="rounded-full bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest px-12 h-16 shadow-2xl shadow-black/20 hover:scale-105 transition-all"
                  >
                    Open Registry
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => scrollToFold('faq')}
                    className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-primary px-10 h-16"
                  >
                    Specifications <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
               </div>
            </motion.div>
        </div>
        
        <div className="relative z-10 py-12 flex justify-center">
           <motion.div 
             animate={{ y: [0, 8, 0] }}
             transition={{ duration: 3, repeat: Infinity }}
             className="text-[9px] font-black uppercase text-zinc-300 tracking-[0.6em] cursor-pointer"
             onClick={() => scrollToFold('market')}
           >
             Scroll to Discovery
           </motion.div>
        </div>
      </section>

      {/* FOLD 2: ACTIVE REGISTRY (GLASS CARDS) */}
      <section id="market" className="max-w-7xl mx-auto px-8 py-40 relative z-20">
        <div className="mb-24 space-y-4 text-center">
           <h3 className="text-5xl font-black tracking-tighter text-zinc-900 uppercase font-serif italic">Scholarly Registry</h3>
           <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
           <p className="text-zinc-400 font-medium max-w-xl mx-auto text-lg leading-relaxed">
             Validating bilateral matching nodes across university departments.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {isLoading ? (
             Array(3).fill(0).map((_, i) => <ListingSkeleton key={i} />)
           ) : (
             MOCK_LISTINGS.map((listing) => (
               <ListingCard 
                key={listing.id} 
                listing={listing} 
                className="bg-white rounded-[2rem] border border-zinc-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] p-4 transition-all hover:shadow-[0_40px_80px_-20px_rgba(139,0,0,0.08)] hover:-translate-y-3 group"
               />
             ))
           )}
        </div>
      </section>

      {/* FOLD 3: NETWORK PULSE (GLASS NODES) */}
      <section id="pulse" className="relative py-48 px-8 bg-white border-y border-zinc-50">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="max-w-7xl mx-auto space-y-24 relative z-10">
            <div className="flex flex-col items-center text-center space-y-6">
               <Badge className="bg-primary/5 text-primary border-none rounded-full px-4 py-1 text-[9px] font-bold uppercase tracking-[0.3em]">Institutional Pulse</Badge>
               <h3 className="text-6xl font-black tracking-tighter text-zinc-900 uppercase font-serif">Campus <span className="text-primary italic">Nodes.</span></h3>
               <p className="text-zinc-500 font-medium max-w-lg text-lg leading-relaxed">
                 Real-time visualization of academic matching vectors within the university network.
               </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
               {isLoading ? (
                  Array(6).fill(0).map((_, i) => <ListingSkeleton key={i} />)
               ) : (
                  Array(12).fill(0).map((_, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square glass rounded-[2.5rem] flex flex-col items-center justify-center p-8 gap-6 cursor-pointer shadow-sm border border-white transition-all group"
                    >
                        <div className="h-16 w-16 rounded-3xl bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:bg-primary/5 transition-all">
                           <GraduationCap className="h-8 w-8 text-zinc-300 group-hover:text-primary transition-all" />
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Node_{i+400}</p>
                        </div>
                    </motion.div>
                  ))
               )}
            </div>
        </div>
      </section>

      {/* FOLD 4: INSTITUTIONAL FAQ (CLEAN GLASS ACCORDION) */}
      <FAQSection />

      {/* PWA INSTALLATION TRIGGER */}
      <InstallPWA />
    </div>
  );
}

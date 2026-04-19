"use client";

import { useState, useEffect } from "react";
import { ListingType, EffortEstimate } from "@prisma/client";
import { ArrowRight, GraduationCap, Share2, Filter, LayoutGrid, Activity, Search, Info } from "lucide-react";
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
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden selection:bg-primary/20 scroll-smooth">
      
      {/* FOLD 1: JNU BRUTALIST HERO */}
      <section className="relative w-full h-screen flex flex-col bg-background border-b-4 border-black overflow-hidden">
        {/* Subtle Sandstone Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />

        <nav className="relative z-50 w-full px-8 py-12 flex justify-between items-center max-w-7xl mx-auto">
           <div className="flex items-center gap-6">
              <div className="h-14 w-14 bg-primary flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer">
                 <Share2 className="h-8 w-8 text-white" />
              </div>
              <div className="border-l-4 border-black pl-6">
                 <h2 className="text-3xl font-black tracking-tighter text-zinc-900 leading-none uppercase italic font-sans">JNU BARTER</h2>
                 <p className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mt-2 font-mono">Registry_Node_v6.0</p>
              </div>
           </div>
           
           <div className="hidden lg:flex items-center gap-12">
              {[
                { label: 'Market', id: 'market' },
                { label: 'Pulse', id: 'pulse' },
                { label: 'FAQ', id: 'faq' }
              ].map((item) => (
                <button 
                  key={item.label} 
                  onClick={() => scrollToFold(item.id)}
                  className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors font-mono"
                >
                  [{item.label}]
                </button>
              ))}
           </div>

           <Button 
             onClick={() => window.location.href = '/setup'}
             className="bg-primary text-white text-xs font-black uppercase tracking-widest px-10 h-14 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
           >
              Initialize Node
           </Button>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col items-start justify-center px-8 md:px-20 max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
               <div className="inline-block bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] font-mono">
                  Gated_Institutional_Reciprocity
               </div>
               
               <h1 className="text-8xl md:text-[180px] font-black tracking-[-0.06em] leading-[0.75] text-zinc-900 font-sans uppercase">
                 Academic <br/> 
                 <span className="text-primary italic">Labor.</span>
               </h1>
               
               <div className="max-w-3xl space-y-8">
                  <p className="text-zinc-600 font-serif text-2xl md:text-4xl leading-tight border-l-8 border-primary pl-8">
                    A decentralized protocol facilitating the exchange of intellectual and material resources within the JNU academic ecosystem.
                  </p>
                  <p className="text-zinc-400 font-mono text-sm uppercase tracking-tight">
                    // Zero-Money Axiom Active <br/>
                    // @jnu.ac.in Gating Enforced
                  </p>
               </div>
               
               <div className="flex items-center gap-4 pt-4">
                  <Button 
                    onClick={() => scrollToFold('market')}
                    className="bg-zinc-900 text-white text-sm font-black uppercase tracking-widest px-14 h-20 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                  >
                    Open Registry
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => scrollToFold('faq')}
                    className="text-sm font-black uppercase tracking-widest text-zinc-500 hover:text-primary px-10 h-20 font-mono"
                  >
                    Technical_Specs _-&gt;
                  </Button>
               </div>
            </motion.div>
        </div>
      </section>

      {/* FOLD 2: ACTIVE REGISTRY (BRUTALIST GRID) */}
      <section id="market" className="max-w-7xl mx-auto px-8 py-40 relative z-20">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b-8 border-black pb-16">
           <div className="space-y-6">
              <h3 className="text-7xl font-black tracking-tighter text-zinc-900 uppercase italic font-sans">Scholarly Marketplace</h3>
              <p className="text-zinc-500 font-serif text-2xl max-w-2xl italic">Validating the peer-to-peer circulation of research commodities and pedagogical services.</p>
           </div>
           <div className="flex gap-4">
              <Button variant="outline" className="border-4 border-black rounded-none h-14 px-8 text-xs font-black uppercase font-mono">Filter_By_School</Button>
              <Button variant="outline" className="border-4 border-black rounded-none h-14 px-8 text-xs font-black uppercase font-mono">Sort_By_Rep</Button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           {isLoading ? (
             Array(3).fill(0).map((_, i) => <ListingSkeleton key={i} />)
           ) : (
             MOCK_LISTINGS.map((listing) => (
               <div key={listing.id} className="group relative">
                  <div className="absolute inset-0 bg-primary translate-x-3 translate-y-3 -z-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-all" />
                  <ListingCard 
                    listing={listing} 
                    className="bg-white rounded-none border-4 border-black p-8 transition-all group-hover:-translate-x-2 group-hover:-translate-y-2"
                  />
               </div>
             ))
           )}
        </div>
      </section>

      {/* FOLD 3: NETWORK NODES (TERMINAL STYLE) */}
      <section id="pulse" className="bg-black py-48 px-8 border-y-8 border-primary">
        <div className="max-w-7xl mx-auto space-y-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-4 border-zinc-800 pb-20">
               <div className="space-y-8">
                  <div className="inline-block bg-primary text-white px-4 py-1 text-[9px] font-black uppercase tracking-[0.5em] font-mono">Live_Network_Visualizer</div>
                  <h3 className="text-8xl font-black tracking-tighter text-white uppercase font-sans">Pulse <span className="text-primary italic">Nodes.</span></h3>
                  <p className="text-zinc-500 font-mono text-lg leading-relaxed max-w-xl">
                    &gt; Monitoring institutional matching vectors... <br/>
                    &gt; Active clusters detected in SIS, SLL&CS, and SSS.
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
               {isLoading ? (
                  Array(6).fill(0).map((_, i) => <ListingSkeleton key={i} />)
               ) : (
                  Array(12).fill(0).map((_, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(139, 0, 0, 0.4)" }}
                      className="aspect-square bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center p-8 gap-6 cursor-pointer transition-all group"
                    >
                        <div className="h-16 w-16 bg-zinc-800 flex items-center justify-center border-2 border-zinc-700 group-hover:border-primary transition-all">
                           <GraduationCap className="h-8 w-8 text-zinc-500 group-hover:text-white transition-all" />
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest font-mono group-hover:text-zinc-300">N_{i+300}</p>
                        </div>
                    </motion.div>
                  ))
               )}
            </div>
        </div>
      </section>

      {/* FOLD 4: INSTITUTIONAL FAQ (BRUTALIST ACCORDION) */}
      <FAQSection />

      {/* PWA INSTALLATION TRIGGER */}
      <InstallPWA />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { ListingType, EffortEstimate } from "@prisma/client";
import { ArrowRight, GraduationCap, Share2, Info, Zap, Globe, Search, Plus, User, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ListingSkeleton } from "@/components/ListingSkeleton";
import { ListingCard } from "@/components/ListingCard";
import { FAQSection } from "@/components/FAQSection";
import { InstallPWA } from "@/components/InstallPWA";

// --- React Bits / Custom Components ---

const Magnet = ({ children, padding = 100, magnetStrength = 2 }: any) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: any) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distX = Math.abs(centerX - e.clientX);
    const distY = Math.abs(centerY - e.clientY);
    if (distX < width / 2 + padding && distY < height / 2 + padding) {
      setPosition({ x: (e.clientX - centerX) / magnetStrength, y: (e.clientY - centerY) / magnetStrength });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={ref} style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)`, transition: "transform 0.3s ease-out" }}>
      {children}
    </div>
  );
};

const SpotlightCard = ({ children, className }: any) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          setOpacity(0.6);
        }
      }}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden ${className}`}
    >
      <div 
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{ opacity, background: `radial-gradient(circle at ${pos.x}px ${pos.y}px, rgba(139, 0, 0, 0.08), transparent 80%)` }}
      />
      {children}
    </div>
  );
};

import { useRef } from "react";

// --- Main Page ---

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
    <div className="min-h-screen bg-[#FDFDFD] pb-20 overflow-x-hidden font-sans selection:bg-primary/20 scroll-smooth">
      
      {/* FOLD 1: APPLE SCHOLASTIC GLASS HERO */}
      <section className="relative w-full h-screen flex flex-col bg-white overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[-10%] left-[-5%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,_rgba(139,0,0,0.04)_0%,_rgba(255,255,255,0)_60%)]" />
        </div>

        {/* Floating Glass Navigation */}
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-6">
           <nav className="glass rounded-full px-8 py-4 flex justify-between items-center shadow-2xl shadow-black/5 border border-white/40 backdrop-blur-3xl">
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Share2 className="h-4 w-4 text-white" />
                 </div>
                 <h2 className="text-sm font-black tracking-tighter text-zinc-800 font-serif italic">JNU BARTER</h2>
              </div>
              <div className="flex items-center gap-8">
                 {['Market', 'Pulse', 'FAQ'].map((item) => (
                   <button 
                    key={item} 
                    onClick={() => scrollToFold(item.toLowerCase())}
                    className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-primary transition-all hover:scale-110 active:scale-95"
                   >
                    {item}
                   </button>
                 ))}
                 <div className="h-4 w-[1px] bg-zinc-200/50" />
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-zinc-50">
                    <User className="h-4 w-4 text-zinc-400" />
                 </Button>
              </div>
           </nav>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
               <Badge className="bg-primary/5 text-primary rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-widest border border-primary/10">
                  Institutional Reciprocity Protocol v7.5
               </Badge>
               
               <h1 className="text-8xl md:text-[160px] font-black tracking-[-0.08em] leading-[0.75] text-zinc-900 font-serif">
                 Academic <br/> 
                 <span className="text-primary italic font-serif">Exchange.</span>
               </h1>
               
               <p className="text-zinc-500 font-medium text-xl md:text-3xl max-w-4xl mx-auto leading-tight font-sans">
                 A cinematic-grade platform for the non-monetary circulation of intellectual labor within the JNU academic ecosystem.
               </p>
               
               <div className="flex items-center justify-center gap-8 pt-8">
                  <Magnet magnetStrength={5}>
                    <Button 
                      onClick={() => scrollToFold('market')}
                      className="rounded-full bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest px-14 h-20 shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] transition-all"
                    >
                      Open Registry
                    </Button>
                  </Magnet>
                  <Button 
                    variant="ghost" 
                    onClick={() => scrollToFold('faq')}
                    className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-primary px-10 h-20 group"
                  >
                    Technical Specifications <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </div>
            </motion.div>
        </div>
      </section>

      {/* FOLD 2: ACTIVE REGISTRY (SPOTLIGHT GLASS CARDS) */}
      <section id="market" className="max-w-7xl mx-auto px-8 py-48 relative z-20">
        <div className="mb-32 space-y-6 text-center">
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
           >
            <h3 className="text-6xl font-black tracking-tighter text-zinc-900 uppercase font-serif italic">Scholarly Registry</h3>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mt-6" />
            <p className="text-zinc-400 font-medium max-w-2xl mx-auto text-xl leading-relaxed mt-8">
              Validating bilateral matching nodes across university departments through peer-vouched reciprocity.
            </p>
           </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           {isLoading ? (
             Array(3).fill(0).map((_, i) => <ListingSkeleton key={i} />)
           ) : (
             MOCK_LISTINGS.map((listing) => (
               <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
               >
                 <SpotlightCard className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.03)] p-6 group transition-all">
                   <ListingCard 
                    listing={listing} 
                    className="bg-transparent border-none p-0 group-hover:-translate-y-2 transition-transform"
                   />
                 </SpotlightCard>
               </motion.div>
             ))
           )}
        </div>
      </section>

      {/* FOLD 3: NETWORK PULSE (GAUGE NODES) */}
      <section id="pulse" className="relative py-60 px-8 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <div className="max-w-7xl mx-auto space-y-32 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8">
               <Badge className="bg-primary/5 text-primary border-none rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-[0.4em]">Node Velocity</Badge>
               <h3 className="text-7xl font-black tracking-tighter text-zinc-900 uppercase font-serif">Network <span className="text-primary italic">Integrity.</span></h3>
               <p className="text-zinc-500 font-medium max-w-2xl text-xl leading-relaxed">
                 Real-time visualization of academic matching vectors. Every node represents a verified @jnu.ac.in participation point.
               </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
               {isLoading ? (
                  Array(6).fill(0).map((_, i) => <ListingSkeleton key={i} />)
               ) : (
                  Array(12).fill(0).map((_, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="aspect-square glass rounded-[3rem] flex flex-col items-center justify-center p-8 gap-6 cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-white transition-all group"
                    >
                        <div className="h-20 w-20 rounded-[2rem] bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:bg-primary/5 transition-all relative overflow-hidden">
                           <GraduationCap className="h-10 w-10 text-zinc-300 group-hover:text-primary transition-all z-10" />
                           <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-2 border-dashed border-primary/10 rounded-[2rem] opacity-0 group-hover:opacity-100"
                           />
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em] font-mono">Node_{i+500}</p>
                          <p className="text-[8px] font-bold text-primary/40 uppercase mt-1">Verified</p>
                        </div>
                    </motion.div>
                  ))
               )}
            </div>
        </div>
      </section>

      {/* FOLD 4: LAYMAN FAQ */}
      <FAQSection />

      {/* PWA INSTALLATION TRIGGER */}
      <InstallPWA />
    </div>
  );
}

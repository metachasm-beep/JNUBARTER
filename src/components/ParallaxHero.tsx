"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Sparkles, Library, GraduationCap, ChevronDown } from "lucide-react";

export function ParallaxHero({ scrollToMarket }: { scrollToMarket: () => void }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth scroll springs for buttery motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Layer Speeds (Scroll Offset -> Translation)
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "25%"]);
  const midY = useTransform(smoothProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(smoothProgress, [0, 1], ["0%", "12%"]);
  const foreY = useTransform(smoothProgress, [0, 1], ["0%", "-10%"]); 
  
  // Antigravity Perspective Shift
  const rotateX = useTransform(smoothProgress, [0, 1], [0, 8]);
  const textOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[110vh] overflow-hidden bg-black flex items-center justify-center perspective-[1200px]"
    >
      {/* 1. LAYER: CINEMATIC UNIVERSITY COURTYARD (BACKGROUND) */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 z-0 scale-110 pointer-events-none"
      >
        <img 
          src="/images/parallax/academic_bg.png" 
          alt="University Night" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
      </motion.div>

      {/* 2. LAYER: GRAND SCHOLARLY ARCH (MIDGROUND - SANDWICH TOP) */}
      <motion.div 
        style={{ y: midY }}
        className="absolute inset-0 z-30 scale-105 pointer-events-none"
      >
        <img 
          src="/images/parallax/academic_mid.png" 
          alt="Gothic Archway" 
          className="w-full h-full object-cover drop-shadow-[0_0_100px_rgba(0,0,0,0.9)]"
        />
      </motion.div>

      {/* 3. LAYER: HERO CONTENT (SANDWICH CENTER) */}
      <motion.div 
        style={{ y: textY, rotateX, opacity: textOpacity }}
        className="relative z-20 text-center px-8 flex flex-col items-center gap-12 pointer-events-auto"
      >
        <div className="flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-3xl px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-accent italic shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <GraduationCap className="h-4 w-4" /> Scholarly Exchange Node
          </motion.div>
          
          <h1 className="text-7xl md:text-[200px] font-black tracking-[-0.08em] leading-[0.75] text-white mix-blend-difference drop-shadow-[0_40px_40px_rgba(0,0,0,1)]">
            MERIT <br/> 
            <span className="text-accent italic font-serif font-light">REGISTRY.</span>
          </h1>
        </div>
        
        <p className="text-stone-300 font-medium text-lg md:text-2xl max-w-4xl mx-auto leading-tight drop-shadow-2xl">
          The global decentralized standard for <span className="text-white font-bold">Academic Reciprocity</span>. <br/>
          Direct peer-to-peer barter of knowledge, research, and scholarly assets.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-8">
          <Button 
            onClick={() => signIn("google")}
            className="rounded-full bg-white text-black text-[11px] font-black uppercase tracking-widest px-20 h-24 shadow-[0_0_80px_rgba(255,255,255,0.3)] hover:bg-accent hover:text-white hover:scale-105 transition-all duration-700 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Initialize Node <Sparkles className="h-4 w-4 group-hover:animate-spin" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </Button>
          
          <Button 
            variant="ghost"
            onClick={scrollToMarket}
            className="rounded-full text-white/40 text-[10px] font-black uppercase tracking-widest px-10 h-24 hover:text-white hover:bg-white/5 transition-all flex flex-col gap-2"
          >
            <span>Explore Registry</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </Button>
        </div>
      </motion.div>

      {/* 4. LAYER: FLOATING KNOWLEDGE (FOREGROUND - FASTEST) */}
      <motion.div 
        style={{ y: foreY }}
        className="absolute inset-0 z-40 pointer-events-none overflow-visible"
      >
        <motion.img 
          animate={{ 
            y: [0, -40, 0],
            rotate: [0, 3, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          src="/images/parallax/academic_near.png" 
          alt="Floating Books and Parchment" 
          className="w-full h-full object-cover opacity-100 filter drop-shadow-[0_100px_150px_rgba(0,0,0,1)] scale-110"
        />
      </motion.div>

      {/* 5. ULTIMATE BLACK BLEND (GROUNDING LAYER) */}
      <div className="absolute bottom-0 left-0 right-0 h-[60vh] bg-gradient-to-t from-black via-black/80 to-transparent z-50 pointer-events-none" />
      
      {/* 6. STATIC/STARDUST ATMOSPHERE */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen" />
    </section>
  );
}

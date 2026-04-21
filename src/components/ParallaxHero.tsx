"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Sparkles, Layers, ChevronDown, GraduationCap, Box } from "lucide-react";

export function ParallaxHero({ scrollToMarket }: { scrollToMarket: () => void }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth scroll springs for buttery motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 30,
    restDelta: 0.001
  });

  // ISOMETRIC TRANSFORMATIONS
  // Background zooms in and centers
  const bgZ = useTransform(smoothProgress, [0, 0.8], [-400, 0]);
  const bgRotate = useTransform(smoothProgress, [0, 1], [-5, 0]);
  
  // Midground slides in from the right diagonal
  const midX = useTransform(smoothProgress, [0, 1], [400, 0]);
  const midY = useTransform(smoothProgress, [0, 1], [200, 0]);
  const midScale = useTransform(smoothProgress, [0, 1], [0.8, 1]);
  
  // Foreground artifacts slide in from the left diagonal
  const foreX = useTransform(smoothProgress, [0, 1], [-400, 0]);
  const foreY = useTransform(smoothProgress, [0, 1], [-200, 0]);
  
  // Text fading/scaling
  const textOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);
  const textY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[200vh] bg-[#020204] overflow-hidden flex flex-col items-center"
    >
      {/* 1. THE ISOMETRIC STACK WRAPPER (STICKY) */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center perspective-[2500px]">
        
        <div className="relative w-full max-w-7xl aspect-video preserve-3d transform rotate-x-[55deg] rotate-z-[-35deg] scale-150 md:scale-100">
          
          {/* LAYER 0: ISOMETRIC CAMPUS BASE */}
          <motion.div 
            style={{ translateZ: bgZ, rotateZ: bgRotate }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <img 
              src="/images/parallax/isometric_bg.png" 
              alt="Isometric University" 
              className="w-full h-full object-contain opacity-50 contrast-125"
            />
          </motion.div>

          {/* LAYER 1: LIBRARY SECTION (MID) */}
          <motion.div 
            style={{ x: midX, y: midY, scale: midScale, translateZ: 150 }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            <img 
              src="/images/parallax/isometric_mid.png" 
              alt="Library Section" 
              className="w-full h-full object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,1)]"
            />
          </motion.div>

          {/* LAYER 2: SCHOLARLY ARTIFACTS (FORE) */}
          <motion.div 
            style={{ x: foreX, y: foreY, translateZ: 400 }}
            className="absolute inset-0 z-40 pointer-events-none"
          >
            <motion.img 
              animate={{ 
                translateZ: [400, 420, 400],
                rotate: [0, 1, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              src="/images/parallax/isometric_near.png" 
              alt="Academic Artifacts" 
              className="w-full h-full object-contain filter drop-shadow-[0_100px_200px_rgba(0,0,0,1)]"
            />
          </motion.div>
        </div>

        {/* 2. OVERLAY TEXT (FIXED POSITION RELATIVE TO HERO) */}
        <motion.div 
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center px-8 pointer-events-none"
        >
          <div className="space-y-10 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 bg-accent/10 border border-accent/20 backdrop-blur-3xl px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-[0.5em] text-accent italic shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            >
              <Box className="h-4 w-4" /> Spatial Merit Protocol
            </motion.div>
            
            <h1 className="text-7xl md:text-[220px] font-black tracking-[-0.1em] leading-[0.7] text-white mix-blend-difference drop-shadow-[0_60px_60px_rgba(0,0,0,1)]">
              MERIT <br/> 
              <span className="text-accent italic font-serif font-light opacity-90">PROTOCOL.</span>
            </h1>

            <p className="text-stone-400 font-medium text-lg md:text-3xl max-w-4xl mx-auto leading-tight drop-shadow-2xl">
              The spatial standard for <span className="text-white">Academic Reciprocity</span>. <br/>
              A living, multi-layered architecture for decentralized exchange.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10 pt-12">
              <Button 
                onClick={() => signIn("google")}
                className="rounded-[2.5rem] bg-white text-black text-[12px] font-black uppercase tracking-widest px-24 h-24 shadow-[0_0_100px_rgba(255,255,255,0.2)] hover:bg-accent hover:text-white hover:scale-105 transition-all duration-700 group"
              >
                Enter Registry <Sparkles className="ml-3 h-4 w-4 group-hover:animate-ping" />
              </Button>
              
              <Button 
                variant="ghost"
                onClick={scrollToMarket}
                className="rounded-full text-white/40 text-[10px] font-black uppercase tracking-widest px-10 h-24 hover:text-white hover:bg-white/5 transition-all flex flex-col gap-2"
              >
                <span>Explore Map</span>
                <ChevronDown className="h-4 w-4 animate-bounce" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. ATMOSPHERIC BLENDING */}
      <div className="absolute bottom-0 left-0 right-0 h-[60vh] bg-gradient-to-t from-[#020204] via-[#020204]/90 to-transparent z-[60] pointer-events-none" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen" />
    </section>
  );
}

"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Sparkles, Library, GraduationCap, ChevronDown, MousePointer2 } from "lucide-react";

export function ParallaxHero({ scrollToMarket }: { scrollToMarket: () => void }) {
  const containerRef = useRef(null);
  
  // Design Spell: Mouse Particles
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full min-h-screen flex items-center justify-center pointer-events-none"
    >
      {/* Design Spell: Interactive Knowledge Aura */}
      <motion.div 
        style={{ 
          x: mouseX, 
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        className="fixed inset-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-10 mix-blend-screen"
      />

      {/* Hero Typography Scene */}
      <div className="relative z-50 text-center px-8 flex flex-col items-center gap-16 pointer-events-auto">
        
        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-3xl px-10 py-4 rounded-full text-[12px] font-black uppercase tracking-[0.5em] text-accent italic shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
          >
            <Library className="h-4 w-4" /> Scholarly Node Initialization
          </motion.div>
          
          <h1 className="text-8xl md:text-[240px] font-black tracking-[-0.1em] leading-[0.65] text-white mix-blend-difference drop-shadow-[0_80px_80px_rgba(0,0,0,1)]">
            MERIT <br/> 
            <span className="text-accent italic font-serif font-light opacity-80">REGISTRY.</span>
          </h1>
        </div>
        
        <div className="space-y-6 max-w-5xl mx-auto">
          <p className="text-stone-400 font-medium text-xl md:text-4xl leading-tight drop-shadow-2xl">
            The world's first <span className="text-white font-black underline decoration-accent decoration-4 underline-offset-8">Zero-Currency</span> <br/> 
            standard for Academic Exchange.
          </p>
          <div className="h-px w-32 bg-accent/40 mx-auto" />
          <p className="text-stone-500 text-sm md:text-lg tracking-[0.2em] uppercase font-black">
            Powered by Multi-Party Barter Chains
          </p>
        </div>

        {/* Magnetic Button Interaction */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <Button 
              onClick={() => signIn("google")}
              className="rounded-full bg-white text-black text-[13px] font-black uppercase tracking-[0.2em] px-28 h-28 shadow-[0_0_120px_rgba(255,255,255,0.3)] hover:bg-accent hover:text-white transition-all duration-700 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-4">
                Initialize Connection <Sparkles className="h-5 w-5 group-hover:rotate-45 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </Button>
            <div className="absolute -inset-4 bg-accent/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </motion.div>
          
          <Button 
            variant="ghost"
            onClick={scrollToMarket}
            className="rounded-full text-white/30 text-[11px] font-black uppercase tracking-[0.3em] px-12 h-28 hover:text-white hover:bg-white/5 transition-all flex flex-col gap-3 group"
          >
            <span>Descend to Market</span>
            <ChevronDown className="h-5 w-5 animate-bounce group-hover:text-accent" />
          </Button>
        </div>
      </div>

      {/* Global Scroll Hint (Editorial) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-white to-transparent" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white [writing-mode:vertical-lr]">Scroll to Reveal World</span>
      </div>
    </div>
  );
}

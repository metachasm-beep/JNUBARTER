"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Sparkles } from "lucide-react";

export function ParallaxHero({ scrollToMarket }: { scrollToMarket: () => void }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Layer Speeds (Scroll Offset -> Translation)
  const skyY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const farY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const nearY = useTransform(scrollYProgress, [0, 1], ["0%", "0%"]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center"
    >
      {/* 1. Starry Sky (Slower) */}
      <motion.div 
        style={{ y: skyY }}
        className="absolute inset-0 z-0 scale-110 pointer-events-none"
      >
        <img 
          src="/images/parallax/sky_stars.png" 
          alt="Stars" 
          className="w-full h-full object-cover opacity-70"
        />
      </motion.div>

      {/* 2. Far Mountain Range */}
      <motion.div 
        style={{ y: farY }}
        className="absolute inset-0 z-10 scale-105 pointer-events-none"
      >
        <img 
          src="/images/parallax/mountains_far.png" 
          alt="Far Mountains" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* 3. Hero Text (Sandwiched) */}
      <motion.div 
        style={{ y: textY }}
        className="relative z-20 text-center px-8 flex flex-col items-center gap-12 pointer-events-auto"
      >
        <div className="space-y-4">
          <Badge className="bg-accent/20 text-accent border-accent/20 px-4 py-1 rounded-full uppercase tracking-[0.2em] text-[10px] font-black italic">
            <Sparkles className="h-3 w-3 mr-2 inline" /> Scholarly Reciprocity
          </Badge>
          <h1 className="text-6xl md:text-[180px] font-black tracking-[-0.08em] leading-[0.75] text-white drop-shadow-[0_20px_20px_rgba(0,0,0,0.9)]">
            BEYOND <br/> 
            <span className="text-accent italic">CURRENCY.</span>
          </h1>
        </div>
        
        <p className="text-stone-300 font-medium text-lg md:text-2xl max-w-3xl mx-auto leading-tight drop-shadow-xl backdrop-blur-[2px] bg-black/10 p-4 rounded-3xl">
          Premium peer-to-peer exchange within the global academic ecosystem. <br/>
          <span className="text-white">No cash. No credit. Pure merit.</span>
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
          <Button 
            onClick={() => signIn("google")}
            className="rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest px-20 h-20 shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:bg-stone-200 hover:scale-105 transition-all duration-500"
          >
            Authenticate Node
          </Button>
          
          <Button 
            variant="ghost"
            onClick={scrollToMarket}
            className="rounded-full text-white/60 text-[10px] font-black uppercase tracking-widest px-10 h-20 hover:text-white transition-colors"
          >
            Explore Peer Registry
          </Button>
        </div>
      </motion.div>

      {/* 4. Midground Mountains (OCLUSION LAYER) */}
      <motion.div 
        style={{ y: midY }}
        className="absolute inset-0 z-30 pointer-events-none"
      >
        <img 
          src="/images/parallax/mountains_mid.png" 
          alt="Mid Mountains" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* 5. Near Foreground (STABLE BASE) */}
      <motion.div 
        style={{ y: nearY }}
        className="absolute inset-0 z-40 pointer-events-none"
      >
        <img 
          src="/images/parallax/mountains_near.png" 
          alt="Foreground" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* 6. Bottom Blend Mask */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-background via-background/80 to-transparent z-50 pointer-events-none" />
    </section>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}

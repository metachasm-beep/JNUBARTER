"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ParallaxHero } from "@/components/ParallaxHero";
import { MarketplaceRegistry } from "@/components/MarketplaceRegistry";
import { TriangulationEngine } from "@/components/TriangulationEngine";
import { NetworkSentiment } from "@/components/NetworkSentiment";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 30,
    restDelta: 0.001
  });

  // GLOBAL PARALLAX LAYERS (Cinematic Silhouette Flow)
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);
  const midY = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const foreY = useTransform(smoothProgress, [0, 1], ["0%", "60%"]);
  const particleY = useTransform(smoothProgress, [0, 1], ["0%", "45%"]);
  const particleRotate = useTransform(smoothProgress, [0, 1], [0, 15]);

  if (!mounted) return null;

  return (
    <main 
      ref={containerRef} 
      className="relative w-full min-h-screen bg-black overflow-x-hidden selection:bg-accent selection:text-white"
    >
      {/* --- GLOBAL CINEMATIC WORLD (FIXED) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        
        {/* Layer 0: Cosmic Night Sky (Deep Background) */}
        <motion.div 
          style={{ y: bgY }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/images/parallax/global_bg.png" 
            alt="Barter Cosmic Sky" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
        </motion.div>

        {/* Layer 1: Misty University Spires (Midground) */}
        <motion.div 
          style={{ y: midY }}
          className="absolute inset-0 z-10"
        >
          <img 
            src="/images/parallax/global_mid.png" 
            alt="University Spires" 
            className="w-full h-full object-cover opacity-80 mix-blend-screen"
          />
        </motion.div>

        {/* Layer 2: Floating Knowledge Particles (Magic) */}
        <motion.div 
          style={{ y: particleY, rotate: particleRotate }}
          className="absolute inset-0 z-20"
        >
          <img 
            src="/images/parallax/global_particles.png" 
            alt="Knowledge Dust" 
            className="w-full h-full object-cover opacity-40 scale-110"
          />
        </motion.div>

        {/* Layer 3: Silhouette Occlusion (Foreground - Sandwiches everything) */}
        <motion.div 
          style={{ y: foreY }}
          className="absolute inset-0 z-40"
        >
          <img 
            src="/images/parallax/global_fore.png" 
            alt="Gothic Archway Occlusion" 
            className="w-full h-full object-cover scale-110 contrast-150"
          />
        </motion.div>

        {/* Global Atmosphere Overlays */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-50" />
      </div>

      {/* --- CONTENT SCENES (STAIRCASE OF SECTIONS) --- */}
      <div className="relative z-[45] w-full">
        
        {/* 1. Hero Scene (Transparent) */}
        <section className="relative min-h-screen">
          <ParallaxHero scrollToMarket={() => {
            const market = document.getElementById("marketplace");
            market?.scrollIntoView({ behavior: "smooth" });
          }} />
        </section>

        {/* 2. Marketplace Scene (Transparent) */}
        <section id="marketplace" className="relative min-h-screen py-32">
          <MarketplaceRegistry />
        </section>

        {/* 3. Engine Scene (Dark Background Blur) */}
        <section className="relative min-h-screen py-32 bg-black/40 backdrop-blur-sm border-y border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.9)]">
          <TriangulationEngine />
        </section>

        {/* 4. Network Scene (Transparent) */}
        <section className="relative min-h-screen py-32">
          <NetworkSentiment />
        </section>

        {/* 5. Footer Scene (Black Grounding) */}
        <section className="relative bg-black pt-32">
          <Footer />
        </section>
      </div>

      {/* Global Scroll Indicator (Custom Design Spell) */}
      <motion.div 
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left shadow-[0_0_20px_rgba(255,5,5,0.5)]"
      />
    </main>
  );
}

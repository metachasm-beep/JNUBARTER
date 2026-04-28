"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowRight, Sparkles, Globe, Zap } from "lucide-react";
import { signIn } from "next-auth/react";

// REACT BITS INTEGRATION
import DecryptedText from "./bits/DecryptedText";
import ShinyText from "./bits/ShinyText";
import CountUp from "./bits/CountUp";
import Lanyard from "./bits/Lanyard";

export const ParallaxHero = ({ scrollToMarket, onSignIn }: { scrollToMarket: () => void, onSignIn: () => void }) => {
  const [stats, setStats] = React.useState({ verifiedNodes: 0, activeSwaps: 0 });

  React.useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* HIGH CONTRAST JNU BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 brightness-[0.65] contrast-[1.8]"
          style={{ backgroundImage: "url('/images/jnu_hero_bg.png')" }}
        />
        {/* Softened Cinematic Vignette & Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-1" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_90%)] z-1" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12 py-20">
        
        {/* LEFT CONTENT: THE NARRATIVE */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          
          {/* INSTITUTIONAL BADGE with SHINY TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <Badge variant="secondary" className="px-5 py-2 rounded-full bg-black/40 backdrop-blur-xl border-accent/20 shadow-sm">
              <GraduationCap className="size-4 mr-2 text-accent" />
              <ShinyText 
                text="Institutional Reciprocity Protocol" 
                disabled={false} 
                speed={3} 
                className="font-bold uppercase tracking-widest text-[10px]"
                color="rgba(255,5,5,0.4)"
                shineColor="rgba(255,255,255,1)"
              />
            </Badge>
          </motion.div>

          {/* CORE NARRATIVE with DECRYPTED TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="space-y-6 mb-12"
          >
            <h1 className="text-6xl md:text-9xl font-black leading-[0.85] tracking-tighter text-white uppercase drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              Beyond <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent/80 to-accent/40 italic">
                <DecryptedText 
                  text="Currency." 
                  revealDirection="center"
                  speed={80}
                />
              </span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl font-medium text-stone-300 leading-relaxed drop-shadow-md">
              The premier scholarly exchange network for the JNU ecosystem. <br className="hidden md:block" /> 
              Swap skills, resources, and knowledge with zero monetary friction.
            </p>
          </motion.div>

          {/* CALL TO ACTIONS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >

            <Button 
              variant="outline" 
              size="lg"
              onClick={scrollToMarket}
              className="rounded-full h-16 px-8 text-[11px] font-black uppercase tracking-widest border-transparent bg-white text-stone-900 hover:bg-stone-100 shadow-xl transition-all group"
            >
              Enter Registry
              <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform text-stone-900" />
            </Button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-yellow-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <Button 
                variant="outline" 
                size="lg"
                onClick={onSignIn}
                className="relative rounded-full h-16 px-8 text-[11px] font-black uppercase tracking-widest border-white/20 bg-black/40 backdrop-blur-xl text-white hover:bg-black/60 shadow-2xl transition-all flex items-center gap-3 overflow-hidden"
              >
                <ShinyText 
                  text="Start Barter" 
                  disabled={false} 
                  speed={3} 
                  className="font-black uppercase tracking-widest text-[11px]"
                  color="rgba(255,255,255,0.5)"
                  shineColor="rgba(255,255,255,1)"
                />
                <Zap className="size-4 group-hover:scale-125 transition-transform text-accent" />
              </Button>
            </motion.div>
          </motion.div>


          {/* STATS with COUNTUP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-20 grid grid-cols-2 gap-x-12 gap-y-8 border-t pt-10 w-full max-w-md border-white/10"
          >
            {[
              { label: "Verified Nodes", value: stats.verifiedNodes, suffix: "", icon: Globe },
              { label: "Active Swaps", value: stats.activeSwaps, suffix: "", icon: Sparkles },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-stone-400">
                  <stat.icon className="size-3" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{stat.label}</span>
                </div>
                <span className="text-3xl font-black text-white tracking-tighter">
                  <CountUp to={stat.value} duration={3} />
                  {stat.suffix}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT CONTENT: THE INTERACTIVE LANYARD */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "circOut" }}
          className="flex-1 w-full max-w-[600px] h-[600px] hidden lg:block cursor-grab active:cursor-grabbing relative"
        >
          <div className="absolute inset-0 bg-accent/10 blur-[120px] rounded-full" />
          <Lanyard />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 opacity-50">
              Interact with Barter ID
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

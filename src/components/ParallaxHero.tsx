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

export const ParallaxHero = ({ scrollToMarket }: { scrollToMarket: () => void }) => {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12 py-20">
      
      {/* LEFT CONTENT: THE NARRATIVE */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
        
        {/* INSTITUTIONAL BADGE with SHINY TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <Badge variant="secondary" className="px-5 py-2 rounded-full bg-accent/5 border-accent/20 shadow-sm">
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
          <h1 className="text-6xl md:text-9xl font-black leading-[0.85] tracking-tighter text-primary uppercase">
            Beyond <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent/80 to-accent/40 italic">
              <DecryptedText 
                text="Currency." 
                animateOn="view"
                revealDirection="center"
                speed={80}
              />
            </span>
          </h1>
          <p className="max-w-xl text-lg md:text-xl font-medium text-muted-foreground leading-relaxed">
            The premier scholarly exchange network for the JNU ecosystem. 
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
            size="lg" 
            onClick={() => signIn("google")}
            className="rounded-full h-16 px-10 text-[11px] font-black uppercase tracking-widest bg-accent hover:bg-accent/90 text-white shadow-2xl shadow-accent/20"
          >
            Initialize Node
            <Zap className="ml-2 size-4 fill-white" />
          </Button>

          <Button 
            variant="outline" 
            size="lg"
            onClick={scrollToMarket}
            className="rounded-full h-16 px-8 text-[11px] font-black uppercase tracking-widest border-border hover:bg-muted transition-all group"
          >
            Enter Registry
            <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* STATS with COUNTUP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 gap-x-12 gap-y-8 border-t pt-10 w-full max-w-md border-border/30"
        >
          {[
            { label: "Verified Nodes", value: 2400, suffix: "+", icon: Globe },
            { label: "Active Swaps", value: 12800, suffix: "", icon: Sparkles },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <stat.icon className="size-3" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{stat.label}</span>
              </div>
              <span className="text-3xl font-black text-primary tracking-tighter">
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
        <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full" />
        <Lanyard />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground opacity-50">
            Interact with Barter ID
          </p>
        </div>
      </motion.div>

    </div>
  );
};

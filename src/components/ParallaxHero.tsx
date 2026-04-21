"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowRight, Sparkles, Globe, Zap } from "lucide-react";
import { signIn } from "next-auth/react";

export const ParallaxHero = ({ scrollToMarket }: { scrollToMarket: () => void }) => {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-8 flex flex-col items-center text-center">
      
      {/* INSTITUTIONAL BADGE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <Badge variant="secondary" className="px-4 py-1.5 rounded-full flex items-center gap-2 bg-accent/10 border-accent/20 text-accent font-semibold tracking-wide uppercase text-[10px]">
          <GraduationCap className="size-3" />
          Institutional Reciprocity Protocol
        </Badge>
      </motion.div>

      {/* CORE NARRATIVE: BEYOND CURRENCY */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="space-y-4 mb-12"
      >
        <h1 className="text-7xl md:text-[160px] font-black leading-[0.85] tracking-tighter text-primary uppercase">
          Beyond <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent/80 to-accent/40 italic">Currency.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium text-muted-foreground leading-relaxed">
          The premier scholarly exchange network for the JNU ecosystem. <br className="hidden md:block" /> 
          Swap skills, resources, and knowledge with zero monetary friction.
        </p>
      </motion.div>

      {/* CALL TO ACTIONS */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-center gap-6"
      >
        <Button 
          size="lg" 
          onClick={() => signIn("google")}
          className="rounded-full px-12 h-16 text-[11px] font-black uppercase tracking-widest bg-accent hover:bg-accent/90 text-white shadow-2xl shadow-accent/20"
        >
          Initialize Node
          <Zap className="ml-2 size-4 fill-white" />
        </Button>

        <Button 
          variant="outline" 
          size="lg"
          onClick={scrollToMarket}
          className="rounded-full px-10 h-16 text-[11px] font-black uppercase tracking-widest border-border hover:bg-muted transition-all group"
        >
          Enter Registry
          <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* SOCIAL PROOF / METRICS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 border-t pt-12 w-full max-w-4xl border-border/50"
      >
        {[
          { label: "Verified Nodes", value: "2,400+", icon: Globe },
          { label: "Active Swaps", value: "12.8k", icon: Sparkles },
          { label: "Knowledge Yield", value: "∞", icon: Zap },
          { label: "Currency Deficit", value: "0.00", icon: GraduationCap },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center gap-1 group">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <stat.icon className="size-3 group-hover:text-accent transition-colors" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{stat.label}</span>
            </div>
            <span className="text-2xl font-black text-primary">{stat.value}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

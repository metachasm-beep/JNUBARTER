"use client";

import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BarterChain } from "@/lib/barter-engine";

interface ChainCardProps {
  chain: BarterChain;
  index: number;
}

const CHAIN_COLORS = [
  "from-primary/5 to-primary/[0.02]",
  "from-zinc-900/5 to-zinc-900/[0.01]",
  "from-emerald-500/5 to-emerald-500/[0.01]",
];

export function ChainCard({ chain, index }: ChainCardProps) {
  const gradient = CHAIN_COLORS[index % CHAIN_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 180, damping: 20 }}
      whileHover={{ y: -4 }}
      className={`bg-gradient-to-br ${gradient} rounded-[2.5rem] border border-zinc-100 p-8 space-y-8 group cursor-pointer transition-shadow hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.08)]`}
    >
      {/* Chain header */}
      <div className="flex items-center justify-between">
        <Badge className="bg-primary/8 text-primary border-none rounded-full px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.35em]">
          Triangular Chain
        </Badge>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="h-6 w-6 rounded-full border border-dashed border-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Zap className="h-3 w-3 text-primary/40" />
        </motion.div>
      </div>

      {/* User flow — A → B → C → A */}
      <div className="flex items-center gap-2 flex-wrap">
        {chain.users.map((user, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2 border border-zinc-100 shadow-sm">
              <div className="h-6 w-6 rounded-xl bg-primary/5 flex items-center justify-center">
                <GraduationCap className="h-3 w-3 text-primary/60" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight text-zinc-700">
                {user.name}
              </span>
            </div>
            <ArrowRight className="h-3 w-3 text-zinc-200 flex-shrink-0" />
          </div>
        ))}
        {/* Loop back to first user */}
        <div className="flex items-center gap-2 bg-primary/5 rounded-2xl px-4 py-2 border border-primary/10">
          <div className="h-6 w-6 rounded-xl bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-3 w-3 text-primary" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tight text-primary">
            {chain.users[0].name}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-100" />

      {/* Exchange items */}
      <div className="space-y-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-300">
          Exchange chain
        </p>
        <div className="space-y-2">
          {chain.listings.map((listing, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-zinc-50"
            >
              <span className="text-[9px] font-black text-zinc-400 uppercase w-4 flex-shrink-0">
                {i + 1}.
              </span>
              <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-600 leading-tight">
                {listing.title}
              </span>
              {i < chain.listings.length - 1 && (
                <ArrowRight className="h-2.5 w-2.5 text-zinc-200 ml-auto flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      {chain.tags && chain.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chain.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[8px] font-bold uppercase tracking-wide text-zinc-300 bg-zinc-50 rounded-lg px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/** Shown while chains are loading */
export function ChainSkeleton() {
  return (
    <div className="rounded-[2.5rem] border border-zinc-100 bg-zinc-50/50 p-8 space-y-6 animate-pulse">
      <div className="h-5 w-32 bg-zinc-100 rounded-full" />
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-28 bg-zinc-100 rounded-2xl" />
        ))}
      </div>
      <div className="h-px bg-zinc-100" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-zinc-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

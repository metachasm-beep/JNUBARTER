"use client";

import { motion } from "framer-motion";
import { Activity, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_FLUX = [
  { id: 1, type: "LISTING", user: "Arya S.", action: "listed", item: "Quantum Mechanics Tutoring", time: "2m ago" },
  { id: 2, type: "SWAP", user: "Ishaan K.", action: "exchanged", item: "Calculus Notes", time: "15m ago" },
  { id: 3, type: "VOUCH", user: "Sneha R.", action: "vouched for", item: "Aditya P.", time: "45m ago" },
  { id: 4, type: "LISTING", user: "Rahul M.", action: "listed", item: "Scientific Calculator", time: "1h ago" },
];

export function FluxFeed() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-accent" />
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-primary">Live Flux Feed</h2>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-500 border-none animate-pulse">Live Sync</Badge>
      </div>

      <div className="grid gap-4">
        {MOCK_FLUX.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-[2rem] border-stone-100 flex items-center justify-between group hover:border-accent/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-stone-50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-600">
                  <span className="font-black text-primary uppercase">{event.user}</span> {event.action}{" "}
                  <span className="italic font-bold text-accent">"{event.item}"</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-stone-300" />
                  <span className="text-[10px] font-mono font-bold text-stone-300 uppercase">{event.time}</span>
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-stone-200 group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

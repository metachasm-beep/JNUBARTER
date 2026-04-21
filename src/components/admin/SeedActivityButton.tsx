"use client";

import { Zap } from "lucide-react";
import { toast } from "sonner";

export function SeedActivityButton() {
  const handleSeed = async () => {
    try {
      const res = await fetch("/api/admin/seed-activity", { method: "POST" });
      if (res.ok) {
        toast.success("ACTIVITY SEEDED", {
          description: "50 Users and 50 Listings have been added to the platform.",
          duration: 5000,
        });
      } else {
        const data = await res.json();
        toast.error("Seeding Failed", {
          description: data.error || "Check server logs for details.",
        });
      }
    } catch (error) {
      toast.error("Network Error", {
        description: "Failed to reach the seeding endpoint.",
      });
    }
  };

  return (
    <button 
      onClick={handleSeed}
      className="glass-card px-6 py-4 rounded-3xl border-stone-200 bg-accent/10 hover:bg-accent/20 transition-all flex items-center gap-3 group"
    >
      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white">
        <Zap className="h-4 w-4 group-hover:animate-bounce" />
      </div>
      <div className="text-left">
        <p className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest leading-none">Developer Tool</p>
        <h4 className="text-sm font-black text-primary uppercase italic">Seed Activity</h4>
      </div>
    </button>
  );
}

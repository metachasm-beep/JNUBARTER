"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function ReconcileButton() {
  const [loading, setLoading] = useState(false);

  const handleReconcile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reconcile", { method: "POST" });
      if (res.ok) {
        toast.success("Reconciliation job started successfully", {
          description: "Neo4j is being synchronized in the background.",
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
        });
      } else {
        throw new Error("Failed to start job");
      }
    } catch (error) {
      toast.error("Failed to start reconciliation", {
        description: "Check server logs for details.",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card border-stone-200 rounded-[3rem] p-10 space-y-6 bg-white shadow-xl shadow-stone-200/20 border-t-white">
      <RefreshCw className={`h-6 w-6 text-stone-300 ${loading ? 'animate-spin text-primary' : ''}`} />
      <h3 className="text-xl font-black uppercase italic text-primary">Graph Integrity</h3>
      <p className="text-stone-400 text-xs font-medium">Force a full reconciliation between Prisma and Neo4j to fix any data drift.</p>
      
      <div className="tooltip-container tooltip-top w-full">
        <button 
          onClick={handleReconcile}
          disabled={loading}
          className="w-full h-12 rounded-2xl border border-stone-200 text-stone-400 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Syncing..." : "Reconcile Graph"}
        </button>
        <div className="tooltip-content">Sync Postgres ↔ Neo4j</div>
      </div>
    </div>
  );
}

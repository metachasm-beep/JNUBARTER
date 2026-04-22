"use client";

import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, History, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface AuditLog {
  id: string;
  action: string;
  metadata: any;
  createdAt: string;
}

export function ReputationAudit() {
  const { data, isLoading } = useQuery<{ logs: AuditLog[] }>({
    queryKey: ["user-audit-logs"],
    queryFn: async () => {
      const res = await fetch("/api/user/audit-logs");
      if (!res.ok) throw new Error("Failed to fetch logs");
      return res.json();
    },
  });

  const logs = data?.logs.filter(l => l.action === "REPUTATION_CHANGE") ?? [];

  if (isLoading) return <div className="h-48 animate-pulse bg-stone-50 rounded-3xl" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black uppercase tracking-tighter italic text-primary flex items-center gap-3">
          <History className="h-5 w-5 text-accent" />
          Scholarly Evidence
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
          <TrendingUp className="h-3 w-3" />
          Net Positive
        </div>
      </div>

      <div className="space-y-3">
        {logs.length > 0 ? (
          logs.map((log, i) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 glass-card rounded-2xl border-stone-100 hover:border-accent/10 transition-all group"
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white font-black text-sm ${log.metadata.delta > 0 ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-red-500 shadow-lg shadow-red-500/20'}`}>
                {log.metadata.delta > 0 ? `+${log.metadata.delta}` : log.metadata.delta}
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-black uppercase tracking-tight text-primary">
                  {log.metadata.reason?.replace(/_/g, ' ') ?? "Ecosystem Activity"}
                </p>
                <p className="text-[10px] text-stone-400 font-medium">
                  {log.metadata.swapId ? `Swap Reference: ${log.metadata.swapId.slice(0, 8)}` : "Verified identity event"}
                </p>
              </div>
              <span className="text-[9px] font-mono font-bold text-stone-300 uppercase">
                {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
              </span>
            </motion.div>
          ))
        ) : (
          <div className="py-12 text-center space-y-3 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-100">
             <AlertCircle className="h-8 w-8 text-stone-200 mx-auto" />
             <p className="text-[10px] font-black uppercase tracking-widest text-stone-300">No reputation events logged yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

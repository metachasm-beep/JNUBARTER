"use client";

import { CheckCircle2, Circle, MapPin, Handshake, ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface PlaybookStep {
  id: string;
  label: string;
  desc: string;
  isCompleted: boolean;
  isActive: boolean;
}

export function SwapPlaybook({ status }: { status: string }) {
  const steps: PlaybookStep[] = [
    {
      id: "PROPOSE",
      label: "Manifesto Agreement",
      desc: "Both parties must agree to terms without monetary exchange.",
      isCompleted: status === "ACCEPTED" || status === "EXECUTED",
      isActive: status === "PROPOSED" || status === "COUNTERED",
    },
    {
      id: "LOCATION",
      label: "Node Synchronization",
      desc: "Select a physical JNU meeting point (Hostel/Library).",
      isCompleted: status === "EXECUTED",
      isActive: status === "ACCEPTED",
    },
    {
      id: "EXECUTE",
      label: "Protocol Execution",
      desc: "Physical handover and secure verification code swap.",
      isCompleted: status === "EXECUTED",
      isActive: status === "ACCEPTED",
    }
  ];

  return (
    <div className="p-6 glass-card rounded-[2rem] border-white/5 bg-white/5 backdrop-blur-xl h-full flex flex-col gap-6">
      <div className="space-y-1">
        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          Exchange Playbook
        </h3>
        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight">
          Systematic Swap Protocol v1.0
        </p>
      </div>

      <div className="flex-1 space-y-6 relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-white/5" />
        
        {steps.map((step, i) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative flex items-start gap-4 transition-all ${step.isActive ? 'scale-[1.02]' : 'opacity-50'}`}
          >
            <div className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center transition-all ${
              step.isCompleted ? 'bg-emerald-500 text-black' : 
              step.isActive ? 'bg-white text-black animate-pulse shadow-lg shadow-white/20' : 'bg-white/5 text-zinc-700'
            }`}>
              {step.isCompleted ? <CheckCircle2 className="h-4 w-4" /> : 
               i === 1 ? <MapPin className="h-4 w-4" /> : 
               i === 2 ? <Handshake className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            </div>

            <div className="flex-1">
              <h4 className={`text-[11px] font-black uppercase tracking-tight ${step.isActive ? 'text-white' : 'text-zinc-500'}`}>
                {step.label}
              </h4>
              <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mt-1">
                {step.desc}
              </p>
              {step.isActive && (
                <div className="mt-3 py-1 px-2 bg-white/5 border border-white/10 rounded-lg w-fit flex items-center gap-2">
                   <div className="h-1 w-1 rounded-full bg-emerald-500 animate-ping" />
                   <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Active Phase</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
        <div className="flex items-center gap-2 text-zinc-400">
           <AlertCircle className="h-3 w-3" />
           <span className="text-[9px] font-bold uppercase tracking-tight">Zero-Money Guard</span>
        </div>
        <p className="text-[9px] text-zinc-500 font-medium leading-tight">
          If your peer requests cash or digital payments, report the node immediately to maintain network integrity.
        </p>
      </div>
    </div>
  );
}

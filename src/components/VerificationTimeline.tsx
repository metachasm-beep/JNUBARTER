"use client";

import { useVerification } from "@/hooks/useVerification";
import { CheckCircle2, Circle, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function VerificationTimeline() {
  const { data: verifyData, isLoading } = useVerification();
  
  if (isLoading) return <div className="h-32 animate-pulse bg-stone-50 rounded-3xl" />;

  const status = verifyData?.status ?? "UNVERIFIED";
  
  const steps = [
    { 
      id: "UPLOAD", 
      label: "ID Upload", 
      desc: "Scholarly credentials submitted.", 
      completed: !!verifyData?.status, 
      active: status === "UNVERIFIED" 
    },
    { 
      id: "REVIEW", 
      label: "Admin Review", 
      desc: "Protocol authority verifying node.", 
      completed: status === "VERIFIED" || status === "REJECTED", 
      active: status === "PENDING_REVIEW" 
    },
    { 
      id: "VERIFIED", 
      label: "Node Verified", 
      desc: "Full network reciprocity enabled.", 
      completed: status === "VERIFIED", 
      active: status === "VERIFIED",
      isLast: true 
    }
  ];

  return (
    <div className="glass-card p-8 rounded-[2.5rem] border-stone-100 bg-white/40 space-y-6">
      <h3 className="text-lg font-black uppercase tracking-tighter italic text-primary flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-accent" />
        Verification Lifecycle
      </h3>

      <div className="relative space-y-8">
        {/* Connection Line */}
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-stone-100" />

        {steps.map((step, i) => (
          <div key={step.id} className="relative flex items-start gap-6 group">
            <div className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center transition-all ${
              step.completed ? 'bg-primary text-white shadow-lg shadow-primary/20' : 
              step.active ? 'bg-accent text-primary animate-pulse' : 'bg-stone-100 text-stone-300'
            }`}>
              {step.completed ? <CheckCircle2 className="h-5 w-5" /> : 
               step.active ? <Clock className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
            </div>
            
            <div className="flex-1">
              <h4 className={`text-[12px] font-black uppercase tracking-tight transition-colors ${
                step.active ? 'text-primary' : step.completed ? 'text-stone-700' : 'text-stone-300'
              }`}>
                {step.label}
              </h4>
              <p className="text-[10px] text-stone-400 font-medium leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {status === "REJECTED" && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600">
           <AlertCircle className="h-5 w-5 shrink-0" />
           <p className="text-[10px] font-bold uppercase tracking-tight">Credentials rejected. Please re-upload a clear photo of your JNU ID.</p>
        </div>
      )}
    </div>
  );
}

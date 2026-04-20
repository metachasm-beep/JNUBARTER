"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, ShieldCheck, Repeat, GraduationCap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const features = [
    {
      icon: <GraduationCap className="h-6 w-6 text-accent" />,
      title: "Academic Reciprocity",
      description: "A pure peer-to-peer network for students to swap skills and resources. No cash, no credit—just merit-based exchange."
    },
    {
      icon: <Repeat className="h-6 w-6 text-accent" />,
      title: "Triangular Trade",
      description: "Our 'Godmode' engine finds 3-way loops when direct swaps aren't possible. You give to A, A gives to B, and B gives to you."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-accent" />,
      title: "Zero-Money Policy",
      description: "Built-in guards strictly prevent monetary transactions, ensuring the community remains a space for mutual academic growth."
    },
    {
      icon: <Globe className="h-6 w-6 text-accent" />,
      title: "Institutional Trust",
      description: "Verify your official campus identity to unlock full participation. Reputation scores ensure safety and integrity."
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden pointer-events-auto border border-white/20"
            >
              {/* Header */}
              <div className="relative h-48 bg-stone-900 flex flex-col items-center justify-center text-center p-8 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/40 via-transparent to-transparent" />
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all z-10"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="relative z-10 space-y-2">
                    <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">How BARTER Works</h2>
                    <p className="text-stone-400 font-mono text-[10px] uppercase tracking-[0.3em]">The Scholarly Reciprocity Protocol</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-10 md:p-12 space-y-10 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {features.map((feature, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="space-y-3"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-stone-50 flex items-center justify-center border border-stone-100">
                        {feature.icon}
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-tight text-primary">{feature.title}</h4>
                      <p className="text-xs text-secondary leading-relaxed font-medium">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-6 border-t border-stone-100">
                    <div className="bg-stone-50 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">
                        <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <Zap className="h-8 w-8 text-accent fill-accent" />
                        </div>
                        <div className="space-y-1 text-center md:text-left">
                            <h5 className="text-xs font-black uppercase tracking-widest text-primary">Ready to contribute?</h5>
                            <p className="text-[11px] text-secondary font-medium leading-tight">
                                Join thousands of peers already swapping knowledge. Your first offer builds your reputation in the network.
                            </p>
                        </div>
                        <Button 
                            onClick={onClose}
                            className="w-full md:w-auto btn-premium h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                        >
                            Got it, let's go
                        </Button>
                    </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

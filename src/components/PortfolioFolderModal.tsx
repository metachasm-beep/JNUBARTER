"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ShieldCheck, Users, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PortfolioFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

const Noise = () => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationId: number;
    const canvasSize = 256;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 15; // alpha
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      drawGrain();
      animationId = window.requestAnimationFrame(loop);
    };

    loop();
    return () => window.cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={grainRef}
      className="pointer-events-none absolute inset-0 w-full h-full opacity-40 mix-blend-overlay"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

const STATS_DATA = [
  { id: "Reciprocity Threads", icon: Zap, color: "#CA8A04", label: "Reciprocity Threads", value: "3", desc: "Active peer-to-peer exchange chains currently linked to your scholarly profile." },
  { id: "Contribution Index", icon: ShieldCheck, color: "#3B82F6", label: "Contribution Index", value: "450", desc: "A comprehensive score reflecting your total value added to the JNU academic ecosystem." },
  { id: "Network Reach", icon: Users, color: "#A855F7", label: "Network Reach", value: "Top 5%", desc: "Percentage of the academic network accessible through your direct and secondary connections." },
  { id: "Efficiency Quotient", icon: Target, color: "#10B981", label: "Efficiency Quotient", value: "98%", desc: "Historical success rate of your initiated and fulfilled reciprocity agreements." },
];

export function PortfolioFolderModal({ isOpen, onClose, initialTab }: PortfolioFolderModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab || STATS_DATA[0].id);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const activeStat = STATS_DATA.find(s => s.id === activeTab) || STATS_DATA[0];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-stone-900/40 backdrop-blur-md" />
        <DialogContent className="max-w-4xl bg-transparent border-none shadow-none ring-0 p-0 sm:max-w-4xl overflow-visible">
          <div className="relative w-full aspect-[4/3] max-h-[80vh] flex items-center justify-center">
            
            {/* SKEUOMORPHIC FOLDER CONTAINER */}
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full h-full group"
            >
              {/* Folder Back Component */}
              <div 
                className="absolute inset-0 rounded-[2.5rem] shadow-2xl transition-all duration-500"
                style={{ 
                  backgroundColor: "#E7E5E4", // Manila-ish color
                  border: "2px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 20px 50px -12px rgba(0,0,0,0.3)"
                }}
              >
                {/* Folder Tab */}
                <div 
                  className="absolute bottom-full left-12 w-48 h-12 rounded-t-[1.5rem] border-t-2 border-l-2 border-r-2 border-transparent"
                  style={{ backgroundColor: "#E7E5E4" }}
                >
                  <div className="flex items-center justify-center h-full px-4">
                     <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Scholarly Portfolio</span>
                  </div>
                </div>
                
                <Noise />
              </div>

              {/* CONTENTS (THE "PAPERS") */}
              <div className="absolute inset-8 flex gap-8">
                
                {/* LEFT: TAB NAVIGATION (FOLDER DIVIDERS) */}
                <div className="hidden md:flex w-1/3 flex-col gap-3 pt-12">
                   {STATS_DATA.map((stat) => (
                     <button
                        key={stat.id}
                        onClick={() => setActiveTab(stat.id)}
                        className={cn(
                          "relative px-6 py-4 rounded-xl text-left transition-all duration-300 group/btn overflow-hidden",
                          activeTab === stat.id 
                            ? "bg-white shadow-lg -translate-x-2 border-l-4" 
                            : "bg-stone-200/50 hover:bg-stone-200"
                        )}
                        style={{ borderLeftColor: activeTab === stat.id ? stat.color : "transparent" }}
                     >
                        <div className="relative z-10 flex items-center gap-3">
                           <stat.icon 
                             className={cn("h-4 w-4", activeTab === stat.id ? "" : "text-stone-400")} 
                             style={{ color: activeTab === stat.id ? stat.color : undefined }} 
                           />
                           <span className={cn(
                             "text-[10px] font-black uppercase tracking-tight",
                             activeTab === stat.id ? "text-primary" : "text-stone-500"
                           )}>{stat.label}</span>
                        </div>
                        {activeTab === stat.id && <Noise />}
                     </button>
                   ))}
                </div>

                {/* MOBILE TAB NAV (Bottom) */}
                <div className="md:hidden absolute bottom-4 left-4 right-4 flex justify-around bg-stone-200/80 backdrop-blur rounded-2xl p-2 z-[70]">
                   {STATS_DATA.map((stat) => (
                     <button
                        key={stat.id}
                        onClick={() => setActiveTab(stat.id)}
                        className={cn(
                          "p-3 rounded-xl transition-all",
                          activeTab === stat.id ? "bg-white shadow-md scale-110" : "text-stone-400"
                        )}
                     >
                        <stat.icon className="h-5 w-5" style={{ color: activeTab === stat.id ? stat.color : undefined }} />
                     </button>
                   ))}
                </div>

                {/* RIGHT: ACTIVE PAPER CONTENT */}
                <div className="flex-1 relative pt-4 pb-20 md:pb-0">
                   <AnimatePresence mode="wait">
                     <motion.div
                       key={activeTab}
                       initial={{ x: 20, opacity: 0 }}
                       animate={{ x: 0, opacity: 1 }}
                       exit={{ x: -20, opacity: 0 }}
                       className="absolute inset-0 bg-white rounded-3xl p-10 shadow-inner flex flex-col overflow-hidden"
                       style={{ 
                         backgroundImage: "radial-gradient(circle at 2px 2px, #f0f0f0 1px, transparent 0)",
                         backgroundSize: "24px 24px"
                       }}
                     >
                        <Noise />
                        
                        <div className="relative z-10 flex-1 flex flex-col justify-center text-center space-y-8">
                           <div className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-xl" style={{ backgroundColor: `${activeStat.color}10` }}>
                              <activeStat.icon className="h-10 w-10" style={{ color: activeStat.color }} />
                           </div>
                           
                           <div>
                             <h2 className="text-5xl font-black text-primary tracking-tighter uppercase italic">{activeStat.value}</h2>
                             <p className="text-[10px] font-mono font-bold text-stone-600 uppercase tracking-[0.3em] mt-2">{activeStat.label}</p>
                           </div>

                           <div className="max-w-xs mx-auto">
                              <p className="text-sm text-stone-700 font-medium leading-relaxed italic">
                                "{activeStat.desc}"
                              </p>
                           </div>

                           <div className="pt-8">
                              <div className="inline-block px-4 py-1 rounded-full border-2 border-stone-100 text-[9px] font-black uppercase tracking-widest text-stone-400">
                                Protocol Verified
                              </div>
                           </div>
                        </div>
                     </motion.div>
                   </AnimatePresence>
                </div>

              </div>

              {/* Close Button - Skeuomorphic "Red Wax Seal" or Pin style */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-stone-800 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl z-[60]"
              >
                <X className="h-5 w-5" />
              </button>

            </motion.div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

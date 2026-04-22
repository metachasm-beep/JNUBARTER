"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowButton(false);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowButton(false);
    }
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[10000]">
      <div className="tooltip-container tooltip-left">
        <motion.button
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleInstall}
          className="h-14 w-14 rounded-full glass-card border-accent/20 flex items-center justify-center shadow-2xl shadow-accent/20 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors" />
          <Download className="h-6 w-6 text-accent group-hover:scale-110 transition-transform" />
        </motion.button>
        
        <div 
          className="tooltip-content !bg-white/95 !text-black !font-black !border !border-stone-200"
          style={{ right: '125%', left: 'auto' }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] tracking-tighter">INSTALL BARTER PROTOCOL</span>
            <span className="text-[8px] font-mono text-stone-500 opacity-70">OFFLINE ACCESS · MOBILE OPTIMIZED</span>
          </div>
        </div>
      </div>
      
      {/* Small X to dismiss */}
      <button 
        onClick={() => setShowButton(false)}
        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 hover:text-rose-500 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

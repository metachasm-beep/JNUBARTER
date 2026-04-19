"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "./ui/button";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-32 right-6 z-[10000]">
      <Button 
        onClick={handleInstall}
        className="h-14 w-14 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 hover:scale-110 transition-transform flex items-center justify-center p-0 border-none"
      >
        <Download className="h-6 w-6" />
      </Button>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Download, Bell, BellOff, CheckCircle2, QrCode, X } from "lucide-react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Step = "install" | "push" | "done";

async function subscribeToPush(): Promise<boolean> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return false;
  }

  try {
    const res = await fetch("/api/push/subscribe");
    if (!res.ok) return false;
    const { publicKey } = await res.json();
    if (!publicKey) return false;

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey) as any,
    });

    const json = sub.toJSON();
    const saveRes = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: sub.endpoint,
        p256dh: json.keys?.p256dh ?? "",
        auth: json.keys?.auth ?? "",
      }),
    });

    return saveRes.ok;
  } catch (err) {
    console.error("[push] subscribe failed:", err);
    return false;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}

export function InstallPWA() {
  const { data: session } = useSession();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [step, setStep] = useState<Step | null>(null);
  const [isPushPending, setIsPushPending] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setStep("install");
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "accepted") {
      if (session?.user) {
        setStep("push");
      } else {
        setStep("done");
        setTimeout(() => setStep(null), 3000);
      }
    } else {
      setStep(null);
    }
  };

  const handlePushOptIn = async () => {
    setIsPushPending(true);
    const ok = await subscribeToPush();
    setIsPushPending(false);
    if (ok) {
      toast.success("SWAP MATCH ALERTS ACTIVATED");
      setStep("done");
    } else {
      toast.error("Push notifications unavailable on this device");
      setStep(null);
    }
    setTimeout(() => setStep(null), 3000);
  };

  if (!step) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed inset-x-0 bottom-0 z-[10000] p-4 flex justify-center"
      >
        <div className="w-full max-w-sm glass-card border-iridescent rounded-t-[2.5rem] rounded-b-3xl p-8 shadow-[0_-20px_80px_-20px_rgba(202,138,4,0.15)] flex flex-col gap-6 relative">
          <button onClick={() => setStep(null)} className="absolute top-6 right-6 text-stone-300 hover:text-primary">
            <X className="h-5 w-5" />
          </button>

          {step === "install" && (
            <>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-3xl btn-premium flex items-center justify-center shadow-2xl shadow-accent/20">
                  <Download className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-sans font-extrabold uppercase tracking-tighter text-primary">Install Barter</h3>
                  <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest mt-1">Works offline · No installation required</p>
                </div>
              </div>
              
              <div className="bg-stone-50/50 rounded-2xl p-4 flex items-center gap-4 border border-stone-100">
                <QrCode className="h-10 w-10 text-accent opacity-50" />
                <p className="text-[10px] font-medium text-secondary leading-relaxed uppercase tracking-tight">
                  Scan this on your desktop to take your scholarly exchange mobile instantly.
                </p>
              </div>

              <Button
                onClick={handleInstall}
                className="w-full h-16 rounded-3xl btn-premium text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/20"
              >
                Add to Home Screen
              </Button>
            </>
          )}

          {step === "push" && (
            <>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-sans font-extrabold uppercase tracking-tighter text-primary">Node Pulse</h3>
                  <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest mt-1">Get real-time exchange notifications</p>
                </div>
              </div>
              
              <p className="text-[11px] text-center text-secondary leading-relaxed px-4">
                Receive instant alerts when a scholarly peer vouches for you or matches your academic needs.
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handlePushOptIn}
                  disabled={isPushPending}
                  className="w-full h-16 rounded-3xl btn-premium text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/20"
                >
                  {isPushPending ? "Syncing..." : "Enable Notifications"}
                </Button>
                <button
                  onClick={() => setStep(null)}
                  className="w-full text-[10px] text-stone-300 font-bold uppercase tracking-widest hover:text-accent transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </>
          )}

          {step === "done" && (
            <div className="flex flex-col items-center py-10 gap-4">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-bounce" />
              <div className="text-center">
                <h3 className="text-xl font-sans font-extrabold uppercase tracking-tighter text-primary">Node Synchronized</h3>
                <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest mt-1">You are now part of the registry</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

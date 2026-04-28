"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { LogIn, ShieldCheck, Zap, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-none bg-stone-950 text-white p-0 overflow-hidden shadow-2xl" data-slot="signin-modal">
        <div className="relative p-10 pt-14 flex flex-col items-center text-center">
          {/* Background effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-accent/10 blur-[120px] rounded-full" />
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-10 w-full"
          >
            {/* PULSING ICON CONTAINER */}
            <div className="relative mb-8 mx-auto w-fit">
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse" />
              <div className="relative h-20 w-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-inner backdrop-blur-md">
                <GraduationCap className="h-10 w-10 text-accent" />
              </div>
            </div>
            
            <DialogHeader className="mb-10 space-y-4">
              <div className="flex justify-center">
                <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[8px] font-mono font-black text-accent uppercase tracking-[0.2em]">
                  Secure Protocol Access
                </span>
              </div>
              <DialogTitle className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                Initialize <span className="text-accent underline decoration-accent/20 underline-offset-8">Node</span>
              </DialogTitle>
              <DialogDescription className="text-stone-400 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
                Authorized access to the JNU scholarly exchange network. Authentication required.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 w-full">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-yellow-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <Button 
                  onClick={handleGoogleSignIn}
                  className="relative w-full h-14 rounded-xl bg-white text-black hover:bg-stone-100 font-bold uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-3 transition-all shadow-xl"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Connect with Google
                </Button>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-8 border-t border-white/5">
                <div className="flex flex-col items-center gap-2">
                  <ShieldCheck className="size-4 text-accent/60" />
                  <span className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-stone-500">End-to-End</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Zap className="size-4 text-accent/60" />
                  <span className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-stone-500">Instant Sync</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-12 w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] flex-1 bg-white/5" />
              <span className="text-[7px] font-mono font-black text-stone-600 tracking-[0.4em] uppercase">Security Audit v4.0</span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>
            <p className="text-[8px] font-medium text-stone-500 uppercase tracking-[0.3em] leading-loose">
              Authorized Institutional <br /> Access Only
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

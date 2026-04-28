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
      <DialogContent className="sm:max-w-[425px] border-none bg-stone-950 text-white p-0 overflow-hidden shadow-2xl">
        <div className="relative p-8 pt-12 flex flex-col items-center text-center">
          {/* Background effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/20 blur-[100px] rounded-full" />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10"
          >
            <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6 mx-auto">
              <GraduationCap className="h-8 w-8 text-accent" />
            </div>
            
            <DialogHeader className="mb-8">
              <DialogTitle className="text-3xl font-black uppercase tracking-tighter mb-2 italic">
                Initialize <span className="text-accent">Node</span>
              </DialogTitle>
              <DialogDescription className="text-stone-400 font-medium">
                Access the JNU scholarly exchange protocol. <br />
                Authentication via @jnu.ac.in required.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 w-full">
              <Button 
                onClick={handleGoogleSignIn}
                className="w-full h-14 rounded-xl bg-white text-black hover:bg-stone-200 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all"
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
                Sign in with Google
              </Button>

              <div className="pt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-stone-500">
                  <ShieldCheck className="size-3 text-accent" />
                  <span className="text-[9px] font-bold uppercase tracking-tight">Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-stone-500">
                  <Zap className="size-3 text-accent" />
                  <span className="text-[9px] font-bold uppercase tracking-tight">Zero Friction</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-8 pt-6 border-t border-white/5 w-full">
            <p className="text-[9px] font-medium text-stone-500 uppercase tracking-[0.2em]">
              Authorized Institutional Access Only
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

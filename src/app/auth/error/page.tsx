"use client";

import { GraduationCap, ShieldX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ERRORS: Record<string, { title: string; body: string }> = {
  "jnu-only": {
    title: "Institutional Access Only",
    body: "JNU BARTER is exclusively available to active students and faculty of Jawaharlal Nehru University. Please sign in with your @jnu.ac.in institutional email address.",
  },
  default: {
    title: "Authentication Error",
    body: "An error occurred during sign-in. Please try again.",
  },
};

function ErrorContent() {
  const params = useSearchParams();
  const reason = params.get("reason") ?? "default";
  const { title, body } = ERRORS[reason] ?? ERRORS.default;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full text-center space-y-10"
      >
        {/* Icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 bg-primary/5 rounded-[2rem] flex items-center justify-center border border-primary/10">
              <GraduationCap className="h-10 w-10 text-primary/40" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-red-50 rounded-xl flex items-center justify-center border border-red-100">
              <ShieldX className="h-4 w-4 text-red-400" />
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
            JNU BARTER // ACCESS DENIED
          </p>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-zinc-800">
            {title}
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed font-medium">
            {body}
          </p>
        </div>

        {/* Mono detail */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
          <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
            Accepted domains: @jnu.ac.in · @mail.jnu.ac.in
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => (window.location.href = "/api/auth/signin")}
            className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
          >
            Sign In with JNU Account
          </Button>
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/")}
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Registry
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}

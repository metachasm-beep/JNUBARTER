"use client";

import { ShieldX, ArrowLeft, Key, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ERRORS: Record<string, { title: string; body: string; detail?: string }> = {
  AccessDenied: {
    title: "Access Denied",
    body: "The security protocol blocked this sign-in attempt. This usually happens if your browser is blocking authentication cookies or if the OAuth configuration is mismatched.",
    detail: "Check: AdBlocker settings, Browser Cookies, or Google Cloud Console 'Authorized Redirect URIs'."
  },
  Verification: {
    title: "Verification Failed",
    body: "The link has expired or has already been used.",
    detail: "Protocol: Token Expired // Action: Request new link."
  },
  OAuthSignin: {
    title: "OAuth Error",
    body: "Failed to construct the authentication request.",
    detail: "Check: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables."
  },
  OAuthCallback: {
    title: "Callback Error",
    body: "There was a problem processing the response from Google.",
    detail: "Check: Authorized Redirect URIs in Google Cloud Console."
  },
  default: {
    title: "Access Restricted",
    body: "An authentication error occurred. Please ensure you are signing in with a valid account and try again.",
  },
};

function ErrorContent() {
  const params = useSearchParams();
  const error = params.get("error") ?? "default";
  const { title, body, detail } = ERRORS[error] ?? ERRORS.default;

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
            <div className="h-20 w-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center border border-primary/10">
              <Key className="h-10 w-10 text-primary/40" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-red-50 rounded-xl flex items-center justify-center border border-red-100">
              <ShieldX className="h-4 w-4 text-red-400" />
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
            BARTER // AUTHENTICATION ERROR
          </p>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-zinc-800">
            {title}
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed font-medium">
            {body}
          </p>
        </div>

        {/* Technical Detail */}
        <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 space-y-4 text-left">
           <div className="flex items-center gap-2">
              <Info className="h-3 w-3 text-primary" />
              <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                Technical Diagnostics
              </p>
           </div>
           <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
              Error Code: <span className="text-primary font-black">{error}</span><br />
              {detail || "Status: Blocked by security policy."}
           </p>
        </div>

        {/* Help Tip */}
        <div className="flex items-center gap-3 justify-center text-zinc-400">
           <HelpCircle className="h-4 w-4" />
           <p className="text-[10px] font-medium italic">Tip: Try disabling AdBlockers or Incognito mode.</p>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => (window.location.href = "/api/auth/signin")}
            className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
          >
            Retry Authentication
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

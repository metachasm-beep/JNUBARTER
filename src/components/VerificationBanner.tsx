"use client";

import { useState } from "react";
import { ShieldAlert, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function VerificationBanner({ user }: { user: any }) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // This banner only shows if the user has an active challenge
  // We determine this by checking if they are not verified and have a pending report
  // For now, we assume the parent passed the correct user state

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Invalid Code", { description: "Please enter the 6-digit code sent to your email." });

    setIsVerifying(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      setIsSuccess(true);
      toast.success("Identity Authenticated", { description: "Your deep verification is complete." });
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: any) {
      toast.error("Verification Error", { description: err.message });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex items-center gap-6 animate-in fade-in zoom-in duration-500">
        <div className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-emerald-900 leading-tight">Authority Established</h3>
          <p className="text-sm text-emerald-700 font-medium">Your node has been authenticated by the JNU Barter Protocol.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xl shadow-amber-200/20">
      <div className="flex items-center gap-6">
        <div className="h-16 w-16 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 animate-pulse">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-amber-900 leading-tight">Verification Challenge</h3>
          <p className="text-sm text-amber-700 font-medium">An admin has initiated a deep verification. Check your JNU email for a 6-digit code.</p>
        </div>
      </div>
      
      <form onSubmit={handleVerify} className="flex gap-3 w-full md:w-auto">
        <input 
          type="text" 
          maxLength={6}
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="h-14 w-32 rounded-2xl bg-white border-none text-center text-xl font-mono font-black tracking-[0.2em] focus:ring-4 focus:ring-amber-200 transition-all shadow-inner"
        />
        <Button 
          disabled={isVerifying || otp.length !== 6}
          className="h-14 px-8 rounded-2xl bg-amber-900 text-white font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-amber-900/20"
        >
          {isVerifying ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify"}
        </Button>
      </form>
    </div>
  );
}

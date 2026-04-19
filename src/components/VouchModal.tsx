"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VouchNotification {
  id: string;
  type: string;
  refId: string; // swapId
  swap: {
    id: string;
    initiatorId: string;
    receiverId: string;
  } | null;
}

export function VouchModal() {
  const { data: session } = useSession();
  const [pending, setPending] = useState<VouchNotification | null>(null);
  const [content, setContent] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const COMMON_SKILLS = [
    "COMMUNICATION", "RELIABILITY", "EXPERTISE",
    "TIMELINESS", "INTEGRITY", "KNOWLEDGE-SHARING",
  ];

  // Poll for unread VOUCH_PROMPT notifications
  useEffect(() => {
    if (!session?.user || isDismissed) return;

    async function checkNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const { notifications } = await res.json();
        const vouch = notifications.find(
          (n: VouchNotification) => n.type === "VOUCH_PROMPT"
        );
        if (vouch) setPending(vouch);
      } catch {
        // silent fail
      }
    }

    checkNotifications();
    const interval = setInterval(checkNotifications, 30_000);
    return () => clearInterval(interval);
  }, [session, isDismissed]);

  const handleDismiss = async () => {
    setIsDismissed(true);
    setPending(null);
    // Mark notification as read
    await fetch("/api/notifications", { method: "PATCH" });
  };

  const handleSubmit = async () => {
    if (!pending?.swap || !content.trim()) return;
    setIsSubmitting(true);

    try {
      const swap = pending.swap;
      const receiverId =
        session!.user.id === swap.initiatorId
          ? swap.receiverId
          : swap.initiatorId;

      const res = await fetch(`/api/swaps/${swap.id}/vouch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId,
          content: content.trim(),
          skillsVouched: selectedSkills,
        }),
      });

      if (!res.ok) throw new Error("Vouch failed");

      toast.success("VOUCH SUBMITTED — REPUTATION LEDGER UPDATED");
      // Mark notification read
      await fetch("/api/notifications", { method: "PATCH" });
      setPending(null);
    } catch {
      toast.error("Failed to submit vouch — try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <AnimatePresence>
      {pending && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/20 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[201] w-full max-w-md px-4"
          >
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] p-8 space-y-8">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary fill-primary/20" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                      Exchange Complete
                    </p>
                  </div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase italic text-zinc-800">
                    Vouch your<br />exchange partner
                  </h2>
                  <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                    A public vouch strengthens the community ledger and boosts their reputation.
                  </p>
                </div>
                <button
                  onClick={handleDismiss}
                  className="h-8 w-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Skill tags */}
              <div className="space-y-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-300">
                  Skills demonstrated
                </p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS.map((skill) => (
                    <Badge
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`cursor-pointer rounded-full px-4 py-1.5 text-[9px] font-bold uppercase transition-all ${
                        selectedSkills.includes(skill)
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                          : "bg-zinc-50 text-zinc-400 border border-zinc-100 hover:border-primary/30 hover:text-primary"
                      }`}
                    >
                      {selectedSkills.includes(skill) && (
                        <CheckCircle2 className="h-2.5 w-2.5 mr-1 inline" />
                      )}
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-300">
                  Public testament
                </p>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe the quality of the exchange — be specific and honest..."
                  className="rounded-2xl border-zinc-100 bg-zinc-50 text-xs min-h-[80px] resize-none"
                  maxLength={500}
                />
                <p className="text-[8px] text-zinc-300 font-mono text-right">
                  {content.length}/500
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting}
                  className="flex-1 h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Submit Vouch"
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDismiss}
                  className="h-14 px-6 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                >
                  Later
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

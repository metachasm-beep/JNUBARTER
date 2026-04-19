"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SwapMessage, SwapMessageSchema } from "@/lib/schemas";
import { toast } from "sonner";

interface SwapState {
  userAConfirmed: boolean;
  userBConfirmed: boolean;
  items: string[];
}

export default function NegotiationChat({
  swapId,
  currentUser,
}: {
  swapId: string;
  currentUser: string;
}) {
  const [messages, setMessages] = useState<SwapMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [swapState, setSwapState] = useState<SwapState>({
    userAConfirmed: false,
    userBConfirmed: false,
    items: ["Technical SEO Audit", "React Component Library"],
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Validated + immutable message append
  const appendMessage = useCallback((msg: unknown) => {
    const result = SwapMessageSchema.safeParse(msg);
    if (!result.success) {
      console.error("Invalid message format", result.error);
      return;
    }
    setMessages((prev) =>
      Object.freeze([...prev, result.data]) as SwapMessage[]
    );
  }, []);

  // ─── Load message history from Postgres on mount ───────────────────────────
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(`/api/swaps/${swapId}/messages`);
        if (!res.ok) throw new Error("Failed to load history");
        const { messages: history } = await res.json();
        // Map DB messages to SwapMessage shape
        const mapped: SwapMessage[] = (history ?? []).map((m: any) => ({
          id: m.id,
          sender: m.senderId,
          text: m.content,
          timestamp: m.createdAt,
          type: "chat",
        }));
        setMessages(Object.freeze(mapped) as SwapMessage[]);
      } catch (err) {
        console.error("[NegotiationChat] history load failed", err);
        toast.error("Could not load message history");
      } finally {
        setIsLoadingHistory(false);
      }
    }

    loadHistory();
  }, [swapId]);

  // ─── Real-time subscription via Supabase broadcast ─────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel(`swap:${swapId}`)
      .on("broadcast", { event: "message" }, (payload) => {
        appendMessage(payload.payload);
      })
      .on("broadcast", { event: "state_update" }, (payload) => {
        setSwapState(payload.payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [swapId, appendMessage]);

  // ─── Auto-scroll to bottom ──────────────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ─── Send: persist to DB first, then broadcast for real-time ───────────────
  const sendMessage = async () => {
    if (!input.trim() || isSending) return;
    setIsSending(true);

    const optimisticMsg: SwapMessage = {
      id: crypto.randomUUID(),
      sender: currentUser,
      text: input.trim(),
      timestamp: new Date().toISOString(),
      type: "chat",
    };

    // Optimistic update
    appendMessage(optimisticMsg);
    const draft = input;
    setInput("");

    try {
      // 1. Persist to Postgres
      const res = await fetch(`/api/swaps/${swapId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft }),
      });

      if (!res.ok) {
        // Roll back optimistic update on failure
        setMessages((prev) =>
          Object.freeze(
            prev.filter((m) => m.id !== optimisticMsg.id)
          ) as SwapMessage[]
        );
        toast.error("Message failed to send");
        setInput(draft); // restore draft
        return;
      }

      // 2. Broadcast to other party via Supabase realtime
      await supabase.channel(`swap:${swapId}`).send({
        type: "broadcast",
        event: "message",
        payload: optimisticMsg,
      });
    } catch {
      toast.error("Network error — message may not have been delivered");
    } finally {
      setIsSending(false);
    }
  };

  const toggleConfirm = async () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([10, 30]);
    }
    const newState = {
      ...swapState,
      userAConfirmed:
        currentUser === "A" ? !swapState.userAConfirmed : swapState.userAConfirmed,
      userBConfirmed:
        currentUser === "B" ? !swapState.userBConfirmed : swapState.userBConfirmed,
    };

    setSwapState(newState);

    await supabase.channel(`swap:${swapId}`).send({
      type: "broadcast",
      event: "state_update",
      payload: newState,
    });

    // Both parties confirmed — execute the swap and trigger vouch prompts
    if (newState.userAConfirmed && newState.userBConfirmed) {
      toast.success("AGREEMENT LOCKED: RECIPROCITY MANIFESTED");
      try {
        await fetch(`/api/swaps/${swapId}/execute`, { method: "PATCH" });
      } catch {
        // Non-blocking — execution can be retried
        console.error("[NegotiationChat] execute endpoint failed");
      }
    }
  };

  return (
    <div className="flex h-[600px] border-4 border-neutral-800 bg-black font-mono">
      {/* Left Side: Chat */}
      <div className="flex-1 flex flex-col border-r-4 border-neutral-800">
        <div className="p-4 border-b-4 border-neutral-800 bg-neutral-900 flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-widest">
            Negotiation Logs
          </h2>
          <Badge
            variant="outline"
            className="text-[8px] animate-pulse border-emerald-500 text-emerald-500"
          >
            LIVE
          </Badge>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
        >
          {isLoadingHistory ? (
            <div className="flex items-center justify-center h-full gap-2 text-zinc-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-[9px] uppercase font-bold tracking-widest">
                Loading Logs...
              </span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">
                No messages yet — initiate negotiation
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === currentUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 text-xs leading-relaxed ${
                    m.sender === currentUser
                      ? "bg-primary text-primary-foreground italic font-bold"
                      : "bg-neutral-800 text-neutral-300"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[8px] opacity-40 mt-1 uppercase">
                  {m.sender} // {new Date(m.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-neutral-900 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && sendMessage()
            }
            placeholder="PROPOSE MODIFICATION..."
            disabled={isSending}
            className="rounded-none border-2 border-neutral-700 bg-black text-xs h-12"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isSending}
            className="rounded-none h-12 w-12 bg-primary"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Right Side: Agreement Card */}
      <div className="w-80 p-6 bg-neutral-900 flex flex-col gap-6">
        <div className="space-y-1">
          <h3 className="text-sm font-black uppercase">Live Agreement</h3>
          <p className="text-[9px] opacity-50 uppercase tracking-tighter">
            Manifesto compliant swap
          </p>
        </div>

        <div className="space-y-3">
          {swapState.items.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-black border-2 border-neutral-800 flex justify-between items-center group"
            >
              <span className="text-[10px] uppercase font-bold">{item}</span>
              <AlertCircle className="h-3 w-3 opacity-0 group-hover:opacity-40 cursor-pointer" />
            </div>
          ))}
          <Button
            variant="ghost"
            className="w-full border-2 border-dashed border-neutral-800 text-[10px] uppercase h-8 hover:bg-white/5"
          >
            + Add Item
          </Button>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex gap-2">
            <div
              className={`flex-1 h-2 ${
                swapState.userAConfirmed ? "bg-emerald-500" : "bg-neutral-800"
              }`}
            />
            <div
              className={`flex-1 h-2 ${
                swapState.userBConfirmed ? "bg-emerald-500" : "bg-neutral-800"
              }`}
            />
          </div>
          <Button
            onClick={toggleConfirm}
            className={`w-full rounded-none h-16 uppercase font-black tracking-widest border-2 ${
              currentUser === "A"
                ? swapState.userAConfirmed
                : swapState.userBConfirmed
              ? "bg-emerald-500 text-white border-emerald-400"
              : "bg-transparent border-primary text-primary hover:bg-primary hover:text-white"
            }`}
          >
            {(currentUser === "A"
              ? swapState.userAConfirmed
              : swapState.userBConfirmed) ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Confirmed
              </span>
            ) : (
              "Click to Confirm"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, CheckCircle2, AlertCircle, Loader2, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SwapMessage, SwapMessageSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    } else if (
      (currentUser === "A" && newState.userAConfirmed) || 
      (currentUser === "B" && newState.userBConfirmed)
    ) {
      toast.info("Waiting for the other party to confirm...");
    }
  };

  const handleAddItem = async () => {
    if (!newItemText.trim()) {
      setIsAddingItem(false);
      return;
    }
    const newItems = [...swapState.items, newItemText.trim()];
    const newState = { ...swapState, items: newItems };
    
    setSwapState(newState);
    await supabase.channel(`swap:${swapId}`).send({
      type: "broadcast",
      event: "state_update",
      payload: newState,
    });
    setNewItemText("");
    setIsAddingItem(false);
  };

  return (
    <div className="flex h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl font-sans">
      {/* Left Side: Chat */}
      <div className="flex-1 flex flex-col border-r border-white/10">
        <div className="p-4 border-b border-white/10 bg-white/10 backdrop-blur-md flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-sm font-semibold text-zinc-100">
              Negotiation Thread
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-widest">
              Live Sync
            </span>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
        >
          {isLoadingHistory ? (
            <div className="flex items-center justify-center h-full gap-2 text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs font-medium">
                Loading history...
              </span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs text-zinc-400 font-medium">
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
                  className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed transition-all shadow-sm ${
                    m.sender === currentUser
                      ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl rounded-tr-sm shadow-emerald-900/20"
                      : "bg-white/5 border border-white/5 text-zinc-200 rounded-2xl rounded-tl-sm backdrop-blur-sm"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-zinc-400 mt-1.5 font-medium">
                  {m.sender === currentUser ? "You" : m.sender} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-black/40 border-t border-white/10 flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && sendMessage()
            }
            placeholder="Propose modification..."
            disabled={isSending}
            className="rounded-xl border border-white/10 bg-white/5 text-sm h-12 text-zinc-200 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-emerald-500/50 transition-all"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isSending}
            className="rounded-xl h-12 w-12 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 transition-all"
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
      <div className="w-80 p-6 bg-gradient-to-b from-white/5 to-transparent flex flex-col gap-6 relative overflow-hidden">
        {/* Subtle grid background for the contract area */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <h3 className="text-base font-semibold text-white tracking-tight">Live Agreement</h3>
          <p className="text-xs text-zinc-400 font-medium">
            Manifesto compliant swap
          </p>
        </div>

        <div className="space-y-3 relative z-10">
          {swapState.items.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex justify-between items-center group hover:bg-white/10 transition-all"
            >
              <span className="text-sm font-medium text-zinc-200">{item}</span>
              <AlertCircle className="h-4 w-4 text-zinc-400 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" />
            </div>
          ))}
          {isAddingItem ? (
            <div className="flex gap-2">
              <Input 
                value={newItemText} 
                onChange={e => setNewItemText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddItem()}
                placeholder="Item name..."
                className="h-10 text-sm rounded-xl bg-black/40 border-white/20 text-white placeholder:text-zinc-500"
                autoFocus
              />
              <Button onClick={handleAddItem} className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md">
                Add
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setIsAddingItem(true)}
              className="w-full rounded-xl border border-dashed border-white/20 text-xs text-zinc-400 hover:text-zinc-200 hover:border-white/40 hover:bg-white/5 transition-all h-10"
            >
              + Add Item
            </Button>
          )}
        </div>

        <div className="mt-auto space-y-4 relative z-10">
          <div className="flex gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
              <div
                className={`h-full transition-all duration-500 ${
                  swapState.userAConfirmed ? "bg-emerald-500 w-full" : "w-0"
                }`}
              />
            </div>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
              <div
                className={`h-full transition-all duration-500 ${
                  swapState.userBConfirmed ? "bg-emerald-500 w-full" : "w-0"
                }`}
              />
            </div>
          </div>
          <Button
            onClick={toggleConfirm}
            className={`w-full rounded-2xl h-14 font-semibold text-sm transition-all duration-300 shadow-lg ${
              currentUser === "A"
                ? swapState.userAConfirmed
                : swapState.userBConfirmed
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/30"
              : "bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {(currentUser === "A"
              ? swapState.userAConfirmed
              : swapState.userBConfirmed) ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Confirmed
              </span>
            ) : (
              "Confirm Agreement"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

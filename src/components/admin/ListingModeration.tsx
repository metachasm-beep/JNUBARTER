"use client";

import { useState, useEffect } from "react";
import { Check, X, Package, Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function ListingModeration() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/listings?status=PENDING");
      const data = await res.json();
      setListings(data.listings || []);
    } catch (err) {
      toast.error("Failed to fetch pending listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(`Listing ${status.toLowerCase()} successfully`);
        setListings((prev) => prev.filter((l) => l.id !== id));
      } else {
        toast.error("Action failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  if (loading && listings.length === 0) {
    return <div className="p-8 text-center animate-pulse text-stone-400 font-mono text-[10px] uppercase">Scanning Peer Registry...</div>;
  }

  return (
    <div className="glass-card border-stone-200 rounded-[3rem] p-10 space-y-8 bg-white/50 backdrop-blur-3xl shadow-2xl shadow-stone-200/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-black uppercase tracking-tight text-primary italic">Registry Moderation</h3>
        </div>
        <Badge className="bg-amber-100 text-amber-600 text-[10px] uppercase tracking-widest">{listings.length} Pending Nodes</Badge>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <motion.div
                key={listing.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-3xl bg-white border border-stone-100 hover:border-primary/20 transition-all gap-6"
              >
                <div className="flex items-start gap-6 flex-1">
                  <div className="h-12 w-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 font-bold shrink-0">
                    {listing.category === "SERVICE" ? <Clock className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-primary uppercase truncate">{listing.title}</p>
                      <Badge variant="outline" className="text-[8px] font-mono border-stone-100 text-stone-400">{listing.type}</Badge>
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1 italic font-medium">"{listing.description}"</p>
                    <div className="flex items-center gap-2 pt-1">
                       <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">{listing.user?.name || 'Unknown User'}</p>
                       <span className="text-stone-200">•</span>
                       <p className="text-[9px] font-mono text-stone-300">{new Date(listing.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <Button
                    onClick={() => handleAction(listing.id, "APPROVED")}
                    size="sm"
                    className="flex-1 md:flex-none h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <Check className="h-3 w-3 mr-2" /> Approve
                  </Button>
                  <Button
                    onClick={() => handleAction(listing.id, "REJECTED")}
                    size="sm"
                    variant="outline"
                    className="flex-1 md:flex-none h-10 px-4 rounded-xl border-stone-100 text-stone-400 hover:text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <X className="h-3 w-3 mr-2" /> Reject
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-stone-100 rounded-[2.5rem]">
               <ShieldAlert className="h-8 w-8 text-stone-200 mx-auto mb-4" />
               <p className="text-[10px] font-mono font-bold text-stone-300 uppercase tracking-widest">Registry is clean. No nodes awaiting review.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

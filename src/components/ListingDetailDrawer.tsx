"use client";

import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription, 
  DrawerFooter,
  DrawerTrigger,
  DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Package, Briefcase, Zap, MessageSquare, ShieldCheck, Clock, Share2, Star, Loader2, AlertCircle } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import { ProfileViewDrawer } from "./ProfileViewDrawer";
import { useSession } from "next-auth/react";

interface ListingDetailDrawerProps {
  listing: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ListingDetailDrawer({ listing, isOpen, onOpenChange }: ListingDetailDrawerProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isActionPending, setIsActionPending] = useState(false);
  
  const listerId = listing.userId || listing.user?.id;
  const isOwnListing = session?.user?.id === listerId;
  
  const isService = listing.category === "SERVICE";
  const isOffer = listing.type === "OFFER";

  const handlePropose = async () => {
    console.log("[ListingDetailDrawer] Propose Swap clicked. Lister ID:", listerId);
    if (!session?.user?.id) {
      console.warn("[ListingDetailDrawer] No session user ID");
      toast.error("Protocol Access Denied: Please sign in to initiate exchange.");
      return;
    }

    if (isOwnListing) {
      console.warn("[ListingDetailDrawer] Attempted to swap with self");
      toast.error("Self-Reciprocity Error: You cannot swap with yourself.");
      return;
    }

    setIsActionPending(true);
    try {
      console.log("[ListingDetailDrawer] Sending POST to /api/swaps");
      const res = await fetch("/api/swaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          receiverId: listerId
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[ListingDetailDrawer] Swap initiation failed:", res.status, errorText);
        throw new Error(errorText);
      }
      
      const swap = await res.json();
      console.log("[ListingDetailDrawer] Swap initiated:", swap.id);
      toast.success("Protocol synchronization established.");
      router.push(`/swap/${swap.id}`);
    } catch (error) {
      console.error("[ListingDetailDrawer] handlePropose error:", error);
      toast.error("Failed to connect with peer node.");
    } finally {
      setIsActionPending(false);
    }
  };

  const handleMessage = async () => {
    console.log("[ListingDetailDrawer] Message Peer clicked. Lister ID:", listerId);
    if (!session?.user?.id) {
      console.warn("[ListingDetailDrawer] No session user ID");
      toast.error("Protocol Access Denied: Please sign in to establish a channel.");
      return;
    }

    if (isOwnListing) {
      console.warn("[ListingDetailDrawer] Attempted to message self");
      toast.error("Self-Communication Error: You cannot message your own node.");
      return;
    }

    setIsActionPending(true);
    try {
      console.log("[ListingDetailDrawer] Sending POST to /api/swaps for message channel");
      const res = await fetch("/api/swaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          receiverId: listerId
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[ListingDetailDrawer] Message channel setup failed:", res.status, errorText);
        throw new Error(errorText);
      }
      
      const swap = await res.json();
      console.log("[ListingDetailDrawer] Message channel setup:", swap.id);
      toast.success("Secure channel initialized.");
      router.push(`/swap/${swap.id}`);
    } catch (error) {
      console.error("[ListingDetailDrawer] handleMessage error:", error);
      toast.error("Failed to establish secure link.");
    } finally {
      setIsActionPending(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background border-stone-200 p-6 h-[85vh]">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-stone-200 mb-8" />
        
        <div className="flex-1 overflow-y-auto px-1 space-y-10 pb-20">
          <DrawerHeader className="p-0">
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <Badge className={`font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border-none ${isOffer ? "bg-accent/10 text-accent" : "bg-stone-200 text-stone-600"}`}>
                      {listing.type} • {listing.category}
                   </Badge>
                   <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-full text-stone-300 hover:text-accent hover:bg-accent/5"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Protocol Link copied.");
                        }}
                      >
                         <Share2 className="h-4 w-4" />
                      </Button>
                      <div className="h-12 w-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center shadow-sm">
                         {isService ? <Briefcase className="h-6 w-6 text-accent" /> : <Package className="h-6 w-6 text-accent" />}
                      </div>
                   </div>
                </div>
                
                <DrawerTitle className="text-3xl md:text-4xl font-sans font-black tracking-tighter uppercase text-primary leading-[0.9]">
                   {listing.title}
                </DrawerTitle>
             </div>
          </DrawerHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-8">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-stone-300">Description</h4>
                   <p className="text-base text-secondary leading-relaxed font-medium">
                      {listing.description}
                   </p>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-stone-300">Registry Metadata</h4>
                   <div className="flex flex-wrap gap-2">
                      {listing.tags?.map((tag: string) => (
                        <Badge key={tag} className="bg-stone-50 text-stone-400 text-[10px] font-mono font-bold uppercase border-stone-100 px-3 py-1">
                           #{tag}
                        </Badge>
                      ))}
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <SpotlightCard className="p-6 glass-card border-accent/20 bg-accent/5 rounded-[2rem]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="cursor-pointer">
                        <ProfileViewDrawer user={listing.user} />
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] font-mono font-bold uppercase text-accent tracking-widest">Protocol Verified Lister</p>
                         <div className="cursor-pointer">
                            <ProfileViewDrawer user={listing.user}>
                               <h5 className="text-lg font-black uppercase text-primary hover:text-accent transition-colors">{listing.user?.name}</h5>
                            </ProfileViewDrawer>
                         </div>
                      </div>
                    </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/50 rounded-2xl border border-white/50">
                         <p className="text-[9px] font-mono font-bold text-stone-400 uppercase">Trust Score</p>
                         <p className="text-xl font-black text-primary">{listing.user?.reputation || 0}</p>
                      </div>
                      <div className="p-3 bg-white/50 rounded-2xl border border-white/50">
                         <p className="text-[9px] font-mono font-bold text-stone-400 uppercase">Status</p>
                         <p className="text-sm font-black text-green-600 uppercase flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> Active
                         </p>
                      </div>
                   </div>
                </SpotlightCard>

                <div className="p-6 border border-stone-100 rounded-[2rem] bg-stone-50/50">
                   <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-4 w-4 text-stone-400" />
                      <span className="text-[10px] font-mono font-bold uppercase text-stone-400 tracking-widest">Listing Timeline</span>
                   </div>
                   <p className="text-xs font-bold text-stone-600">Established 2 days ago in the Peer-to-Peer network.</p>
                </div>
             </div>
          </div>
        </div>

        <DrawerFooter className="px-0 pt-6 border-t border-stone-100">
           <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handlePropose}
                disabled={isActionPending}
                className="h-16 rounded-3xl btn-premium text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-accent/20 flex items-center gap-2"
              >
                 {isActionPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                 Propose Swap
              </Button>
              <Button 
                variant="outline" 
                onClick={handleMessage}
                disabled={isActionPending}
                className="h-16 rounded-3xl border-stone-200 text-stone-500 font-black uppercase tracking-widest text-xs flex items-center gap-2"
              >
                 {isActionPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                 Message Peer
              </Button>
           </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

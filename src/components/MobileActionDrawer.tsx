"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ListingCard } from "./ListingCard";
import { Zap } from "lucide-react";

export function MobileActionDrawer({ listing }: { listing: any }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="cursor-pointer active:scale-[0.98] transition-transform">
           <ListingCard listing={listing} />
        </div>
      </DrawerTrigger>
      <DrawerContent className="bg-black border-white/10 p-6 h-[80vh]">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-white/10 mb-8" />
        <DrawerHeader className="p-0 mb-8">
          <DrawerTitle className="text-3xl font-black tracking-tighter uppercase italic">
            Proposal Details
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest mt-2">
            Protocol Node ID: {listing.id}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="space-y-8 flex-1 overflow-y-auto pb-20">
            <div className="space-y-2">
               <h4 className="text-[10px] font-bold uppercase text-accent tracking-widest">Description</h4>
               <p className="text-sm text-foreground/80 leading-relaxed italic">{listing.description}</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
               <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Reciprocity Potential</span>
               </div>
               <p className="text-[11px] text-muted-foreground leading-relaxed">THIS SERVICE NODE IS VERIFIED BY THE NEO4J ENGINE. INITIATING A SWAP WILL ATOMICALLY CREATE A PROPOSAL RECORD IN THE PROTOCOL LEDGER.</p>
            </div>
        </div>

        <DrawerFooter className="px-0 gap-4">
          <Button className="h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(139,92,246,0.2)]">
            Initiate Reciprocity
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="h-14 rounded-2xl border-white/5 bg-transparent font-bold uppercase tracking-widest text-xs">
              Decline Proposal
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

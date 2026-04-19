"use client";

import { useState } from "react";
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
import { Package, Briefcase, Star, User, GraduationCap, MapPin, Zap } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

export function ProfileViewDrawer({ user }: { user: any }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer group">
           <Avatar className="h-6 w-6 border border-zinc-100 group-hover:border-primary/50 transition-colors">
              <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-black uppercase">
                 {user.name.substring(0, 1)}
              </AvatarFallback>
           </Avatar>
           <span className="text-[10px] font-black tracking-tight text-zinc-500 group-hover:text-primary transition-colors uppercase">
              {user.name}
           </span>
        </div>
      </DrawerTrigger>
      <DrawerContent className="bg-white border-zinc-100 p-6 h-[90vh]">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-zinc-100 mb-8" />
        
        <DrawerHeader className="p-0 mb-8">
           <div className="flex items-start justify-between">
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <GraduationCap className="h-8 w-8 text-primary" />
                    <Badge className="bg-primary/10 text-primary uppercase text-[10px] font-bold border-none">JNU Verified</Badge>
                 </div>
                 <div>
                    <DrawerTitle className="text-4xl font-black tracking-tighter uppercase italic text-zinc-800">
                       {user.name}
                    </DrawerTitle>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {user.school || "CAMPUS"}
                       </span>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                          <Star className="h-3 w-3 fill-primary" /> {user.reputation || 0} REP
                       </span>
                    </div>
                 </div>
              </div>
           </div>
        </DrawerHeader>

        <div className="space-y-12 flex-1 overflow-y-auto pb-20 px-1">
           <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Manifesto</h4>
              <p className="text-sm italic leading-relaxed text-zinc-600 font-medium">
                 "{user.bio || "No research manifesto provided yet."}"
              </p>
           </div>

           <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Registry Listings ({user.listings?.length || 0})</h4>
              <div className="grid grid-cols-1 gap-4">
                 {user.listings?.map((listing: any, idx: number) => (
                    <SpotlightCard key={idx} className="p-6 rounded-3xl border-zinc-100 bg-zinc-50/30">
                       <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                             <div className="h-10 w-10 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
                                {listing.category === "SERVICE" ? <Briefcase className="h-5 w-5 text-primary" /> : <Package className="h-5 w-5 text-primary" />}
                             </div>
                             <div>
                                <h5 className="text-[12px] font-black uppercase tracking-tight text-zinc-800">{listing.title}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                   <Badge className="bg-zinc-100 text-zinc-500 text-[8px] font-bold uppercase border-none px-2">
                                      {listing.category}
                                   </Badge>
                                   <span className="text-[8px] font-bold text-zinc-400 uppercase">
                                      {listing.effortEstimate || listing.condition || "ACTIVE"}
                                   </span>
                                </div>
                             </div>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-zinc-300 hover:text-primary">
                             <Zap className="h-4 w-4" />
                          </Button>
                       </div>
                    </SpotlightCard>
                 ))}
              </div>
           </div>
        </div>

        <DrawerFooter className="px-0 pt-6 border-t border-zinc-50">
           <Button className="h-16 rounded-3xl bg-primary text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20">
              Propose Exchange
           </Button>
           <DrawerClose asChild>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                 Back to Discovery
              </Button>
           </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

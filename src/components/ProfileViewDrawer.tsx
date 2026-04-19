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
import { Package, Briefcase, Star, MapPin, Zap, GraduationCap } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import { ReputationDial } from "./ReputationDial";

export function ProfileViewDrawer({ user }: { user: any }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer group">
           <Avatar className="h-6 w-6 border border-stone-200 group-hover:border-accent/50 transition-colors">
              <AvatarFallback className="bg-stone-100 text-stone-600 text-[10px] font-bold uppercase">
                 {user.name.substring(0, 1)}
              </AvatarFallback>
           </Avatar>
           <span className="text-[10px] font-mono font-bold tracking-tight text-stone-500 group-hover:text-accent transition-colors uppercase">
              {user.name}
           </span>
        </div>
      </DrawerTrigger>
      <DrawerContent className="bg-background border-stone-200 p-6 h-[90vh]">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-stone-200 mb-8" />
        
        <DrawerHeader className="p-0 mb-8">
           <div className="flex items-start justify-between">
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <GraduationCap className="h-8 w-8 text-accent" />
                    <Badge className="bg-accent/10 text-accent uppercase text-[10px] font-bold border-none">JNU Verified</Badge>
                 </div>
                 <div>
                    <DrawerTitle className="text-4xl font-sans font-extrabold tracking-tighter uppercase text-primary">
                       {user.name}
                    </DrawerTitle>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {user.school || "CAMPUS"}
                       </span>
                    </div>
                 </div>
              </div>
              {/* Suggestion #7: Reputation Dial integration */}
              <ReputationDial score={user.reputation || 0} size={100} />
           </div>
        </DrawerHeader>

        <div className="space-y-12 flex-1 overflow-y-auto pb-20 px-1">
           <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-stone-300">Manifesto</h4>
              <p className="text-sm italic leading-relaxed text-secondary font-medium border-l-2 border-stone-100 pl-4">
                 "{user.bio || "No research manifesto provided yet."}"
              </p>
           </div>

           <div className="space-y-6">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-stone-300">Registry Listings ({user.listings?.length || 0})</h4>
              <div className="grid grid-cols-1 gap-4">
                 {user.listings?.map((listing: any, idx: number) => (
                    <SpotlightCard key={idx} className="p-6 rounded-3xl border-stone-100 bg-white shadow-sm glass-card iridescent-hover">
                       <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                             <div className="h-10 w-10 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center">
                                {listing.category === "SERVICE" ? <Briefcase className="h-5 w-5 text-accent" /> : <Package className="h-5 w-5 text-accent" />}
                             </div>
                             <div>
                                <h5 className="text-[13px] font-sans font-extrabold uppercase tracking-tight text-primary">{listing.title}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                   <Badge className="bg-stone-100 text-stone-500 text-[9px] font-mono font-bold uppercase border-none px-2">
                                      {listing.category}
                                   </Badge>
                                </div>
                             </div>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-stone-300 hover:text-accent">
                             <Zap className="h-4 w-4" />
                          </Button>
                       </div>
                    </SpotlightCard>
                 ))}
              </div>
           </div>
        </div>

        <DrawerFooter className="px-0 pt-6 border-t border-stone-100">
           <Button className="h-16 rounded-3xl btn-premium text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-accent/20">
              Propose Exchange
           </Button>
           <DrawerClose asChild>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                 Back to Discovery
              </Button>
           </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

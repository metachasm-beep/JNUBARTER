"use client";

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Package, User, Calendar, ShieldAlert, Tag, FileText } from "lucide-react";

export function ListingDrawer({ 
  listing, 
  isOpen, 
  onClose 
}: { 
  listing: any, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  if (!listing) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[700px] overflow-y-auto bg-white/95 backdrop-blur-xl border-l border-stone-200 p-0 shadow-2xl">
        <div className="h-2 w-full bg-primary" />
        
        <div className="p-12 space-y-12">
          <SheetHeader className="space-y-6 text-left">
             <div className="flex items-center justify-between">
                <Badge className="bg-stone-100 text-stone-500 text-[10px] uppercase font-mono px-4 py-1.5 border-none">
                  {listing.type} / {listing.category}
                </Badge>
                {listing.isFlagged && (
                   <Badge variant="destructive" className="px-4 py-1.5 uppercase text-[9px] font-black tracking-widest">Flagged</Badge>
                )}
             </div>

             <div>
                <SheetTitle className="text-5xl font-black tracking-tighter text-primary uppercase italic leading-[0.8] mb-6">
                   {listing.title}
                </SheetTitle>
                <div className="flex flex-wrap gap-4">
                   <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 border border-stone-100 rounded-2xl">
                      <User className="h-3.5 w-3.5 text-stone-300" />
                      <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">{listing.user.name}</span>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 border border-stone-100 rounded-2xl">
                      <Calendar className="h-3.5 w-3.5 text-stone-300" />
                      <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">{new Date(listing.createdAt).toLocaleDateString()}</span>
                   </div>
                </div>
             </div>
          </SheetHeader>

          {listing.isFlagged && (
             <section className="p-8 rounded-[2.5rem] bg-red-50 border border-red-100 space-y-4">
                <div className="flex items-center gap-3">
                   <ShieldAlert className="h-5 w-5 text-red-500" />
                   <h4 className="text-[11px] font-mono font-black uppercase tracking-[0.3em] text-red-600">Violation Details</h4>
                </div>
                <p className="text-sm text-red-900 font-medium italic leading-relaxed">
                   "{listing.flagReason || 'No specific reason provided by the safety agent.'}"
                </p>
             </section>
          )}

          <section className="space-y-6">
             <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <FileText className="h-5 w-5 text-stone-300" />
                <h4 className="text-[11px] font-mono font-black uppercase tracking-[0.3em] text-stone-400">Description</h4>
             </div>
             <p className="text-sm text-stone-600 leading-relaxed font-medium">
                {listing.description}
             </p>
          </section>

          <section className="grid grid-cols-2 gap-6">
             <div className="glass-card p-8 rounded-[2.5rem] border-stone-200 space-y-2">
                <Tag className="h-4 w-4 text-stone-300" />
                <p className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest">Exchange Type</p>
                <p className="text-xl font-black text-primary uppercase">{listing.type}</p>
             </div>
             <div className="glass-card p-8 rounded-[2.5rem] border-stone-200 space-y-2">
                <Package className="h-4 w-4 text-stone-300" />
                <p className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest">Registry Category</p>
                <p className="text-xl font-black text-primary uppercase">{listing.category}</p>
             </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

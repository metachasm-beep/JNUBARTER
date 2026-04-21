import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { User, AlertTriangle, ShieldAlert } from "lucide-react";
import { ListingActions } from "@/components/admin/ListingActions";

export default async function ListingModeration() {
  const listings = await prisma.listing.findMany({
    orderBy: [
      { isFlagged: "desc" },
      { createdAt: "desc" }
    ],
    include: { user: { select: { name: true, email: true } } }
  });

  return (
    <div className="space-y-12 pb-24">
      <header className="space-y-2 border-b border-stone-200 pb-12">
        <h2 className="text-6xl font-extrabold tracking-tighter text-primary uppercase italic leading-none">Registry<br />Moderation</h2>
        <p className="text-stone-400 font-medium max-w-sm pt-4 italic">Audit peer assets, enforce the reciprocity protocol, and adjudicated flagged violations.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {listings.map((listing) => (
          <div key={listing.id} className={`glass-card border-stone-200 rounded-[3rem] bg-white overflow-hidden flex flex-col shadow-2xl shadow-stone-200/20 group relative ${listing.isFlagged ? 'ring-2 ring-red-500/20' : ''}`}>
             
             {/* Enhancement #1 — Flag Indicator */}
             {listing.isFlagged && (
                <div className="absolute top-6 right-6 z-10 flex items-center gap-2 bg-red-500 text-white px-4 py-1.5 rounded-full shadow-lg shadow-red-500/20">
                   <AlertTriangle className="h-3 w-3" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Policy Violation</span>
                </div>
             )}

             <div className="h-4 w-full bg-stone-50 group-hover:bg-primary transition-colors" />
             
             <div className="p-10 flex-1 space-y-8">
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                      <Badge className="bg-stone-100 text-stone-500 text-[9px] font-mono tracking-widest uppercase px-4 py-1.5 rounded-full border-none">
                        {listing.type} / {listing.category}
                      </Badge>
                   </div>
                   <h4 className="text-2xl font-black tracking-tighter text-primary uppercase line-clamp-2 leading-[0.9] group-hover:text-primary/70 transition-colors">
                     {listing.title}
                   </h4>
                </div>

                {listing.isFlagged && listing.flagReason && (
                   <div className="p-4 rounded-2xl bg-red-50 border border-red-100 space-y-2">
                      <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                         <ShieldAlert className="h-3 w-3" /> Agent Rationale
                      </p>
                      <p className="text-[10px] text-red-700 font-medium leading-relaxed italic">"{listing.flagReason}"</p>
                   </div>
                )}

                <p className="text-xs text-stone-400 font-medium line-clamp-4 leading-relaxed italic">
                  {listing.description}
                </p>

                <div className="pt-8 border-t border-stone-100 flex items-center justify-between mt-auto">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                         <User className="h-4 w-4" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-primary uppercase leading-tight">{listing.user.name}</p>
                         <p className="text-[9px] font-mono text-stone-300 uppercase truncate max-w-[100px]">{listing.user.email}</p>
                      </div>
                   </div>
                   <ListingActions listingId={listing.id} title={listing.title} />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

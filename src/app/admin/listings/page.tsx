import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Package, Trash2, AlertCircle, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ListingModeration() {
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } }
  });

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tighter text-primary uppercase italic">Registry Moderation</h2>
        <p className="text-stone-400 font-medium">Audit peer assets and enforce the reciprocity protocol.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {listings.map((listing) => (
          <div key={listing.id} className="glass-card border-stone-200 rounded-[2.5rem] bg-white overflow-hidden flex flex-col shadow-xl shadow-stone-200/20 group">
             {/* Preview Placeholder or Header */}
             <div className="h-4 w-full bg-accent/10" />
             
             <div className="p-8 flex-1 space-y-6">
                <div className="flex items-start justify-between">
                   <div className="space-y-1">
                      <Badge className="bg-stone-100 text-stone-500 text-[8px] font-mono tracking-widest uppercase px-3">
                        {listing.type} / {listing.category}
                      </Badge>
                      <h4 className="text-xl font-black tracking-tight text-primary uppercase line-clamp-1 group-hover:text-accent transition-colors">
                        {listing.title}
                      </h4>
                   </div>
                </div>

                <p className="text-xs text-stone-400 font-medium line-clamp-3 leading-relaxed">
                  {listing.description}
                </p>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center">
                         <User className="h-3 w-3 text-stone-300" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-tight truncate max-w-[120px]">
                         {listing.user.name}
                      </span>
                   </div>
                   <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-stone-100">
                         <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-500">
                         <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

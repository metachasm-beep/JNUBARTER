import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileViewDrawer } from "./ProfileViewDrawer";
import SpotlightCard from "./SpotlightCard";
import { Package, Briefcase, ChevronRight, Star } from "lucide-react";

interface ListingCardProps {
  listing: any;
  className?: string;
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const isOffer = listing.type === "OFFER";
  const isService = listing.category === "SERVICE";

  return (
    <SpotlightCard className={`h-full glass-card border-iridescent iridescent-hover cursor-pointer group ${className}`}>
      <Card className="h-full bg-transparent border-none rounded-none shadow-none flex flex-col">
        <CardHeader className="p-6 pb-2 space-y-4">
          <div className="flex justify-between items-start">
            <Badge className={`font-mono text-[9px] font-bold uppercase tracking-wider rounded-full px-3 py-1 ${isOffer ? "bg-accent/10 text-accent" : "bg-stone-200 text-stone-600"}`}>
              {listing.type}
            </Badge>
            <div className="h-8 w-8 rounded-xl bg-stone-100/50 backdrop-blur-md flex items-center justify-center border border-white/20">
               {isService ? <Briefcase className="h-4 w-4 text-stone-500" /> : <Package className="h-4 w-4 text-stone-500" />}
            </div>
          </div>
          <CardTitle className="text-xl font-sans font-extrabold leading-tight tracking-tight text-primary uppercase group-hover:text-accent transition-colors duration-300">
            {listing.title}
          </CardTitle>
          {/* Suggestion #1: Reputation integration */}
          <div className="flex items-center gap-1">
             <Star className="h-3 w-3 fill-accent text-accent" />
             <span className="text-[10px] font-mono font-bold text-accent">{listing.user?.reputation ?? 0}</span>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <p className="text-[13px] text-secondary mb-6 leading-relaxed line-clamp-2 font-medium">
            {listing.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {listing.tags.map((tag: string) => (
              <Badge key={tag} className="text-[9px] font-mono font-bold uppercase rounded-md border border-stone-200/50 bg-stone-100/30 text-stone-500 px-2 py-1">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 mt-auto flex items-center justify-between border-t border-stone-100/30 mt-4 pt-4">
          <ProfileViewDrawer user={listing.user} />
          <div className="flex items-center gap-2 text-accent">
             <span className="text-[10px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-300">Details</span>
             <ChevronRight className="h-4 w-4 transform group-hover:translateX-1 transition-transform duration-300" />
          </div>
        </CardFooter>
      </Card>
    </SpotlightCard>
  );
}

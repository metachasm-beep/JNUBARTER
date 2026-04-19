import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileViewDrawer } from "./ProfileViewDrawer";
import SpotlightCard from "./SpotlightCard";
import { Package, Briefcase, ChevronRight } from "lucide-react";

interface ListingCardProps {
  listing: any;
  className?: string;
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const isOffer = listing.type === "OFFER";
  const isService = listing.category === "SERVICE";

  return (
    <SpotlightCard className={`h-full spotlight-card bg-white border-zinc-100 rounded-3xl ${className}`}>
      <Card className="h-full bg-transparent border-none rounded-none shadow-none flex flex-col">
        <CardHeader className="p-6 pb-2 space-y-4">
          <div className="flex justify-between items-start">
            <Badge className={`font-sans text-[9px] font-bold uppercase tracking-wider rounded-full px-3 py-1 ${isOffer ? "bg-primary/10 text-primary" : "bg-zinc-100 text-zinc-500"}`}>
              {listing.type}
            </Badge>
            <div className="h-8 w-8 rounded-xl bg-zinc-50 flex items-center justify-center">
               {isService ? <Briefcase className="h-4 w-4 text-zinc-400" /> : <Package className="h-4 w-4 text-zinc-400" />}
            </div>
          </div>
          <CardTitle className="text-lg font-black leading-tight tracking-tight text-zinc-800 uppercase italic">
            {listing.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <p className="text-[12px] text-zinc-500 mb-6 leading-relaxed line-clamp-2 font-medium">
            {listing.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {listing.tags.map((tag: string) => (
              <Badge key={tag} className="text-[8px] font-bold uppercase rounded-md border-none bg-zinc-50 text-zinc-400 px-2 py-1">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 mt-auto flex items-center justify-between border-t border-zinc-50 mt-4 pt-4">
          <ProfileViewDrawer user={listing.user} />
          <ChevronRight className="h-4 w-4 text-zinc-200" />
        </CardFooter>
      </Card>
    </SpotlightCard>
  );
}

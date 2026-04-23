"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  ShieldCheck, 
  Users, 
  ArrowUpRight, 
  Sparkles, 
  Clock,
  Briefcase,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReputationDial } from "@/components/ReputationDial";
import { ListingCard } from "@/components/ListingCard";
import { ListingSkeleton } from "@/components/ListingSkeleton";
import { useListingsFlat } from "@/hooks/useListings";
import { useVerification } from "@/hooks/useVerification";
import { IdVerificationRequest } from "@/components/IdVerificationRequest";
import { 
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent 
} from "@/components/ui/hover-card";
import { PortfolioFolderModal } from "@/components/PortfolioFolderModal";
import { TriangulationSuggestions } from "@/components/TriangulationSuggestions";
import { useState } from "react";
import { ReputationAudit } from "@/components/ReputationAudit";
import { VerificationTimeline } from "@/components/VerificationTimeline";
import { useSearchParams } from "next/navigation";
import { FluxFeed } from "@/components/FluxFeed";

interface DashboardProps {
  openSetup: (step?: number) => void;
}

export function Dashboard({ openSetup }: DashboardProps) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view");
  
  const { data: listingsData, isLoading } = useListingsFlat();
  const { data: verifyData } = useVerification();
  const listings = listingsData?.listings ?? [];

  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<string | undefined>();

  const isVerified = verifyData?.isVerified;

  const handleStatClick = (label: string) => {
    setSelectedStat(label);
    setIsFolderOpen(true);
  };

  // 🛡️ IDENTITY GATE: Intercept listing creation for unverified users.
  const handleListNewAsset = () => {
    if (!isVerified) {
      setIsIdModalOpen(true);
      return;
    }
    openSetup(2);
  };

  // Mock stats for a comprehensive feel
  const stats = [
    { 
      label: "Reciprocity Threads", 
      value: "3", 
      icon: Zap, 
      color: "text-accent",
      description: "Active peer-to-peer exchange chains currently linked to your scholarly profile."
    },
    { 
      label: "Contribution Index", 
      value: "450", 
      icon: ShieldCheck, 
      color: "text-blue-500",
      description: "A comprehensive score reflecting your total value added to the JNU academic ecosystem."
    },
    { 
      label: "Network Reach", 
      value: "Top 5%", 
      icon: Users, 
      color: "text-purple-500",
      description: "Percentage of the academic network accessible through your direct and secondary connections."
    },
    { 
      label: "Efficiency Quotient", 
      value: "98%", 
      icon: Target, 
      color: "text-emerald-500",
      description: "Historical success rate of your initiated and fulfilled reciprocity agreements."
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50/50 pt-12 pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 md:space-y-12">
        
        {!verifyData?.isVerified && verifyData?.status !== 'PENDING_REVIEW' && (
          <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xl shadow-amber-200/20">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 animate-pulse">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-amber-900 leading-tight">Verify your ID to engage in barter</h3>
              </div>
            </div>
            <Button 
              onClick={() => setIsIdModalOpen(true)}
              className="h-14 px-8 rounded-2xl bg-amber-900 text-white font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-amber-900/20"
            >
              Start Verification
            </Button>
          </div>
        )}

        {verifyData?.status === 'PENDING_REVIEW' && (
           <div className="bg-primary text-white p-8 rounded-[2.5rem] flex items-center gap-6 shadow-2xl shadow-primary/20">
              <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-primary shrink-0 animate-pulse">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter leading-tight">Identity Under Review</h3>
                <p className="text-xs opacity-70 font-medium">The protocol authority is currently verifying your JNU ID credentials.</p>
              </div>
           </div>
        )}
        {/* HEADER: ACADEMIC WELCOME */}
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-primary">
              Greetings, Scholar <span className="text-accent">{session?.user?.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-sm text-secondary font-medium mt-2 max-w-xl">
              Your exchange node is currently active in the <span className="text-primary font-bold">{(session?.user as any)?.school ?? "General Registry"}</span>. Network reciprocity potential is high.
            </p>
          </div>
          <div className="flex items-center gap-6">
             <div className="h-24 w-24">
                <ReputationDial score={75} />
             </div>
          </div>
        </section>

        {/* STATS GRID: VITALITY METRICS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <HoverCard key={stat.label}>
              <HoverCardTrigger 
                render={
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleStatClick(stat.label)}
                    className="glass-card p-4 md:p-6 rounded-[2rem] border-stone-100 flex flex-col justify-between h-36 md:h-40 group hover:border-accent/20 transition-all cursor-pointer shadow-sm"
                  />
                }
              >
                <div className={`p-2 rounded-xl bg-stone-50 w-fit ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">{stat.label}</p>
                  <h4 className="text-2xl font-black text-primary">{stat.value}</h4>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 glass-card border-accent/10 p-4 shadow-xl">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-accent italic">{stat.label}</h4>
                  <p className="text-[11px] text-primary leading-relaxed font-medium">
                    {stat.description}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: RECENT ACTIVITY & OPPORTUNITIES */}
          <div className="lg:col-span-2 space-y-12">
            
            {currentView === "flux" ? (
              <FluxFeed />
            ) : (
              <>
                <TriangulationSuggestions />

                <section id="market">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase tracking-tighter italic text-primary">Optimal Exchange Potentials</h3>
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-accent hover:bg-accent/5">View Registry <ArrowUpRight className="ml-2 h-3 w-3" /></Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  Array(2).fill(0).map((_, i) => <ListingSkeleton key={i} />)
                ) : (
                  listings.slice(0, 4).map((listing, i) => (
                    <motion.div 
                      key={listing.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <ListingCard listing={listing} />
                    </motion.div>
                  ))
                )}
              </div>
            </section>
            
                <ReputationAudit />
              </>
            )}
          </div>

          {/* RIGHT: PERSONAL ASSETS & STATS */}
          <div className="space-y-12">
            <VerificationTimeline />
            
            <section className="glass-card p-8 rounded-[2.5rem] border-stone-100 bg-white/40">
              <h3 className="text-lg font-black uppercase tracking-tighter italic text-primary mb-6">Your Scholarly Capital</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-[0.2em]">Assets Provided</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-stone-100 text-stone-600 border-stone-200 text-[10px] px-3 py-1 rounded-lg">Research</Badge>
                    <Badge className="bg-stone-100 text-stone-600 border-stone-200 text-[10px] px-3 py-1 rounded-lg">Drafting</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-[0.2em]">Resources Sought</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-accent/5 text-accent border-accent/10 text-[10px] px-3 py-1 rounded-lg italic font-bold">Research Help</Badge>
                    <Badge className="bg-accent/5 text-accent border-accent/10 text-[10px] px-3 py-1 rounded-lg italic font-bold">Scientific Calc</Badge>
                  </div>
                </div>
                <Button 
                  onClick={() => openSetup(1)}
                  className="w-full mt-4 h-12 rounded-xl border border-stone-100 bg-stone-50 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-stone-100 transition-colors"
                >
                  Edit Portfolio
                </Button>
              </div>
            </section>

            <section className="glass-card p-8 rounded-[2.5rem] border-stone-100 bg-accent text-white shadow-2xl shadow-accent/20">
              <Sparkles className="h-8 w-8 mb-4 opacity-50" />
              <h3 className="text-xl font-black uppercase tracking-tighter italic leading-tight mb-2">Network Expansion</h3>
              <p className="text-[11px] opacity-80 leading-relaxed mb-6">
                Nodes with 5+ assets see a 400% increase in triangular match probability.
              </p>
              <Button 
                onClick={handleListNewAsset}
                className="w-full h-12 rounded-xl bg-white text-accent text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
              >
                {isVerified ? "List New Asset" : "Verify ID to List"}
              </Button>
            </section>
          </div>
        </div>
      </div>
      
      <PortfolioFolderModal 
        isOpen={isFolderOpen} 
        onClose={() => setIsFolderOpen(false)} 
        initialTab={selectedStat}
      />

      <IdVerificationRequest 
        isOpen={isIdModalOpen} 
        onClose={() => setIsIdModalOpen(false)} 
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}

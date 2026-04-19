import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, ShieldCheck, TreePine, Zap } from "lucide-react";

export function generateStaticParams() {
  return [{ id: "mock-user-id" }];
}

export default async function TrustDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex gap-6 items-center">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src="" />
            <AvatarFallback className="text-3xl font-black">AC</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Alex Chen</h1>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-[10px] tracking-widest uppercase">Reputation: 450</Badge>
              <Badge variant="outline" className="text-[10px] tracking-widest uppercase">Verified: YES</Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-primary/5 border-2 p-4 text-center">
            <div className="text-2xl font-black">12</div>
            <div className="text-[10px] opacity-50 uppercase">Completed Swaps</div>
          </div>
          <div className="bg-primary/5 border-2 p-4 text-center">
            <div className="text-2xl font-black">28</div>
            <div className="text-[10px] opacity-50 uppercase">Vouches Recv</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Skill Tree Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-none border-4 bg-black overflow-hidden relative min-h-[500px]">
            <CardHeader className="border-b-2 bg-muted/20">
              <CardTitle className="text-sm uppercase flex items-center gap-2">
                <TreePine className="h-4 w-4" /> The Reputation Tree
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex items-center justify-center relative">
              {/* Simple SVG Skill Tree Mockup */}
              <svg viewBox="0 0 400 400" className="w-full max-w-[500px] h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                {/* Trunk */}
                <rect x="190" y="300" width="20" height="100" fill="#333" />
                
                {/* Branches based on skills */}
                <line x1="200" y1="300" x2="100" y2="200" stroke="white" strokeWidth="4" />
                <line x1="200" y1="300" x2="300" y2="200" stroke="white" strokeWidth="4" />
                <line x1="200" y1="300" x2="200" y2="150" stroke="white" strokeWidth="4" />
                
                {/* Nodes (Verified Skills) */}
                <circle cx="100" cy="200" r="30" className="fill-blue-500 animate-pulse" />
                <text x="100" y="200" textAnchor="middle" dy=".3em" fontSize="10" className="fill-white font-bold uppercase">React</text>
                
                <circle cx="300" cy="200" r="25" className="fill-purple-500" />
                <text x="300" y="200" textAnchor="middle" dy=".3em" fontSize="8" className="fill-white font-bold uppercase">Design</text>
                
                <circle cx="200" cy="150" r="35" className="fill-emerald-500 animate-pulse" />
                <text x="200" y="150" textAnchor="middle" dy=".3em" fontSize="10" className="fill-white font-bold uppercase">Logic</text>
                
                {/* Leaves (Recent Vouches) */}
                <circle cx="80" cy="180" r="8" className="fill-white/20" />
                <circle cx="120" cy="190" r="8" className="fill-white/20" />
                <circle cx="220" cy="130" r="8" className="fill-white/20" />
              </svg>
              
              <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground uppercase bg-black/80 p-2 border">
                Visualization: Gifting Hierarchy v1.0
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Vouches List */}
        <div className="space-y-6">
          <h2 className="text-sm font-black uppercase flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Verified Vouches
          </h2>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="rounded-none border-2 bg-muted/5 transition-colors hover:bg-primary/5">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] font-bold uppercase">User_{i}02</span>
                      <span className="text-[10px] opacity-40 ml-auto">2 DAYS AGO</span>
                    </div>
                    <p className="text-xs italic opacity-80">
                      "Alex delivered exceptional logic for our triangular swap. The skill tree growth is well-deserved. Highly recommend for high-effort technical tasks."
                    </p>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-[8px] py-0">#ENGINEERING</Badge>
                      <Badge variant="outline" className="text-[8px] py-0">#EFFICIENCY</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

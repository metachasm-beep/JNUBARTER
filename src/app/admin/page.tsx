import { prisma } from "@/lib/prisma";
import { Users, Package, RefreshCw, Star, ShieldAlert, Cpu, Activity, TrendingUp, Search, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  try {
    const userCount = await prisma.user.count().catch(() => 0);
    const listingCount = await prisma.listing.count().catch(() => 0);
    const swapCount = await prisma.swap.count().catch(() => 0);
    
    // Enhancement #1 & #7 — Alerts
    const flaggedCount = await prisma.listing.count({ where: { isFlagged: true } }).catch(() => 0);
    const recentAlerts = await prisma.auditLog.findMany({ 
      take: 5, 
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } }
    }).catch(() => []);

    // Enhancement #3 — Usage
    const usageStats = await prisma.usageLog.aggregate({
      _sum: { cost: true, tokens: true }
    }).catch(() => ({ _sum: { cost: 0, tokens: 0 } }));
    
    const usageCost = usageStats?._sum?.cost ?? 0;
    const usageTokens = usageStats?._sum?.tokens ?? 0;

    // Enhancement #9 — Sentiment
    const networkSentiment = await prisma.auditLog.findFirst({
      where: { action: "SENTIMENT_ANALYSIS" },
      orderBy: { createdAt: "desc" }
    }).catch(() => null);
    const sentimentData = (networkSentiment?.metadata as any) || { label: "STABLE", score: 50 };

    return (
      <div className="space-y-12 pb-24">
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-stone-200 pb-8 md:pb-12 gap-8">
          <div className="space-y-2">
             <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest italic">System Status: Online</span>
             </div>
             <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-primary uppercase italic leading-[0.8]">Admin<br />Dashboard</h2>
             <p className="text-stone-400 text-xs md:text-sm font-medium max-w-sm pt-4 italic">Monitor campus listings and community activity in real-time.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="text-left md:text-right glass-card p-4 md:p-6 rounded-3xl border-stone-200 group relative cursor-help w-full">
                <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">Platform Costs</p>
                <h4 className="text-2xl md:text-3xl font-black text-primary tracking-tighter">${Number(usageCost).toFixed(4)}</h4>
                <p className="text-[9px] font-mono text-stone-300 uppercase italic">{(usageTokens || 0).toLocaleString()} Resources used</p>
                <div className="tooltip-content absolute left-1/2 -bottom-10 -translate-x-1/2 bg-stone-900 text-white text-[8px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">LLM & Infrastructure Burn</div>
             </div>
          </div>
        </header>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard icon={<Users className="h-5 w-5" />} label="Users" value={userCount} detail="Community members" tooltip="Active Node Count" />
          <MetricCard icon={<Package className="h-5 w-5" />} label="Listings" value={listingCount} detail="Items & Services" tooltip="Marketplace Inventory" />
          <MetricCard icon={<RefreshCw className="h-5 w-5" />} label="Swaps" value={swapCount} detail="Successful exchanges" tooltip="Reciprocity Events" />
          <MetricCard icon={<ShieldAlert className="h-5 w-5 text-red-500" />} label="Flagged" value={flaggedCount} detail="Reported items" tooltip="Policy Violations" />
          
          <div className="tooltip-container tooltip-bottom w-full">
            <div className="glass-card border-stone-200 rounded-[2rem] p-6 md:p-8 space-y-4 shadow-lg flex flex-col justify-center items-center text-center w-full h-full">
               <TrendingUp className={`h-6 w-6 ${sentimentData.label === 'VIBRANT' ? 'text-emerald-500' : 'text-stone-400'}`} />
               <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">Community Vibe</p>
               <h4 className="text-xl md:text-2xl font-black text-primary uppercase italic">{sentimentData.label === 'STABLE' ? 'Steady' : sentimentData.label}</h4>
               <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden mt-2">
                  <div className="bg-primary h-full transition-all" style={{ width: `${sentimentData.score}%` }} />
               </div>
            </div>
            <div className="tooltip-content">Network Sentiment</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Enhancement #7 — Security Feed */}
          <div className="lg:col-span-2 glass-card border-stone-200 rounded-[3rem] p-10 space-y-8 bg-white/50 backdrop-blur-3xl shadow-2xl shadow-stone-200/40 border-t-white">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <ShieldAlert className="h-6 w-6 text-primary" />
                   <h3 className="text-2xl font-black uppercase tracking-tight text-primary italic">Recent Activity</h3>
                </div>
                <Badge className="bg-stone-100 text-stone-500 text-[10px] uppercase tracking-widest">Live Updates</Badge>
             </div>
             
             <div className="space-y-4">
                {recentAlerts.map((log) => (
                  <div key={log.id} className="group flex items-center justify-between p-6 rounded-3xl bg-white border border-stone-100 hover:border-primary/20 hover:shadow-xl hover:shadow-stone-200/20 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                         <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-primary uppercase">{log.action}</p>
                        <p className="text-[10px] font-mono text-stone-400 flex items-center gap-1.5 mt-1">
                          <Activity className="h-3 w-3" /> {log.entity} • {new Date(log.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-mono border-stone-200 text-stone-400">
                      {log.user?.name || 'System'}
                    </Badge>
                  </div>
                ))}
             </div>
          </div>

          <div className="space-y-8">
             <div className="glass-card border-stone-200 rounded-[3rem] p-10 space-y-6 bg-white shadow-xl shadow-stone-200/20 border-t-white">
                <Search className="h-6 w-6 text-stone-300" />
                <h3 className="text-xl font-black uppercase italic text-primary">Verify Users</h3>
                <p className="text-stone-400 text-xs font-medium">Verify student credentials and research claims manually or with AI help.</p>
                <div className="tooltip-container tooltip-top w-full">
                  <button className="w-full h-12 rounded-2xl border border-stone-200 text-stone-400 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Verify Now</button>
                  <div className="tooltip-content">Launch Auth Guard</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-400 font-mono text-sm uppercase italic">Restoring Command Center Link...</p>
      </div>
    );
  }
}

function MetricCard({ icon, label, value, detail, tooltip }: any) {
  return (
    <div className="tooltip-container tooltip-bottom w-full h-full">
      <div className="glass-card border-stone-200 rounded-[2.5rem] p-6 md:p-8 space-y-4 shadow-xl shadow-stone-200/20 hover:border-primary/20 transition-all group bg-white/80 w-full h-full">
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-stone-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest mb-1">{label}</p>
          <h4 className="text-3xl md:text-5xl font-black tracking-tighter text-primary group-hover:scale-105 origin-left transition-transform">{value}</h4>
        </div>
        <p className="text-[9px] font-mono text-stone-300 uppercase italic tracking-tight">{detail}</p>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}

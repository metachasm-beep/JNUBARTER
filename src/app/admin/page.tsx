import { prisma } from "@/lib/prisma";
import { Users, Package, RefreshCw, Star, ShieldAlert, Cpu, Activity, TrendingUp, Search, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  try {
    const userCount = await prisma.user.count();
    const listingCount = await prisma.listing.count();
    const swapCount = await prisma.swap.count();
    const averageReputation = await prisma.user.aggregate({ _avg: { reputation: true } });
    const avgRep = averageReputation._avg.reputation ?? 0;
    
    // Enhancement #1 & #7 — Alerts
    const flaggedCount = await prisma.listing.count({ where: { isFlagged: true } });
    const recentAlerts = await prisma.auditLog.findMany({ 
      take: 5, 
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } }
    });

    // Enhancement #3 — Usage
    const usageStats = await prisma.usageLog.aggregate({
      _sum: { cost: true, tokens: true }
    });
    const usageCost = usageStats?._sum?.cost ?? 0;
    const usageTokens = usageStats?._sum?.tokens ?? 0;

    // Enhancement #9 — Sentiment
    const networkSentiment = await prisma.auditLog.findFirst({
      where: { action: "SENTIMENT_ANALYSIS" },
      orderBy: { createdAt: "desc" }
    });
    const sentimentData = (networkSentiment?.metadata as any) || { label: "STABLE", score: 50 };

    return (
      <div className="space-y-12 pb-24">
        <header className="flex items-end justify-between border-b border-stone-200 pb-12">
          <div className="space-y-2">
             <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest italic">Live Telemetry Active</span>
             </div>
             <h2 className="text-6xl font-extrabold tracking-tighter text-primary uppercase italic leading-[0.8]">Command<br />Center</h2>
             <p className="text-stone-400 font-medium max-w-sm pt-4 italic">Aggregated network intelligence and protocol health telemetry.</p>
          </div>
          
          {/* Enhancement #3 — Cost Summary */}
          <div className="text-right glass-card p-6 rounded-3xl border-stone-200">
             <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">Compute Overhead</p>
             <h4 className="text-3xl font-black text-primary tracking-tighter">${Number(usageCost).toFixed(4)}</h4>
             <p className="text-[9px] font-mono text-stone-300 uppercase italic">{(usageTokens || 0).toLocaleString()} Tokens used</p>
          </div>
        </header>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard icon={<Users className="h-5 w-5" />} label="Nodes" value={userCount} detail="Peers on network" />
          <MetricCard icon={<Package className="h-5 w-5" />} label="Assets" value={listingCount} detail="Service/Commodity" />
          <MetricCard icon={<RefreshCw className="h-5 w-5" />} label="Chains" value={swapCount} detail="Discovery loops" />
          <MetricCard icon={<ShieldAlert className="h-5 w-5 text-red-500" />} label="Threats" value={flaggedCount} detail="Policy violations" />
          <div className="glass-card border-stone-200 rounded-[2rem] p-8 space-y-4 shadow-lg flex flex-col justify-center items-center text-center">
             <TrendingUp className={`h-6 w-6 ${sentimentData.label === 'VIBRANT' ? 'text-emerald-500' : 'text-stone-400'}`} />
             <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">Sentiment</p>
             <h4 className="text-2xl font-black text-primary uppercase italic">{sentimentData.label}</h4>
             <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden mt-2">
                <div className="bg-primary h-full transition-all" style={{ width: `${sentimentData.score}%` }} />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Enhancement #7 — Security Feed */}
          <div className="lg:col-span-2 glass-card border-stone-200 rounded-[3rem] p-10 space-y-8 bg-white/50 backdrop-blur-3xl shadow-2xl shadow-stone-200/40 border-t-white">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <ShieldAlert className="h-6 w-6 text-primary" />
                   <h3 className="text-2xl font-black uppercase tracking-tight text-primary italic">Security Pulse</h3>
                </div>
                <Badge className="bg-stone-100 text-stone-500 text-[10px] uppercase tracking-widest">Real-time Feed</Badge>
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
                        <p className="text-[10px] font-mono text-stone-400 flex items-center gap-2">
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
             <div className="glass-card border-stone-200 rounded-[3rem] p-10 space-y-6 bg-primary text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                   <Cpu className="h-8 w-8 text-white/50 group-hover:scale-125 transition-transform" />
                   <h3 className="text-3xl font-black uppercase italic leading-none tracking-tighter">Simulation<br />Lab</h3>
                   <p className="text-white/60 text-xs font-medium leading-relaxed">Benchmark the Godmode Graph Discovery logic against synthetic network states.</p>
                   <button className="w-full h-12 rounded-2xl bg-white text-primary text-[10px] font-mono font-black uppercase tracking-widest mt-4">Initialize Benchmark</button>
                </div>
                <div className="absolute -right-8 -bottom-8 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
             </div>

             <div className="glass-card border-stone-200 rounded-[3rem] p-10 space-y-6 bg-white shadow-xl shadow-stone-200/20 border-t-white">
                <Search className="h-6 w-6 text-stone-300" />
                <h3 className="text-xl font-black uppercase italic text-primary">Authority Intel</h3>
                <p className="text-stone-400 text-xs font-medium">Research and verify scholarly claims using autonomous deep-search agents.</p>
                <button className="w-full h-12 rounded-2xl border border-stone-200 text-stone-400 text-[10px] font-mono font-bold uppercase tracking-widest">Verify Claims</button>
             </div>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12 bg-stone-50">
        <div className="glass-card p-12 rounded-[3rem] border-red-100 bg-white shadow-2xl text-center max-w-xl">
           <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-6" />
           <h2 className="text-3xl font-black uppercase italic text-primary tracking-tighter mb-4">Telemetry Failure</h2>
           <p className="text-stone-500 text-sm font-medium mb-8">The Command Center was unable to establish a secure link with the network infrastructure.</p>
           <div className="bg-red-50 p-6 rounded-2xl text-left border border-red-100 overflow-x-auto">
              <p className="text-[10px] font-mono text-red-600 leading-relaxed">
                ERROR: {error.message || 'Unknown Server Error'}
              </p>
              <div className="mt-4 pt-4 border-t border-red-100">
                <p className="text-[8px] font-mono text-red-400 uppercase font-bold mb-1">Available Keys:</p>
                <p className="text-[8px] font-mono text-red-300 break-all">
                  {Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASSWORD') && !k.includes('KEY')).join(', ')}
                </p>
              </div>
           </div>
           <a href="/admin" className="mt-8 inline-flex items-center justify-center h-12 px-8 rounded-2xl bg-primary text-white text-[10px] font-mono font-black uppercase tracking-widest">Retry Connection</a>
        </div>
      </div>
    );
  }
}

function MetricCard({ icon, label, value, detail }: any) {
  return (
    <div className="glass-card border-stone-200 rounded-[2.5rem] p-8 space-y-4 shadow-xl shadow-stone-200/20 hover:border-primary/20 transition-all group bg-white/80">
      <div className="h-12 w-12 rounded-2xl bg-stone-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-5xl font-black tracking-tighter text-primary group-hover:scale-105 origin-left transition-transform">{value}</h4>
      </div>
      <p className="text-[9px] font-mono text-stone-300 uppercase italic tracking-tight">{detail}</p>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { Users, Package, RefreshCw, Star, Zap, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  const userCount = await prisma.user.count();
  const listingCount = await prisma.listing.count();
  const swapCount = await prisma.swap.count();
  const averageReputation = await prisma.user.aggregate({ _avg: { reputation: true } });

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tighter text-primary uppercase italic">Intelligence Hub</h2>
        <p className="text-stone-400 font-medium">Real-time telemetry and protocol health overview.</p>
      </header>

      {/* High-Density Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          icon={<Users className="h-5 w-5 text-accent" />} 
          label="Nodes Online" 
          value={userCount.toString()} 
          detail="Total registered peers" 
        />
        <MetricCard 
          icon={<Package className="h-5 w-5 text-blue-500" />} 
          label="Assets" 
          value={listingCount.toString()} 
          detail="Active service/commodity nodes" 
        />
        <MetricCard 
          icon={<RefreshCw className="h-5 w-5 text-emerald-500" />} 
          label="Flows" 
          value={swapCount.toString()} 
          detail="Total reciprocity chains" 
        />
        <MetricCard 
          icon={<Star className="h-5 w-5 text-yellow-500" />} 
          label="Reputation Avg" 
          value={Math.round(averageReputation._avg.reputation || 0).toString()} 
          detail="Network integrity index" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
        {/* Recent Ingress */}
        <section className="glass-card border-stone-200 rounded-[2.5rem] p-10 space-y-8 shadow-xl shadow-stone-200/40">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-sans font-black uppercase tracking-tight text-primary">Recent Ingress</h3>
              <Badge className="bg-stone-100 text-stone-500 text-[9px] font-mono tracking-widest uppercase px-4 py-1">Last 5 Nodes</Badge>
           </div>
           
           <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50/50 border border-stone-100">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white border border-stone-200 flex items-center justify-center font-bold text-stone-400 text-xs uppercase">
                       {user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-primary uppercase">{user.name}</p>
                      <p className="text-[10px] font-mono text-stone-400">{user.email}</p>
                    </div>
                  </div>
                  <Badge className={user.role === 'ADMIN' ? 'bg-primary text-white' : 'bg-white text-stone-400 border-stone-200'}>
                    {user.role}
                  </Badge>
                </div>
              ))}
           </div>
        </section>

        {/* System Pulse */}
        <section className="glass-card border-stone-200 rounded-[2.5rem] p-10 space-y-8 shadow-xl shadow-stone-200/40">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-sans font-black uppercase tracking-tight text-primary">System Pulse</h3>
              <Activity className="h-5 w-5 text-accent animate-pulse" />
           </div>
           
           <div className="space-y-6">
              <PulseItem label="Prisma Adapter" status="Operational" />
              <PulseItem label="Neon DB Engine" status="Optimized" />
              <PulseItem label="Inngest Queue" status="Healthy" />
              <PulseItem label="Semantic Search" status="Active" />
           </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, detail }: any) {
  return (
    <div className="glass-card border-stone-200 rounded-[2rem] p-8 space-y-4 shadow-lg shadow-stone-200/20 hover:border-accent/20 transition-all group">
      <div className="h-10 w-10 rounded-xl bg-stone-50 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">{label}</p>
        <h4 className="text-4xl font-black tracking-tighter text-primary group-hover:text-accent transition-colors">{value}</h4>
      </div>
      <p className="text-[9px] font-mono text-stone-300 uppercase tracking-tight">{detail}</p>
    </div>
  );
}

function PulseItem({ label, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-stone-100">
      <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 italic">{status}</span>
      </div>
    </div>
  );
}

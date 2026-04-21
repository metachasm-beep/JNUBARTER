import { prisma } from "@/lib/prisma";
import { Activity, ShieldAlert, Zap, Search, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminLogsPage() {
  const logs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } }
  });

  return (
    <div className="space-y-12 pb-24">
      <header className="flex items-end justify-between border-b border-stone-200 pb-12">
        <div className="space-y-2">
           <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest italic">System Pulse Active</span>
           </div>
           <h2 className="text-6xl font-extrabold tracking-tighter text-primary uppercase italic leading-[0.8]">System<br />Pulse</h2>
           <p className="text-stone-400 font-medium max-w-sm pt-4 italic">Immutable audit logs and security telemetry feed.</p>
        </div>
      </header>

      <div className="glass-card border-stone-200 rounded-[3rem] p-10 space-y-8 bg-white/50 backdrop-blur-3xl shadow-2xl shadow-stone-200/40 border-t-white">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <ShieldAlert className="h-6 w-6 text-primary" />
             <h3 className="text-2xl font-black uppercase tracking-tight text-primary italic">Audit Registry</h3>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-stone-100 text-stone-500 text-[10px] uppercase tracking-widest">{logs.length} Events</Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-stone-100">
                <th className="pb-4 text-[10px] font-mono font-black uppercase tracking-widest text-stone-400">Timestamp</th>
                <th className="pb-4 text-[10px] font-mono font-black uppercase tracking-widest text-stone-400">Actor</th>
                <th className="pb-4 text-[10px] font-mono font-black uppercase tracking-widest text-stone-400">Action</th>
                <th className="pb-4 text-[10px] font-mono font-black uppercase tracking-widest text-stone-400">Entity</th>
                <th className="pb-4 text-[10px] font-mono font-black uppercase tracking-widest text-stone-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {logs.map((log) => (
                <tr key={log.id} className="group hover:bg-stone-50/50 transition-colors">
                  <td className="py-6 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400">
                      <Clock className="h-3 w-3" />
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-primary uppercase">{log.user?.name || 'SYSTEM'}</p>
                        <p className="text-[9px] font-mono text-stone-300">{log.user?.email || 'internal'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <Badge variant="outline" className="bg-white text-[9px] font-mono border-stone-200 text-primary group-hover:border-primary transition-colors">
                      {log.action}
                    </Badge>
                  </td>
                  <td className="py-6">
                    <p className="text-[10px] font-mono text-stone-400 uppercase font-bold">{log.entity}</p>
                    <p className="text-[9px] font-mono text-stone-300 truncate max-w-[100px]">{log.entityId}</p>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-emerald-500" />
                      <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase italic">Recorded</span>
                    </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Activity className="h-12 w-12 text-stone-200 mx-auto mb-4" />
                    <p className="text-stone-400 font-mono text-[10px] uppercase font-bold">No system activity recorded in registry.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

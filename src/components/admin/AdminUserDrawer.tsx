"use client";

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  RefreshCw, 
  Activity, 
  MapPin, 
  GraduationCap, 
  ShieldCheck, 
  History, 
  ExternalLink,
  Mail,
  Calendar
} from "lucide-react";
import { ReputationDial } from "../ReputationDial";

export function AdminUserDrawer({ 
  user, 
  isOpen, 
  onClose 
}: { 
  user: any, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[800px] overflow-y-auto bg-white/95 backdrop-blur-xl border-l border-stone-200 p-0 shadow-2xl">
        <div className="h-2 w-full bg-primary" />
        
        <div className="p-12 space-y-12">
          <SheetHeader className="space-y-6 text-left">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="h-12 w-12 rounded-2xl bg-stone-100 flex items-center justify-center font-black text-primary text-xl shadow-inner uppercase">
                      {user.name?.[0] || 'U'}
                   </div>
                   <Badge className="bg-primary text-white text-[10px] uppercase italic border-none px-4 py-1">Node Status: Active</Badge>
                </div>
                <ReputationDial score={user.reputation || 0} size={80} />
             </div>

             {user.verificationReports?.[0]?.status === 'CHALLENGED' && (
               <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-widest mb-1">Active Email Challenge</p>
                     <p className="text-xs text-amber-700 font-medium italic">Student must provide the code sent to {user.email}</p>
                  </div>
                  <div className="text-2xl font-mono font-black text-amber-900 tracking-[0.2em] bg-white px-6 py-2 rounded-xl shadow-sm">
                     {user.verificationReports[0].evidence?.challengeCode || '------'}
                  </div>
               </div>
             )}

             <div>
                <SheetTitle className="text-5xl font-black tracking-tighter text-primary uppercase italic leading-[0.8]">
                   {user.name}
                </SheetTitle>
                <div className="flex flex-wrap gap-4 mt-6">
                   <InfoBadge icon={<Mail className="h-3.5 w-3.5" />} text={user.email} />
                   <InfoBadge icon={<MapPin className="h-3.5 w-3.5" />} text={`${user.school || 'Unassigned'} • ${user.hostel || 'Day Scholar'}`} />
                   <InfoBadge icon={<Calendar className="h-3.5 w-3.5" />} text={`Joined ${new Date(user.createdAt).toLocaleDateString()}`} />
                </div>
             </div>
          </SheetHeader>

          <div className="grid grid-cols-2 gap-6">
             <StatBox label="Listings" value={user._count?.listings || 0} icon={<Package className="h-5 w-5" />} />
             <StatBox label="Network Flows" value={(user._count?.swapsInitiated || 0) + (user._count?.swapsReceived || 0)} icon={<RefreshCw className="h-5 w-5" />} />
          </div>

          <section className="space-y-6">
             <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <History className="h-5 w-5 text-stone-300" />
                <h4 className="text-[11px] font-mono font-black uppercase tracking-[0.3em] text-stone-400">Registry History</h4>
             </div>
             <div className="space-y-3">
                {user.listings?.length > 0 ? user.listings.map((item: any) => (
                  <div key={item.id} className="p-6 rounded-3xl bg-stone-50 border border-stone-100 flex items-center justify-between group hover:bg-white hover:border-primary/10 hover:shadow-xl hover:shadow-stone-200/20 transition-all">
                    <div>
                      <p className="text-[9px] font-mono font-bold text-stone-300 uppercase tracking-widest mb-1">{item.category} / {item.type}</p>
                      <h5 className="text-sm font-black text-primary uppercase">{item.title}</h5>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-mono border-stone-200">{item.isFlagged ? 'FLAGGED' : 'ACTIVE'}</Badge>
                  </div>
                )) : (
                  <p className="text-[10px] font-mono text-stone-300 italic px-6">No assets registered in this node.</p>
                )}
             </div>
          </section>

          <section className="space-y-6">
             <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <Activity className="h-5 w-5 text-stone-300" />
                <h4 className="text-[11px] font-mono font-black uppercase tracking-[0.3em] text-stone-400">Audit Logs & Activity</h4>
             </div>
             <div className="space-y-3">
                {user.auditLogs?.length > 0 ? user.auditLogs.map((log: any) => (
                  <div key={log.id} className="p-4 rounded-2xl border border-stone-100 flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-stone-200" />
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase leading-tight">{log.action}</p>
                      <p className="text-[9px] font-mono text-stone-400 uppercase">{log.entity} • {new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-[10px] font-mono text-stone-300 italic px-6">No recent audit logs detected.</p>
                )}
             </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoBadge({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 border border-stone-100 rounded-2xl">
      <div className="text-stone-300">{icon}</div>
      <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-tight">{text}</span>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="glass-card p-8 rounded-[2.5rem] border-stone-200 flex flex-col items-center justify-center text-center space-y-2 group hover:border-primary/20 transition-all">
       <div className="text-stone-300 group-hover:text-primary transition-colors">{icon}</div>
       <p className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest">{label}</p>
       <h4 className="text-4xl font-black tracking-tighter text-primary">{value}</h4>
    </div>
  );
}

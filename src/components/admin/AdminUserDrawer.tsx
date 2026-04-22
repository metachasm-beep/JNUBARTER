"use client";

import { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  RefreshCw, 
  Activity, 
  MapPin, 
  ShieldCheck, 
  History, 
  Mail,
  Calendar,
  Loader2
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
  const [fullUser, setFullUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?.id) {
      setLoading(true);
      setFullUser(null);
      fetch(`/api/admin/users/${user.id}`)
        .then(r => r.json())
        .then(data => setFullUser(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, user?.id]);

  const displayUser = fullUser || user;
  if (!displayUser) return null;

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

             {user.idCardUrl && (
               <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                     <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-accent" />
                        <h4 className="text-[11px] font-mono font-black uppercase tracking-[0.3em] text-stone-400">Credential Review</h4>
                     </div>
                     <Badge className="bg-amber-100 text-amber-700 border-none px-4 py-1 uppercase text-[9px] font-bold">Pending Review</Badge>
                  </div>
                  
                  <div className="relative aspect-[1.58/1] w-full rounded-[2.5rem] overflow-hidden border-4 border-stone-100 shadow-2xl group">
                     <img src={user.idCardUrl} alt="ID Card" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                        <Button 
                          onClick={async () => {
                            if (!confirm("Approve this identity?")) return;
                            await fetch(`/api/admin/users/${user.id}/verify`, { method: "POST" });
                            window.location.reload();
                          }}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-xs"
                        >
                          Approve Node
                        </Button>
                        <Button 
                          onClick={async () => {
                            if (!confirm("Reject this credential?")) return;
                            await fetch(`/api/admin/users/${user.id}/reject-id`, { method: "POST" });
                            window.location.reload();
                          }}
                          variant="destructive" 
                          className="rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-xs"
                        >
                          Reject
                        </Button>
                     </div>
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

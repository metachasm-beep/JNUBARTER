import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield, UserX, UserCheck, Search, SearchCode, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function UserManagement() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { 
      _count: { select: { listings: true, swapsInitiated: true, swapsReceived: true } },
      verificationReports: { take: 1, orderBy: { createdAt: "desc" } }
    }
  });

  return (
    <div className="space-y-12 pb-24">
      <header className="flex items-end justify-between border-b border-stone-200 pb-12">
        <div className="space-y-2">
          <h2 className="text-6xl font-extrabold tracking-tighter text-primary uppercase italic leading-none">Peer<br />Network</h2>
          <p className="text-stone-400 font-medium max-w-sm pt-4 italic">Manage node identities, access privileges, and verify scholarly authority.</p>
        </div>
        <div className="relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300 group-focus-within:text-primary transition-colors" />
           <input 
            type="text" 
            placeholder="Search peer email..." 
            className="h-16 w-96 pl-14 pr-8 rounded-[2rem] bg-stone-50 border-none text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
           />
        </div>
      </header>

      <div className="glass-card border-stone-200 rounded-[3rem] overflow-hidden shadow-2xl shadow-stone-200/20 bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50/50">
              <th className="px-10 py-8 text-left text-[11px] font-mono font-black uppercase tracking-widest text-stone-400">Node Identity</th>
              <th className="px-10 py-8 text-left text-[11px] font-mono font-black uppercase tracking-widest text-stone-400">Privileges</th>
              <th className="px-10 py-8 text-left text-[11px] font-mono font-black uppercase tracking-widest text-stone-400">Authority Intel</th>
              <th className="px-10 py-8 text-left text-[11px] font-mono font-black uppercase tracking-widest text-stone-400">Activity</th>
              <th className="px-10 py-8 text-right text-[11px] font-mono font-black uppercase tracking-widest text-stone-400">Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-stone-50/30 transition-all group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-3xl bg-stone-100 flex items-center justify-center font-black text-stone-400 text-lg shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                      {user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-black text-primary uppercase leading-tight">{user.name}</p>
                      <p className="text-[10px] font-mono text-stone-400 flex items-center gap-1.5 mt-1">
                        <Mail className="h-2.5 w-2.5" /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <Badge className={user.role === 'ADMIN' ? 'bg-primary text-white text-[10px] px-4 py-1.5 uppercase italic' : 'bg-stone-100 text-stone-400 border-none text-[10px] px-4 py-1.5 uppercase'}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-10 py-8">
                   {user.verificationReports[0] ? (
                     <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${user.verificationReports[0].status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-tighter">{user.verificationReports[0].status}</span>
                     </div>
                   ) : (
                     <span className="text-[10px] font-mono text-stone-300 uppercase italic">Pending Intel</span>
                   )}
                </td>
                <td className="px-10 py-8">
                  <div className="flex gap-8">
                    <StatPill label="Nodes" val={user._count.listings} />
                    <StatPill label="Flows" val={user._count.swapsInitiated + user._count.swapsReceived} />
                  </div>
                </td>
                <td className="px-10 py-8 text-right">
                   <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                      <div className="tooltip-container">
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-primary hover:text-white border border-stone-100">
                          <SearchCode className="h-5 w-5" />
                        </Button>
                        <div className="tooltip-content">Deep Verify</div>
                      </div>
                      <div className="tooltip-container">
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-red-50 hover:text-red-500 border border-stone-100">
                          <UserX className="h-5 w-5" />
                        </Button>
                        <div className="tooltip-content">Revoke Access</div>
                      </div>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatPill({ label, val }: { label: string, val: number }) {
  return (
    <div>
      <p className="text-[10px] font-mono font-black text-stone-300 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-lg font-black text-primary tracking-tighter">{val}</p>
    </div>
  );
}

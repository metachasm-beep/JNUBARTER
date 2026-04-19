import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, UserX, UserCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function UserManagement() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { listings: true, swapsInitiated: true, swapsReceived: true } } }
  });

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold tracking-tighter text-primary uppercase italic">Peer Network</h2>
          <p className="text-stone-400 font-medium">Manage node identities and access privileges.</p>
        </div>
        <div className="relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-300" />
           <input 
            type="text" 
            placeholder="Search peer email..." 
            className="h-14 w-80 pl-12 pr-6 rounded-2xl bg-white border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all"
           />
        </div>
      </header>

      <div className="glass-card border-stone-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-200/20">
        <table className="w-full">
          <thead className="bg-stone-50/50 border-b border-stone-100">
            <tr>
              <th className="px-8 py-6 text-left text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Node Identity</th>
              <th className="px-8 py-6 text-left text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Privileges</th>
              <th className="px-8 py-6 text-left text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Activity</th>
              <th className="px-8 py-6 text-left text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Reputation</th>
              <th className="px-8 py-6 text-right text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-stone-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-400 text-xs">
                      {user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-black text-primary uppercase">{user.name}</p>
                      <p className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                        <Mail className="h-2 w-2" /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <Badge className={user.role === 'ADMIN' ? 'bg-primary text-white text-[9px] uppercase' : 'bg-stone-100 text-stone-400 border-none text-[9px] uppercase'}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-8 py-6">
                  <div className="flex gap-4">
                    <StatPill label="Listings" val={user._count.listings} />
                    <StatPill label="Swaps" val={user._count.swapsInitiated + user._count.swapsReceived} />
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-black text-accent italic">+{user.reputation}</span>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500">
                        <UserX className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-emerald-50 hover:text-emerald-500">
                        <Shield className="h-4 w-4" />
                      </Button>
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
    <div className="text-center">
      <p className="text-[9px] font-mono font-bold text-stone-300 uppercase tracking-tight">{label}</p>
      <p className="text-xs font-black text-primary">{val}</p>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";
import { UserRow } from "@/components/admin/UserRow";

export default async function UserManagement() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { 
      _count: { select: { listings: true, swapsInitiated: true, swapsReceived: true } },
      verificationReports: { take: 1, orderBy: { createdAt: "desc" } },
      listings: { take: 10, orderBy: { createdAt: "desc" } },
      auditLogs: { take: 10, orderBy: { createdAt: "desc" } },
      swapsInitiated: { take: 5, orderBy: { createdAt: "desc" } },
      swapsReceived: { take: 5, orderBy: { createdAt: "desc" } }
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
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

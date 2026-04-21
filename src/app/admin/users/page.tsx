import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";
import { UserTable } from "@/components/admin/UserTable";
import { getSignedUrl } from "@/lib/storage";

export default async function UserManagement() {
  const usersRaw = await prisma.user.findMany({
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

  // Generate signed URLs for users with ID photos
  const users = await Promise.all(usersRaw.map(async (u) => {
    if (u.idCardUrl && !u.idCardUrl.startsWith('http')) {
      const signedUrl = await getSignedUrl(u.idCardUrl);
      return { ...u, idCardUrl: signedUrl };
    }
    return u;
  }));

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

        <UserTable initialUsers={users} />
    </div>
  );
}

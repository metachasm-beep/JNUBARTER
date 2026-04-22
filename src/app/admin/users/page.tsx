import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";
import { UserTable } from "@/components/admin/UserTable";
import { getSignedUrl } from "@/lib/storage";
import { ErrorBoundary } from "react-error-boundary";

export const dynamic = "force-dynamic";

export default async function UserManagement() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        reputation: true,
        isVerified: true,
        idCardUrl: true,
        createdAt: true,
      },
    });

    // Fetch counts and reports separately if needed, or just let them be undefined for now
    const usersWithStats = users.map(u => ({
      ...u,
      _count: { listings: 0, swapsInitiated: 0, swapsReceived: 0 },
      verificationReports: []
    }));

    console.log(`[AdminUsers] SERVER: Fetched ${users.length} users.`);

    return (
    <div className="space-y-12 pb-24">
      <header className="flex items-end justify-between border-b border-stone-200 pb-12">
        <div className="space-y-2">
          <h2 className="text-6xl font-extrabold tracking-tighter text-primary uppercase italic leading-none flex items-center gap-4">
            Peer<br />Network
            <span className="text-2xl opacity-20">[{users.length}]</span>
          </h2>
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

        <ErrorBoundary fallback={<div className="p-12 text-center text-red-500 font-mono text-[10px] uppercase">Rendering Error: Component Crash Detected</div>}>
          <UserTable initialUsers={usersWithStats} />
        </ErrorBoundary>
      </div>
    );
  } catch (err: any) {
    console.error("[AdminUsers] FAILED to load Peer Registry:", err.message);
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-sm font-black text-red-500 uppercase italic">Registry Load Failed</p>
        <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Check server logs for details.</p>
      </div>
    );
  }
}

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Shield, Users, Package, Activity, LogOut, LayoutDashboard, RefreshCw } from "lucide-react";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Emergency whitelist check to prevent loops if session data flickers
  const isWhitelisted = session?.user?.email === "metachasm@gmail.com";

  if (!session || (session.user.role !== "ADMIN" && !isWhitelisted)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col fixed h-full z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
             <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-sans font-black tracking-tighter text-primary text-xl uppercase italic">Barter</h1>
            <p className="text-[10px] font-mono font-bold text-accent uppercase tracking-[0.2em]">Command Center</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 pt-8">
          <AdminNavLink href="/admin" icon={<LayoutDashboard className="h-4 w-4" />} label="Overview" tooltip="Global Network Intelligence" />
          <AdminNavLink href="/admin/users" icon={<Users className="h-4 w-4" />} label="Peer Network" tooltip="Identity and Reputation Matrix" />
          <AdminNavLink href="/admin/listings" icon={<Package className="h-4 w-4" />} label="Registry Moderation" tooltip="Asset and Commodity Control" />
          <AdminNavLink href="/admin/logs" icon={<Activity className="h-4 w-4" />} label="System Pulse" tooltip="Infrastructure and Security Audit" />
          <AdminNavLink href="/admin/dummy" icon={<RefreshCw className="h-4 w-4" />} label="Asset Manager" tooltip="Simulated Density Control" />
        </nav>

        <div className="p-4 border-t border-stone-100">
           <Link href="/" className="flex items-center gap-3 p-4 rounded-2xl text-stone-400 hover:text-primary transition-colors group tooltip-container w-full">
              <LogOut className="h-4 w-4" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Exit Control</span>
              <div className="tooltip-content">De-authenticate from Terminal</div>
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12">
        {children}
      </main>
    </div>
  );
}

function AdminNavLink({ href, icon, label, tooltip }: { href: string; icon: React.ReactNode; label: string; tooltip?: string }) {
  return (
    <div className="tooltip-container w-full">
      <Link 
        href={href}
        className="flex items-center gap-4 px-6 py-4 rounded-2xl text-stone-400 hover:bg-stone-50 hover:text-primary transition-all group w-full"
      >
        <div className="group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">{label}</span>
      </Link>
      {tooltip && <div className="tooltip-content">{tooltip}</div>}
    </div>
  );
}

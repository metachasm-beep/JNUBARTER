"use client";

import { Home, Search, PlusSquare, MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Shield, LogOut, LayoutDashboard, Users, Package, Activity, Database } from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Registry", href: "/" },
  { icon: Search, label: "Explore", href: "/" },
  { icon: PlusSquare, label: "Exchange", href: "/" },
  { icon: MessageSquare, label: "Flux", href: "/" },
];

const ADMIN_NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin", tooltip: "Command Center" },
  { icon: Users, label: "Peers", href: "/admin/users", tooltip: "Peer Network" },
  { icon: Package, label: "Mod", href: "/admin/listings", tooltip: "Registry Moderation" },
];

export function BottomNav() {
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    window.location.href = href;
  };

  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const isAdminRoute = pathname.startsWith("/admin");
  const items = isAdminRoute ? ADMIN_NAV_ITEMS : NAV_ITEMS.map(i => ({ ...i, tooltip: i.label }));

  return (
    <div className="fixed bottom-12 left-0 right-0 z-[99999] px-6 pointer-events-none">
      <div className={`${isAdminRoute ? "max-w-lg" : "max-w-md"} mx-auto pointer-events-auto`}>
        <nav className="flex items-center justify-between p-4 px-10 bg-white/90 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-full border-2 border-primary/20">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <div key={item.label} className="tooltip-container tooltip-top">
                <button 
                  onClick={() => handleNavigation(item.href)}
                  className="relative group flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 focus:outline-none"
                >
                  <div
                    className={`transition-colors duration-300 ${
                      isActive ? "text-primary scale-110" : "text-zinc-400 group-hover:text-zinc-600"
                    }`}
                  >
                    <Icon className="h-7 w-7" strokeWidth={isActive ? 3 : 2} />
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-dot-active"
                      className="absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-primary"
                    />
                  )}
                </button>
                <div className="tooltip-content">{(item as any).tooltip}</div>
              </div>
            );
          })}

          {isAdmin && !isAdminRoute && (
            <div className="tooltip-container tooltip-top">
              <button 
                onClick={() => handleNavigation("/admin")}
                className="relative group flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 focus:outline-none text-zinc-400"
              >
                <Shield className="h-7 w-7" strokeWidth={2} />
              </button>
              <div className="tooltip-content">Admin HQ</div>
            </div>
          )}

          {isAdminRoute && (
            <div className="tooltip-container tooltip-top">
              <button 
                onClick={() => handleNavigation("/")}
                className="relative group flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 focus:outline-none text-accent"
              >
                <Home className="h-7 w-7" strokeWidth={2} />
              </button>
              <div className="tooltip-content">Public Registry</div>
            </div>
          )}

          {session && (
            <div className="tooltip-container tooltip-top">
              <button 
                onClick={() => signOut()}
                className="relative group flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 focus:outline-none text-zinc-400 hover:text-destructive"
              >
                <LogOut className="h-7 w-7" strokeWidth={2} />
              </button>
              <div className="tooltip-content">Sign Out</div>
            </div>
          )}

          <div className="tooltip-container tooltip-top">
            <button 
              onClick={() => handleNavigation("/")}
              className="relative group flex flex-col items-center justify-center p-1 rounded-full transition-all duration-300 focus:outline-none overflow-hidden"
            >
              {session?.user?.image ? (
                <div className={`h-10 w-10 rounded-full border-2 transition-all duration-300 ${pathname === "/profile" ? "border-primary" : "border-transparent group-hover:border-zinc-200"}`}>
                  <Image 
                    src={session.user.image} 
                    alt="Profile" 
                    width={40} 
                    height={40} 
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className={`p-2 transition-colors duration-300 ${pathname === "/setup" ? "text-primary" : "text-zinc-400"}`}>
                  <User className="h-7 w-7" />
                </div>
              )}
            </button>
            <div className="tooltip-content">Node Settings</div>
          </div>
        </nav>
      </div>
    </div>
  );
}

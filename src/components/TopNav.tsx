"use client";

import React, { useRef } from "react";
import { 
  Home, 
  Search, 
  PlusSquare, 
  MessageSquare, 
  User, 
  Shield, 
  LogOut, 
  LayoutDashboard, 
  Users, 
  Package 
} from "lucide-react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  MotionValue
} from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// --- DOCK COMPONENTS ---

interface NavItemProps {
  icon: any;
  label: string;
  href: string;
  isActive: boolean;
  mouseX: MotionValue<number>;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, href, isActive, onClick }: Omit<NavItemProps, 'mouseX'>) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-500 group",
        isActive 
          ? "bg-primary text-accent shadow-lg shadow-primary/20 scale-105" 
          : "text-stone-400 hover:text-primary hover:bg-stone-50"
      )}
    >
      <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "stroke-[2.5]" : "stroke-2")} />
      <span className="text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap">
        {label}
      </span>
      {isActive && (
        <motion.div 
          layoutId="active-pill-glow"
          className="absolute inset-0 rounded-full bg-accent/5 ring-1 ring-accent/20 -z-10"
        />
      )}
    </button>
  );
};

// --- MAIN TOPNAV ---

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN" || session?.user?.email === "metachasm@gmail.com";
  const isAdminRoute = pathname.startsWith("/admin");

  const handleNavigation = (href: string, scrollId?: string) => {
    if (pathname === href) {
      if (scrollId) {
        const el = document.getElementById(scrollId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      router.push(href);
      if (scrollId) {
        setTimeout(() => {
          const el = document.getElementById(scrollId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  };

  const navItems = [
    { icon: Home, label: "Registry", href: "/", onClick: () => handleNavigation("/", "market") },
    { icon: Search, label: "Explore", href: "/", onClick: () => handleNavigation("/") },
    { icon: PlusSquare, label: "Exchange", href: "/setup", onClick: () => handleNavigation("/setup") },
    { icon: MessageSquare, label: "Flux", href: "/", onClick: () => handleNavigation("/", "flux-notifications") },
  ];

  const adminItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin", onClick: () => router.push("/admin") },
    { icon: Users, label: "Peers", href: "/admin/users", onClick: () => router.push("/admin/users") },
    { icon: Package, label: "Mod", href: "/admin/listings", onClick: () => router.push("/admin/listings") },
  ];

  const currentItems = isAdminRoute ? adminItems : navItems;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[99999] px-6 py-6 flex justify-center pointer-events-none"
      style={{ top: '0', bottom: 'auto' }}
    >
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 p-2 px-3 glass-card border-iridescent rounded-full shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] h-14 pointer-events-auto"
      >
        {/* LOGO AREA */}
        <div className="pr-2 mr-1 border-r border-stone-200/50 h-full flex items-center">
           <button 
             onClick={() => handleNavigation("/")}
             className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-accent hover:bg-stone-800 transition-all shadow-md group"
           >
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
           </button>
        </div>

        {/* NAV ITEMS */}
        <div className="flex items-center gap-1 h-full">
          {currentItems.map((item) => (
            <NavItem 
              key={item.label} 
              {...item} 
              isActive={pathname === item.href} 
            />
          ))}
        </div>

        {/* SYSTEM AREA */}
        <div className="flex items-center gap-2 pl-3 ml-1 border-l border-stone-200/50 h-full">
          {isAdmin && !isAdminRoute && (
             <div className="tooltip-container tooltip-bottom">
                <button 
                  onClick={() => router.push("/admin")}
                  className="h-10 w-10 flex items-center justify-center rounded-full text-stone-400 hover:text-primary hover:bg-stone-50 transition-all"
                >
                  <Shield className="h-4 w-4" />
                </button>
                <div className="tooltip-content !text-primary !bg-white/95 border border-stone-100 font-bold">Admin HQ</div>
             </div>
          )}

          {session ? (
            <div className="flex items-center gap-2">
              <div className="tooltip-container tooltip-bottom">
                <button 
                  onClick={() => handleNavigation("/setup")}
                  className={cn(
                    "h-10 w-10 rounded-full overflow-hidden border-2 transition-all shadow-sm",
                    pathname === "/setup" ? "border-accent scale-105" : "border-transparent hover:border-accent"
                  )}
                >
                  {session.user?.image ? (
                    <Image src={session.user.image} alt="Profile" width={40} height={40} className="object-cover" />
                  ) : (
                    <div className="bg-stone-100 flex items-center justify-center h-full text-stone-400"><User className="h-4 w-4" /></div>
                  )}
                </button>
                <div className="tooltip-content !text-primary !bg-white/95 border border-stone-100 font-bold">Node Settings</div>
              </div>
              
              <div className="tooltip-container tooltip-bottom">
                <button 
                  onClick={() => signOut()}
                  className="h-10 w-10 flex items-center justify-center rounded-full text-stone-300 hover:text-destructive hover:bg-destructive/5 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                </button>
                <div className="tooltip-content !text-primary !bg-white/95 border border-stone-100 font-bold">Sign Out</div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => signIn("google")}
              className="px-6 h-10 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-stone-800 transition-all shadow-md"
            >
              Join Node
            </button>
          )}
        </div>
      </motion.nav>
    </div>
  );
}

"use client";

import React from "react";
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
  AnimatePresence
} from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: any;
  label: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, href, isActive, onClick }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 group",
        isActive 
          ? "bg-primary text-accent shadow-md scale-105" 
          : "text-stone-400 hover:text-primary hover:bg-stone-50"
      )}
    >
      <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "stroke-[2.5]" : "stroke-2")} />
      <span className="text-[10px] font-black uppercase tracking-[0.1em] whitespace-nowrap hidden md:inline-block">
        {label}
      </span>
      {isActive && (
        <motion.div 
          layoutId="nav-pill-dot"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-accent md:hidden"
        />
      )}
    </button>
  );
};

export default function MainNavigation() {
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
    <header 
      className="fixed top-6 left-0 right-0 z-[9999] px-6 flex justify-center pointer-events-none"
    >
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-0.5 p-0.5 px-1 md:p-1 md:px-2 glass-card border-iridescent rounded-full shadow-2xl h-10 md:h-11 pointer-events-auto bg-white/80"
      >
        {/* BRAND */}
        <div className="pr-2 mr-1 border-r border-stone-200/50 flex items-center">
           <button 
             onClick={() => handleNavigation("/")}
             className="h-9 w-9 flex items-center justify-center rounded-full bg-primary text-accent hover:bg-stone-800 transition-all shadow-sm"
           >
              <Home className="h-4 w-4" />
           </button>
        </div>

        {/* ITEMS */}
        <div className="flex items-center gap-0.5">
          {currentItems.map((item) => (
            <NavItem 
              key={item.label} 
              {...item} 
              isActive={pathname === item.href} 
            />
          ))}
        </div>

        {/* PROFILE/AUTH */}
        <div className="flex items-center gap-1.5 pl-2 ml-1 border-l border-stone-200/50">
          {isAdmin && !isAdminRoute && (
             <button 
               onClick={() => router.push("/admin")}
               className="h-9 w-9 flex items-center justify-center rounded-full text-stone-400 hover:text-primary hover:bg-stone-50"
             >
               <Shield className="h-4 w-4" />
             </button>
          )}

          {session ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleNavigation("/setup")}
                className={cn(
                  "h-9 w-9 rounded-full overflow-hidden border-2 transition-all",
                  pathname === "/setup" ? "border-accent" : "border-transparent hover:border-accent"
                )}
              >
                {session.user?.image ? (
                  <Image src={session.user.image} alt="Profile" width={36} height={36} className="object-cover" />
                ) : (
                  <div className="bg-stone-100 flex items-center justify-center h-full text-stone-400"><User className="h-4 w-4" /></div>
                )}
              </button>
              
              <button 
                onClick={() => signOut()}
                className="h-9 w-9 flex items-center justify-center rounded-full text-stone-300 hover:text-destructive hover:bg-destructive/5"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signIn("google")}
              className="px-5 h-9 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all shadow-sm"
            >
              Join
            </button>
          )}
        </div>
      </motion.nav>
    </header>
  );
}

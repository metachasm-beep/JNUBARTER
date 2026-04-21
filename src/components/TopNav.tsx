"use client";

import React, { useRef, useMemo } from "react";
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
  AnimatePresence,
  MotionValue
} from "framer-motion";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// --- DOCK COMPONENTS ---

interface NavItemProps {
  icon: any;
  label: string;
  href: string;
  isActive: boolean;
  mouseX: MotionValue<number>;
}

const NavItem = ({ icon: Icon, label, href, isActive, mouseX }: NavItemProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const distance = 140;
  const magnification = 60;
  const baseSize = 44;

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseSize };
    return val - rect.x - rect.width / 2;
  });

  const widthTransform = useTransform(mouseDistance, [-distance, 0, distance], [baseSize, magnification, baseSize]);
  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="tooltip-container tooltip-bottom flex items-center justify-center">
      <motion.button
        ref={ref}
        style={{ width, height: width }}
        onClick={() => (window.location.href = href)}
        className={cn(
          "relative flex items-center justify-center rounded-full transition-colors",
          isActive ? "bg-primary text-accent shadow-lg" : "bg-white/40 text-stone-400 hover:bg-white/60 hover:text-primary"
        )}
      >
        <Icon className={cn("h-1/2 w-1/2", isActive ? "stroke-[2.5]" : "stroke-2")} />
        {isActive && (
          <motion.div 
            layoutId="active-pill-dot"
            className="absolute -bottom-1 h-1 w-1 rounded-full bg-accent"
          />
        )}
      </motion.button>
      <div className="tooltip-content !text-primary !bg-white/95 !shadow-xl border border-stone-100">{label}</div>
    </div>
  );
};

// --- MAIN TOPNAV ---

const NAV_ITEMS = [
  { icon: Home, label: "Registry", href: "/" },
  { icon: Search, label: "Explore", href: "/" },
  { icon: PlusSquare, label: "Exchange", href: "/" },
  { icon: MessageSquare, label: "Flux", href: "/" },
];

const ADMIN_NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Users, label: "Peers", href: "/admin/users" },
  { icon: Package, label: "Mod", href: "/admin/listings" },
];

export function TopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const isAdminRoute = pathname.startsWith("/admin");
  const items = isAdminRoute ? ADMIN_NAV_ITEMS : NAV_ITEMS;

  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed top-6 left-0 right-0 z-[99999] px-6">
      <div className={cn("mx-auto flex justify-center", isAdminRoute ? "max-w-3xl" : "max-w-2xl")}>
        <motion.nav 
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="flex items-center gap-2 p-2 px-6 glass-card border-iridescent rounded-[2.5rem] shadow-2xl h-16"
        >
          {/* HOME BUTTON (Separate from main dock items) */}
          {!isAdminRoute && (
            <div className="pr-2 mr-2 border-r border-stone-200/50">
               <button 
                 onClick={() => window.location.href = "/"}
                 className="h-10 w-10 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
               >
                  <Home className="h-5 w-5" />
               </button>
            </div>
          )}

          {/* MAIN DOCK ITEMS */}
          <div className="flex items-center gap-2 h-full">
            {items.map((item) => (
              <NavItem 
                key={item.label} 
                {...item} 
                isActive={pathname === item.href} 
                mouseX={mouseX} 
              />
            ))}
          </div>

          {/* USER & SYSTEM AREA */}
          <div className="flex items-center gap-2 pl-4 ml-2 border-l border-stone-200/50">
            {isAdmin && !isAdminRoute && (
               <div className="tooltip-container tooltip-bottom">
                  <button 
                    onClick={() => window.location.href = "/admin"}
                    className="h-10 w-10 flex items-center justify-center rounded-full text-stone-400 hover:text-primary hover:bg-stone-100 transition-all"
                  >
                    <Shield className="h-5 w-5" />
                  </button>
                  <div className="tooltip-content !text-primary !bg-white/95 border border-stone-100">Admin HQ</div>
               </div>
            )}

            {session ? (
              <div className="flex items-center gap-2">
                <div className="tooltip-container tooltip-bottom">
                  <button 
                    onClick={() => window.location.href = "/"}
                    className="h-10 w-10 rounded-full overflow-hidden border-2 border-transparent hover:border-accent transition-all shadow-sm"
                  >
                    {session.user?.image ? (
                      <Image src={session.user.image} alt="Profile" width={40} height={40} className="object-cover" />
                    ) : (
                      <div className="bg-stone-100 flex items-center justify-center h-full text-stone-400"><User className="h-5 w-5" /></div>
                    )}
                  </button>
                  <div className="tooltip-content !text-primary !bg-white/95 border border-stone-100">Node Settings</div>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="p-2 text-stone-300 hover:text-destructive transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => window.location.href = "/api/auth/signin"}
                className="px-6 py-2 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all"
              >
                Join
              </button>
            )}
          </div>
        </motion.nav>
      </div>
    </div>
  );
}

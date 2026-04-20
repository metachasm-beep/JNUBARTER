"use client";

import { Home, Search, PlusSquare, MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Shield } from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Feed", href: "/" },
  { icon: Search, label: "Explore", href: "/" },
  { icon: PlusSquare, label: "Post", href: "/" },
  { icon: MessageSquare, label: "Inbox", href: "/" },
];

export function BottomNav() {
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    window.location.href = href;
  };

  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <div className="fixed bottom-12 left-0 right-0 z-[99999] px-6 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <nav className="flex items-center justify-between p-4 px-10 bg-white/90 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-full border-2 border-primary/20">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <button 
                key={item.label} 
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
            );
          })}

          {isAdmin && (
            <button 
              onClick={() => handleNavigation("/admin/dummy")}
              className={`relative group flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 focus:outline-none ${pathname.startsWith("/admin") ? "text-primary" : "text-zinc-400"}`}
            >
              <Shield className="h-7 w-7" strokeWidth={pathname.startsWith("/admin") ? 3 : 2} />
              {pathname.startsWith("/admin") && (
                <motion.div 
                  layoutId="nav-dot-active"
                  className="absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </button>
          )}

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
        </nav>
      </div>
    </div>
  );
}

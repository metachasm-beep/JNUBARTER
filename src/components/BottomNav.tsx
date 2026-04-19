"use client";

import { Home, Search, PlusSquare, MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { icon: Home, label: "Feed", href: "/" },
  { icon: Search, label: "Search", href: "/" }, // Set to root for now since /explore might not exist
  { icon: PlusSquare, label: "Registry", href: "/setup" },
  { icon: MessageSquare, label: "Chats", href: "/" },
  { icon: User, label: "Identity", href: "/setup" }, // Fallback to setup if profile id unknown
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    // Force standard navigation for mobile stability
    window.location.href = href;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-8 pt-4 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <nav className="flex items-center justify-between p-3 px-8 bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] border border-white/10">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <button 
                key={item.label} 
                onClick={() => handleNavigation(item.href)}
                className="relative group flex flex-col items-center gap-1 cursor-pointer focus:outline-none"
              >
                <motion.div
                  whileTap={{ scale: 0.8 }}
                  className={`p-2.5 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? "text-white bg-primary shadow-[0_0_20px_rgba(139,0,0,0.5)]" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                {isActive && (
                  <motion.div 
                    layoutId="nav-dot"
                    className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

'use client';
// DEPLOY_ID: 2026-04-23-04-47-FORCE-SYNC

import { motion } from "framer-motion";
import { 
  Home, 
  Activity, 
  User, 
  LogIn,
  LayoutGrid,
  LogOut,
  Zap
} from "lucide-react";
import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShinyText from "./bits/ShinyText";
import Dock from "./bits/Dock";
import { useRouter } from "next/navigation";

export default function MainNavigation() {
  const { data: session } = useSession();
  const router = useRouter();

  const isAdmin = (session?.user as any)?.role === "ADMIN" || session?.user?.email === "metachasm@gmail.com";

  const navItems = [];

  if (isAdmin) {
    navItems.push({
      icon: <Zap className="h-5 w-5" />,
      label: "Telemetry",
      href: "/admin" 
    });
  } else {
    navItems.push({
      icon: <Home className="h-5 w-5" />,
      label: "Registry",
      href: "/"
    });
    navItems.push({
      icon: <Activity className="h-5 w-5" />,
      label: "Flux",
      href: "/?view=flux"
    });
  }

  if (session) {
    navItems.push({
      icon: (
        <Avatar className="h-8 w-8 border-2 border-primary/10">
          <AvatarImage src={session.user?.image || ""} />
          <AvatarFallback className="bg-stone-100 text-[10px] font-black">{session.user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
      label: "Profile",
      href: "/profile"
    });
    navItems.push({
      icon: <LogOut className="h-5 w-5" />,
      label: "Sign Out",
      onClick: () => signOut({ callbackUrl: "/" }),
      className: "hover:bg-red-50 hover:text-red-500"
    } as any);
  } else {
    navItems.push({
      icon: <LogIn className="h-5 w-5" />,
      label: "Join Protocol",
      onClick: () => signIn("google"),
      className: "bg-primary text-white hover:bg-stone-800"
    } as any);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
      <div className="pointer-events-auto">
        <Dock 
          items={navItems} 
          panelHeight={60}
          magnification={80}
          distance={150}
          baseItemSize={45}
        />
      </div>
    </header>
  );
}

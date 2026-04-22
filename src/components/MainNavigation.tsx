'use client';

import { motion } from "framer-motion";
import { 
  Home, 
  Search, 
  Repeat, 
  Activity, 
  User, 
  LogIn,
  LayoutGrid
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

  const navItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Registry",
      href: "/"
    },
    {
      icon: <Search className="h-5 w-5" />,
      label: "Explore",
      href: "/#market"
    },
    {
      icon: <Repeat className="h-5 w-5" />,
      label: "Exchange",
      href: "/dashboard"
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: "Flux",
      href: "/dashboard?tab=telemetry"
    }
  ];

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

"use client";

import MainNavigation from "@/components/MainNavigation";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AppContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Only hide nav on landing page when NOT logged in
  const isPublicLanding = pathname === "/" && !session;

  return (
    <div className="relative min-h-screen">
      {!isPublicLanding && <MainNavigation />}
      <main className={`${isPublicLanding ? 'pt-0' : 'pt-24 md:pt-32'} pb-10`}>
        {children}
      </main>
    </div>
  );
}

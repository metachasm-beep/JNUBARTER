"use client";

import MainNavigation from "@/components/MainNavigation";
import { usePathname } from "next/navigation";

export default function AppContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <div className="relative min-h-screen">
      {!isLandingPage && <MainNavigation />}
      <main className={`${isLandingPage ? 'pt-0' : 'pt-24 md:pt-32'} pb-10`}>
        {children}
      </main>
    </div>
  );
}

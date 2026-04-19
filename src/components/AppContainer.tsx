"use client";

import { BottomNav } from "@/components/BottomNav";

export default function AppContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <main className="pb-32">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

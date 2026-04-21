import MainNavigation from "@/components/MainNavigation";

export default function AppContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <MainNavigation />
      <main className="pt-24 md:pt-32 pb-10">
        {children}
      </main>
    </div>
  );
}

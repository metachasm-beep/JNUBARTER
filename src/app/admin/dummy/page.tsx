"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/ListingCard";
import { toast } from "sonner";
import { Loader2, Trash2, Database, Sparkles } from "lucide-react";

export default function AdminDummyPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/dummy");
    if (res.ok) {
      const data = await res.json();
      setEntries(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    // We'll create a special endpoint for seeding if the script approach is hard
    const res = await fetch("/api/admin/dummy/seed", { method: "POST" });
    const data = await res.json();
    
    if (res.ok) {
      toast.success("50 dummy entries seeded successfully.");
      fetchEntries();
    } else {
      toast.error(data.error || "Seeding failed.", {
        description: data.details || "Check server logs.",
        duration: 5000,
      });
    }
    setIsSeeding(false);
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL dummy entries?")) return;
    
    const res = await fetch("/api/admin/dummy?all=true", { method: "DELETE" });
    if (res.ok) {
      toast.success("All dummy entries deleted.");
      fetchEntries();
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic text-primary">Dummy Asset Manager</h1>
            <p className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest mt-2">Network Density Controls</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleSeed} disabled={isSeeding} className="btn-premium rounded-2xl h-14 px-8 text-[10px] font-black uppercase tracking-widest">
              {isSeeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Seed 50 Entries
            </Button>
            <Button variant="destructive" onClick={handleDeleteAll} className="rounded-2xl h-14 px-8 text-[10px] font-black uppercase tracking-widest">
              <Trash2 className="h-4 w-4 mr-2" />
              Wipe System Data
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-stone-300" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {entries.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
            {entries.length === 0 && (
              <div className="col-span-full py-20 text-center glass-card rounded-[3rem] border-stone-200">
                <Database className="h-12 w-12 text-stone-200 mx-auto mb-4" />
                <p className="text-stone-400 font-mono text-[10px] uppercase font-bold">No dummy entries found in registry.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

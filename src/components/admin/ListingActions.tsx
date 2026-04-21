"use client";

import { Eye, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { ListingDrawer } from "./ListingDrawer";

export function ListingActions({ listing, listingId, title }: { listing?: any, listingId: string, title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());

      toast.success("Listing Purged", {
        description: `"${title}" has been removed from the registry.`
      });
      window.location.reload();
    } catch (err: any) {
      toast.error("Action Failed", { description: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="tooltip-container tooltip-left">
          <Button 
            onClick={() => setIsDrawerOpen(true)}
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-2xl hover:bg-stone-100 border border-stone-50 shadow-sm"
          >
            <Eye className="h-5 w-5" />
          </Button>
          <div className="tooltip-content" style={{ zIndex: 100 }}>Inspect Asset</div>
        </div>
        
        <div className="tooltip-container tooltip-left">
          <Button 
            onClick={handleDelete}
            disabled={isDeleting}
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-2xl hover:bg-red-50 hover:text-red-500 border border-stone-50 shadow-sm"
          >
            {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
          </Button>
          <div className="tooltip-content" style={{ zIndex: 100 }}>Purge Entry</div>
        </div>
      </div>

      <ListingDrawer 
        listing={listing}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}

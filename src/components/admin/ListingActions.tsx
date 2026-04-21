"use client";

import { Eye, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export function ListingActions({ listingId, title }: { listingId: string, title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    setIsDeleting(true);
    try {
      // Mocking the delete for now but with a real-feeling delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Listing Removed", {
        description: `"${title}" has been purged from the registry.`
      });
      // In a real app, we would call a server action here: revalidatePath('/admin/listings')
    } catch (err) {
      toast.error("Action Failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleView = () => {
    toast.info("Opening Inspection View", {
      description: "Loading full asset metadata and history..."
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="tooltip-container">
        <Button 
          onClick={handleView}
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-2xl hover:bg-stone-100 border border-stone-50 shadow-sm"
        >
          <Eye className="h-5 w-5" />
        </Button>
        <div className="tooltip-content">Inspect Asset</div>
      </div>
      
      <div className="tooltip-container">
        <Button 
          onClick={handleDelete}
          disabled={isDeleting}
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-2xl hover:bg-red-50 hover:text-red-500 border border-stone-50 shadow-sm"
        >
          {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
        </Button>
        <div className="tooltip-content">Purge Entry</div>
      </div>
    </div>
  );
}

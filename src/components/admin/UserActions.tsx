"use client";

import { SearchCode, UserX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export function UserActions({ userId, userName }: { userId: string, userName: string }) {
  const [isRevoking, setIsRevoking] = useState(false);

  const handleRevoke = async () => {
    if (!confirm(`Are you sure you want to revoke access for ${userName}?`)) return;
    
    setIsRevoking(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/suspend`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      
      toast.error("Access Revoked", {
        description: `${userName}'s node privileges have been suspended.`
      });
      window.location.reload();
    } catch (err) {
      toast.error("Revocation Failed");
    } finally {
      setIsRevoking(false);
    }
  };

  const handleVerify = async () => {
    toast.promise(
      (async () => {
        const res = await fetch(`/api/admin/users/${userId}/verify`, { method: "POST" });
        if (!res.ok) throw new Error(await res.text());
        // Reload to show the new "Authority Intel"
        window.location.reload();
        return await res.json();
      })(),
      {
        loading: `Initiating deep verify for ${userName}...`,
        success: "Verification Complete: Identity Authenticated",
        error: "Verification Failed: Link Timeout",
      }
    );
  };

  return (
    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
      <div className="tooltip-container tooltip-left">
        <Button 
          onClick={handleVerify}
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-2xl hover:bg-primary hover:text-white border border-stone-100"
        >
          <SearchCode className="h-5 w-5" />
        </Button>
        <div className="tooltip-content">Deep Verify</div>
      </div>
      
      <div className="tooltip-container tooltip-left">
        <Button 
          onClick={handleRevoke}
          disabled={isRevoking}
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-2xl hover:bg-red-50 hover:text-red-500 border border-stone-100"
        >
          {isRevoking ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserX className="h-5 w-5" />}
        </Button>
        <div className="tooltip-content">Revoke Access</div>
      </div>
    </div>
  );
}

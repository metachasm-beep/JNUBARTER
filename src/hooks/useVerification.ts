"use client";

import { useQuery } from "@tanstack/react-query";

export function useVerification() {
  return useQuery({
    queryKey: ["verification-status"],
    queryFn: async () => {
      const res = await fetch("/api/user/verification");
      if (!res.ok) return null;
      return res.json();
    },
    refetchInterval: 10000, // Poll every 10s if needed
  });
}

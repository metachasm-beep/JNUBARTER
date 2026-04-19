"use client";

import { useQuery } from "@tanstack/react-query";
import type { BarterChain } from "@/lib/barter-engine";

interface ChainsResponse {
  chains: BarterChain[];
}

async function fetchChains(): Promise<ChainsResponse> {
  const res = await fetch("/api/chains");
  if (!res.ok) throw new Error("Failed to fetch chains");
  return res.json();
}

export function useChains() {
  return useQuery<ChainsResponse>({
    queryKey: ["barter-chains"],
    queryFn: fetchChains,
    staleTime: 60_000,    // matches server-side 60s cache
    refetchInterval: 120_000, // refresh every 2 min
  });
}

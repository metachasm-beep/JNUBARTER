"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";
import type { Listing } from "./useListings";

interface SemanticSearchResult {
  results: Listing[];
  mode: "semantic" | "full-text-fallback";
}

async function fetchSemanticSearch(query: string): Promise<SemanticSearchResult> {
  const res = await fetch(
    `/api/listings/semantic-search?q=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export function useSemanticSearch(query: string) {
  const debouncedQuery = useDebounce(query, 400);

  return useQuery<SemanticSearchResult>({
    queryKey: ["semantic-search", debouncedQuery],
    queryFn: () => fetchSemanticSearch(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 3,
    staleTime: 60_000,
    placeholderData: (prev) => prev, // keep previous results while typing
  });
}

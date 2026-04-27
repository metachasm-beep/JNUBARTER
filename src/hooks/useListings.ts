"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

export interface ListingUser {
  id: string;
  name: string;
  school: string | null;
  hostel: string | null;
  reputation: number;
  isVerified: boolean;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  type: "OFFER" | "WANT";
  category: "SERVICE" | "COMMODITY";
  effortEstimate: "LOW" | "MEDIUM" | "HIGH" | null;
  condition: string | null;
  tags: string[];
  videoUrl: string | null;
  images: string[];
  createdAt: string;
  user: ListingUser;
}

interface ListingsPage {
  listings: Listing[];
  nextCursor: string | null;
}

interface UseListingsOptions {
  type?: "OFFER" | "WANT";
  category?: "SERVICE" | "COMMODITY";
  school?: string;
  userId?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
}

async function fetchListings(
  options: UseListingsOptions = {},
  cursor?: string
): Promise<ListingsPage> {
  const params = new URLSearchParams();
  if (options.type) params.set("type", options.type);
  if (options.category) params.set("category", options.category);
  if (options.school) params.set("school", options.school);
  if (options.userId) params.set("userId", options.userId);
  if (options.status) params.set("status", options.status);
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(`/api/listings?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

/** Paginated infinite listings hook for the discovery feed. */
export function useListings(options: UseListingsOptions = {}) {
  return useInfiniteQuery<ListingsPage>({
    queryKey: ["listings", options],
    queryFn: ({ pageParam }) =>
      fetchListings(options, pageParam as string | undefined),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    staleTime: 30_000,
  });
}

/** Single flat query — useful for non-paginated sections. */
export function useListingsFlat(options: UseListingsOptions = {}) {
  return useQuery<ListingsPage>({
    queryKey: ["listings-flat", options],
    queryFn: () => fetchListings(options),
    staleTime: 30_000,
  });
}

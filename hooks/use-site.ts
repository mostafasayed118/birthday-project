"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useSite(siteId: string | null) {
  const site = useQuery(
    (api as any).sites.getById,
    siteId ? { siteId } : "skip"
  );

  return {
    site,
    isLoading: site === undefined,
    error: null,
  };
}

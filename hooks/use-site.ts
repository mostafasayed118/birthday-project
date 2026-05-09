"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export function useSite(siteId: string | null) {
  const site = useQuery(
    api.sites.getById,
    siteId ? { siteId: siteId as Id<"sites"> } : "skip"
  );

  return {
    site,
    isLoading: site === undefined,
    error: null,
  };
}

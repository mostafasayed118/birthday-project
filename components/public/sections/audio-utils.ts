"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useConvexQueryUrl(storageIdOrUrl: string | undefined | null): string | null {
  const isValidStorageId = (id: string): boolean => {
    if (!id || typeof id !== "string") return false;
    if (id.startsWith("http") || id.startsWith("data:")) return false;
    if (id.length < 20 || id.length > 50) return false;
    return true;
  };

  const isStorageId = storageIdOrUrl && isValidStorageId(storageIdOrUrl);

  const url = useQuery(
    api.files.getFileUrl,
    isStorageId ? { storageId: storageIdOrUrl } : "skip"
  );

  if (!storageIdOrUrl) return null;
  if (isStorageId) return url ?? null;
  return storageIdOrUrl;
}

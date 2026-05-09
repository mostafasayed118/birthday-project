"use client";

import { useState, useCallback } from "react";
import type { SiteData } from "@/lib/types";

export function useDraft(initialData: SiteData | null) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  useState(() => initialData);

  const markDirty = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const markClean = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  return {
    hasUnsavedChanges,
    markDirty,
    markClean,
  };
}

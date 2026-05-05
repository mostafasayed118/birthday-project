"use client";

import { useMemo } from "react";
import type { SectionData } from "@/lib/types";

export function useSections(sections: SectionData[] | undefined) {
  const sortedSections = useMemo(() => {
    if (!sections) return [];
    return [...sections].sort((a, b) => a.order - b.order);
  }, [sections]);

  const visibleSections = useMemo(() => {
    return sortedSections.filter((s) => s.visible);
  }, [sortedSections]);

  return {
    sections: sortedSections,
    visibleSections,
    count: sortedSections.length,
    visibleCount: visibleSections.length,
  };
}

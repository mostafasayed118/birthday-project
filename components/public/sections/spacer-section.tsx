"use client";

import type { SectionProps, SpacerContent } from "@/lib/types";

export function SpacerSection({ content }: SectionProps) {
  const c = content as SpacerContent;
  return <div style={{ height: c.height || "80px" }} />;
}

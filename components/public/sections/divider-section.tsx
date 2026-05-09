"use client";

import type { SectionProps, DividerContent } from "@/lib/types";
import { WaveDivider, WaveDividerAlt, MatIcon } from "../shared-primitives";

export function DividerSection({ content, theme }: SectionProps) {
  const c = content as DividerContent;
  const color = c.color || theme.colors.border;
  const height = c.height || "100px";

  if (c.style === "ornament") {
    return (
      <div className="flex items-center justify-center gap-4 py-16 bg-surface">
        <div className="flex-1 max-w-[200px] h-px bg-primary/20" />
        <span className="text-secondary/50 text-2xl">
          <MatIcon name="favorite" decorative />
        </span>
        <div className="flex-1 max-w-[200px] h-px bg-primary/20" />
      </div>
    );
  }

  if (c.style === "gradient") {
    return <WaveDividerAlt fill="fill-surface" />;
  }

  if (c.style === "image") {
    return <WaveDivider fill="fill-surface-container-low" height={height} />;
  }

  return (
    <div className="py-16 bg-surface">
      <div className="mx-auto h-px bg-primary/10 max-w-4xl" />
    </div>
  );
}

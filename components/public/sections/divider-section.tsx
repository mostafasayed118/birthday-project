"use client";

import type { SectionProps, DividerContent } from "@/lib/types";

export function DividerSection({ content, theme }: SectionProps) {
  const c = content as DividerContent;
  const color = c.color || theme.colors.border;
  const height = c.height || "24px";

  if (c.style === "ornament") {
    return (
      <div
        className="flex items-center justify-center gap-4"
        style={{ padding: height }}
      >
        <div
          className="flex-1 max-w-24 h-px"
          style={{ backgroundColor: color }}
        />
        <span
          style={{
            fontSize: `${theme.typography.baseFontSize * 0.9}px`,
            color: theme.colors.textSecondary,
          }}
        >
          {c.ornament || "♥"}
        </span>
        <div
          className="flex-1 max-w-24 h-px"
          style={{ backgroundColor: color }}
        />
      </div>
    );
  }

  if (c.style === "gradient") {
    return (
      <div
        style={{
          height,
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        }}
      />
    );
  }

  return (
    <div style={{ padding: height }}>
      <div
        className="mx-auto"
        style={{
          height: "1px",
          backgroundColor: color,
          maxWidth: theme.spacing.containerWidth,
        }}
      />
    </div>
  );
}

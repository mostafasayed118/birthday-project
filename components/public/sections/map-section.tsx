"use client";

import type { SectionProps, MapContent } from "@/lib/types";
import { SectionContainer } from "./primitives";

export function MapSection({ content, theme }: SectionProps) {
  const c = content as MapContent;

  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    c.longitude - 0.05
  },${c.latitude - 0.05},${c.longitude + 0.05},${
    c.latitude + 0.05
  }&layer=mapnik&marker=${c.latitude},${c.longitude}`;

  return (
    <SectionContainer theme={theme}>
      <div className="overflow-hidden" style={{ borderRadius: theme.borders.cardRadius }}>
        <iframe
          title={c.label || "Map"}
          width="100%"
          style={{ height: "300px", maxHeight: "50vh", border: 0 }}
          src={embedUrl}
          loading="lazy"
        />
      </div>

      {c.showLabel && c.label && (
        <p
          className="text-center mt-4"
          style={{
            fontSize: `${theme.typography.baseFontSize * 0.95}px`,
            color: theme.colors.textSecondary,
          }}
        >
          {c.label}
        </p>
      )}
    </SectionContainer>
  );
}

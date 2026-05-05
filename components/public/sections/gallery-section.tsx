"use client";

import type { SectionProps, GalleryContent } from "@/lib/types";
import { SectionContainer, EmptySectionFallback } from "./primitives";

export function GallerySection({ content, theme }: SectionProps) {
  const c = content as GalleryContent;

  if (!c.images || c.images.length === 0) {
    return (
      <SectionContainer theme={theme}>
        <EmptySectionFallback message="No images in gallery yet" />
      </SectionContainer>
    );
  }

  const columnsMap = { 2: "1fr 1fr", 3: "repeat(3, 1fr)", 4: "repeat(4, 1fr)" };

  return (
    <SectionContainer theme={theme}>
      <div
        className="grid"
        style={{
          gridTemplateColumns: columnsMap[c.columns] || "repeat(3, 1fr)",
          gap: c.gap || "16px",
        }}
      >
        {c.images.map((image) => (
          <div key={image.id} className="group relative overflow-hidden">
            {image.storageId ? (
              <div
                className="w-full bg-cover bg-center"
                style={{
                  paddingBottom: c.layout === "masonry" ? "120%" : "100%",
                  borderRadius: theme.borders.cardRadius,
                  backgroundImage: `url(${image.storageId})`,
                }}
              />
            ) : (
              <div
                className="w-full flex items-center justify-center"
                style={{
                  paddingBottom: "100%",
                  backgroundColor: theme.colors.border,
                  borderRadius: theme.borders.cardRadius,
                }}
              >
                <span className="absolute text-xs opacity-50">No image</span>
              </div>
            )}

            {c.showCaptions && image.caption && (
              <p
                className="mt-2 text-center"
                style={{
                  fontSize: `${theme.typography.baseFontSize * 0.85}px`,
                  color: theme.colors.textSecondary,
                }}
              >
                {image.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

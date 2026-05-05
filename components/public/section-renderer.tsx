"use client";

import { useCallback, useRef } from "react";
import type { SectionData, ThemeData } from "@/lib/types";
import { getSectionComponent } from "./sections";
import { cn } from "@/lib/utils";

interface SectionRendererProps {
  section: SectionData;
  theme: ThemeData;
  isPreview?: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean;
  onSelectSection?: (sectionId: string) => void;
}

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  message: "Message",
  gallery: "Gallery",
  timeline: "Timeline",
  quote: "Quote",
  countdown: "Countdown",
  map: "Map",
  divider: "Divider",
  spacer: "Spacer",
  stats: "Stats",
  footer: "Footer",
  video: "Video",
  audio: "Audio",
};

export function SectionRenderer({
  section,
  theme,
  isPreview,
  isHighlighted,
  isSelected,
  onSelectSection,
}: SectionRendererProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isPreview || !onSelectSection) return;
      e.preventDefault();
      e.stopPropagation();
      onSelectSection(section.id);
    },
    [isPreview, onSelectSection, section.id]
  );

  if (!section.visible) return null;

  const Component = getSectionComponent(section.type);

  if (!Component) return null;

  return (
    <div
      ref={wrapperRef}
      data-section-id={section.id}
      className={cn(
        "relative transition-all duration-200",
        isPreview && "cursor-pointer",
        isHighlighted && !isSelected && "ring-2 ring-primary/40 ring-offset-1",
        isSelected && "ring-2 ring-primary ring-offset-1"
      )}
      onClick={handleClick}
    >
      <Component
        content={section.content}
        settings={section.settings}
        theme={theme}
        isPreview={isPreview}
      />

      {isPreview && isSelected && (
        <div className="absolute top-2 left-2 z-50 pointer-events-none">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground shadow-sm"
          >
            {SECTION_LABELS[section.type] || section.type}
          </span>
        </div>
      )}
    </div>
  );
}

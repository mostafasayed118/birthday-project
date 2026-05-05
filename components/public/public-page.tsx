"use client";

import type { SectionData, ThemeData } from "@/lib/types";
import { SectionRenderer } from "./section-renderer";
import { themeToCSSVariables } from "@/lib/theme-tokens";

interface PublicPageProps {
  sections: SectionData[];
  theme: ThemeData;
  isPreview?: boolean;
  highlightedSectionId?: string | null;
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
}

export function PublicPage({
  sections,
  theme,
  isPreview,
  highlightedSectionId,
  selectedSectionId,
  onSelectSection,
}: PublicPageProps) {
  const sortedSections = [...sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const cssVariables = themeToCSSVariables(theme);

  return (
    <div
      className="min-h-screen"
      style={{
        ...cssVariables,
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: `'${theme.typography.bodyFont}', sans-serif`,
        fontSize: `${theme.typography.baseFontSize}px`,
        lineHeight: theme.typography.lineHeight,
      }}
    >
      {sortedSections.length === 0 && (
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: theme.colors.textSecondary }}>
            No sections to display
          </p>
        </div>
      )}

      {sortedSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          theme={theme}
          isPreview={isPreview}
          isHighlighted={highlightedSectionId === section.id}
          isSelected={selectedSectionId === section.id}
          onSelectSection={onSelectSection}
        />
      ))}
    </div>
  );
}

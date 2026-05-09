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

import { Header, Footer } from "./shared-layout";

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
      className="festive-air-theme min-h-screen bg-background text-on-background font-body-md overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container"
      style={{
        ...cssVariables,
      }}
    >
      {!isPreview && <Header isPreview={isPreview} />}
      <main className="flex-grow">
        {sortedSections.length === 0 && (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-on-surface-variant">
              No sections to display
            </p>
          </div>
        )}

        {sortedSections.map((section) => (
          <div key={section.id} id={section.id}>
            <SectionRenderer
              section={section}
              theme={theme}
              isPreview={isPreview}
              isHighlighted={highlightedSectionId === section.id}
              isSelected={selectedSectionId === section.id}
              onSelectSection={onSelectSection}
            />
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
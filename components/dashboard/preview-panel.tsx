"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { SectionData, ViewData, ThemeData } from "@/lib/types";
import { PublicPage } from "@/components/public/public-page";
import { cn } from "@/lib/utils";
import { Monitor, Tablet, Smartphone, Eye } from "lucide-react";

interface PreviewPanelProps {
  sections: SectionData[];
  theme: ThemeData;
  viewport: ViewData;
  highlightedSectionId: string | null;
  selectedSectionId: string | null;
  onViewportChange: (v: ViewData) => void;
  onSelectSection: (sectionId: string) => void;
}

const VIEWPORT_CONFIG: Record<
  ViewData,
  { width: string; label: string; icon: React.ElementType }
> = {
  desktop: { width: "100%", label: "Desktop", icon: Monitor },
  tablet: { width: "768px", label: "Tablet", icon: Tablet },
  mobile: { width: "375px", label: "Mobile", icon: Smartphone },
};

export function PreviewPanel({
  sections,
  theme,
  viewport,
  highlightedSectionId,
  selectedSectionId,
  onViewportChange,
  onSelectSection,
}: PreviewPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  const config = VIEWPORT_CONFIG[viewport];

  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, [sections, theme]);

  const scrollToSection = useCallback((sectionId: string) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const sectionEl = container.querySelector(
      `[data-section-id="${sectionId}"]`
    );
    if (!sectionEl) return;

    const containerRect = container.getBoundingClientRect();
    const sectionRect = sectionEl.getBoundingClientRect();
    const scrollTop = container.scrollTop;
    const offset = sectionRect.top - containerRect.top + scrollTop - 16;

    container.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (selectedSectionId) {
      scrollToSection(selectedSectionId);
    }
  }, [selectedSectionId, scrollToSection]);

  const handlePreviewClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest(
        "a, button, input, textarea, select, [role='button']"
      )
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const sortedSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-border shrink-0">
        <div className="flex items-center gap-1.5">
          <Eye className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-medium">Preview</span>
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium">
            Draft
          </span>
        </div>
        <div className="flex gap-0.5 bg-muted rounded-md p-0.5">
          {(Object.keys(VIEWPORT_CONFIG) as ViewData[]).map((v) => {
            const ViewIcon = VIEWPORT_CONFIG[v].icon;
            return (
              <button
                key={v}
                className={cn(
                  "flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors",
                  viewport === v
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onViewportChange(v)}
                title={VIEWPORT_CONFIG[v].label}
              >
                <ViewIcon className="h-3 w-3" />
                <span className="hidden lg:inline">
                  {VIEWPORT_CONFIG[v].label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto flex justify-center bg-muted/50"
      >
        <div className="w-full p-4 flex justify-center">
          <div
            onClick={handlePreviewClick}
            className={cn(
              "bg-background border border-border rounded-lg overflow-auto shadow-sm transition-all duration-300",
              viewport !== "desktop" && "ring-1 ring-black/5"
            )}
            style={{
              width: config.width,
              maxWidth: "100%",
              minHeight: viewport === "desktop" ? "100%" : undefined,
            }}
          >
            {!isReady ? (
              <div
                className="flex items-center justify-center"
                style={{ minHeight: "400px" }}
              >
                <div className="text-center space-y-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    Loading preview...
                  </p>
                </div>
              </div>
            ) : sortedSections.length === 0 ? (
              <div
                className="flex items-center justify-center"
                style={{ minHeight: "400px" }}
              >
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    No sections yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Add sections from the left panel
                  </p>
                </div>
              </div>
            ) : (
              <PublicPage
                sections={sections}
                theme={theme}
                isPreview={true}
                highlightedSectionId={highlightedSectionId}
                selectedSectionId={selectedSectionId}
                onSelectSection={onSelectSection}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

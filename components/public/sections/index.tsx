import type { SectionType } from "@/lib/types";
import { initializeRegistry, getPublicRenderer, getAllSectionTypes } from "@/lib/section-registry";
import "@/lib/section-entries";

// Initialize registry (dynamic import handled in registry)
initializeRegistry();

export function getSectionComponent(type: SectionType) {
  return getPublicRenderer(type) || FallbackPlaceholder;
}

export function getRegisteredSectionTypes(): SectionType[] {
  return getAllSectionTypes();
}

function FallbackPlaceholder() {
  return (
    <section className="py-8 px-8">
      <div className="text-center text-sm opacity-50">
        Unknown section type
      </div>
    </section>
  );
}

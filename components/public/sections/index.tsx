import type { SectionType, SectionProps } from "@/lib/types";
import { HeroSection } from "./hero-section";
import { MessageSection } from "./message-section";
import { GallerySection } from "./gallery-section";
import { TimelineSection } from "./timeline-section";
import { QuoteSection } from "./quote-section";
import { CountdownSection } from "./countdown-section";
import { MapSection } from "./map-section";
import { DividerSection } from "./divider-section";
import { SpacerSection } from "./spacer-section";
import { StatsSection } from "./stats-section";
import { FooterSection } from "./footer-section";
import { VideoSection } from "./video-section";
import { AudioSection } from "./audio-section";

const SECTION_COMPONENTS: Record<
  SectionType,
  React.ComponentType<SectionProps>
> = {
  hero: HeroSection,
  message: MessageSection,
  gallery: GallerySection,
  timeline: TimelineSection,
  quote: QuoteSection,
  countdown: CountdownSection,
  map: MapSection,
  divider: DividerSection,
  spacer: SpacerSection,
  stats: StatsSection,
  footer: FooterSection,
  video: VideoSection,
  audio: AudioSection,
};

export function getSectionComponent(type: SectionType) {
  return SECTION_COMPONENTS[type] || FallbackPlaceholder;
}

export function getRegisteredSectionTypes(): SectionType[] {
  return Object.keys(SECTION_COMPONENTS) as SectionType[];
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

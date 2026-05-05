"use client";

import type { SectionType, SectionContent, SectionSettings } from "@/lib/types";
import { HeroEditor } from "./hero-editor";
import { MessageEditor } from "./message-editor";
import { GalleryEditor } from "./gallery-editor";
import { TimelineEditor } from "./timeline-editor";
import { QuoteEditor } from "./quote-editor";
import { CountdownEditor } from "./countdown-editor";
import { MapEditor } from "./map-editor";
import { DividerEditor } from "./divider-editor";
import { SpacerEditor } from "./spacer-editor";
import { StatsEditor } from "./stats-editor";
import { FooterEditor } from "./footer-editor";
import { VideoEditor } from "./video-editor";
import { AudioEditor } from "./audio-editor";

interface SectionEditorProps {
  sectionType: SectionType;
  content: SectionContent;
  settings: SectionSettings;
  onUpdateContent: (content: SectionContent) => void;
  onUpdateSettings: (settings: SectionSettings) => void;
}

export function SectionEditor({
  sectionType,
  content,
  settings,
  onUpdateContent,
  onUpdateSettings,
}: SectionEditorProps) {
  switch (sectionType) {
    case "hero":
      return <HeroEditor content={content} onUpdate={onUpdateContent} />;
    case "message":
      return <MessageEditor content={content} onUpdate={onUpdateContent} />;
    case "gallery":
      return <GalleryEditor content={content} onUpdate={onUpdateContent} />;
    case "timeline":
      return <TimelineEditor content={content} onUpdate={onUpdateContent} />;
    case "quote":
      return <QuoteEditor content={content} onUpdate={onUpdateContent} />;
    case "countdown":
      return <CountdownEditor content={content} onUpdate={onUpdateContent} />;
    case "map":
      return <MapEditor content={content} onUpdate={onUpdateContent} />;
    case "divider":
      return <DividerEditor content={content} onUpdate={onUpdateContent} />;
    case "spacer":
      return <SpacerEditor content={content} onUpdate={onUpdateContent} />;
    case "stats":
      return <StatsEditor content={content} onUpdate={onUpdateContent} />;
    case "footer":
      return <FooterEditor content={content} onUpdate={onUpdateContent} />;
    case "video":
      return <VideoEditor content={content} onUpdate={onUpdateContent} />;
    case "audio":
      return <AudioEditor content={content} onUpdate={onUpdateContent} />;
    default:
      return (
        <div className="rounded-md border border-dashed border-border p-6 text-center space-y-2">
          <p className="text-sm font-medium capitalize">{sectionType} Editor</p>
          <p className="text-xs text-muted-foreground">
            No editor available for this section type.
          </p>
        </div>
      );
  }
}

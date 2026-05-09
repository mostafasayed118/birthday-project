"use client";

import { createElement } from "react";
import type { SectionType, SectionContent, SectionSettings } from "@/lib/types";
import { initializeRegistry, getEditorComponent, getSectionLabel } from "@/lib/section-registry";
import { AnimationSettingsEditor } from "./animation-settings-editor";
import { Separator } from "@/components/ui/separator";
import "@/lib/section-entries";

initializeRegistry();

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
  const Editor = getEditorComponent(sectionType);

  if (Editor) {
    return (
      <div className="space-y-6">
        {createElement(Editor, { content, onUpdate: onUpdateContent })}
        <Separator />
        <AnimationSettingsEditor settings={settings} onUpdate={onUpdateSettings} />
      </div>
    );
  }

  return (
    <div className="rounded-md border border-dashed border-border p-6 text-center space-y-2">
      <p className="text-sm font-medium capitalize">{getSectionLabel(sectionType)} Editor</p>
      <p className="text-xs text-muted-foreground">
        No editor available for this section type.
      </p>
    </div>
  );
}

export { AnimationSettingsEditor };
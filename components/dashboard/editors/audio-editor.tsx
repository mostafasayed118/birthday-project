"use client";

import type { AudioContent, SectionContent } from "@/lib/types";
import { TextField, SwitchField, EditorDivider } from "./fields";

interface AudioEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function AudioEditor({ content, onUpdate }: AudioEditorProps) {
  const c = content as AudioContent;

  function update(updates: Partial<AudioContent>) {
    onUpdate({ ...c, ...updates });
  }

  return (
    <div className="space-y-4">
      <TextField
        label="Audio URL"
        value={c.url}
        onChange={(v) => update({ url: v })}
        placeholder="https://... (MP3, WAV, OGG)"
        description="Direct link to an audio file"
      />

      <TextField
        label="Title"
        value={c.title || ""}
        onChange={(v) => update({ title: v })}
        placeholder="e.g., Our Song"
      />

      <EditorDivider />

      <SwitchField
        label="Show Player"
        checked={c.showPlayer}
        onCheckedChange={(v) => update({ showPlayer: v })}
        description="Display the audio player controls on the page"
      />

      {c.url && c.showPlayer && (
        <div className="rounded-md bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground mb-2">Preview</p>
          <div className="rounded-md border border-border bg-background p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs">&#9654;</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium">{c.title || "Audio"}</p>
              <div className="h-1 bg-muted rounded-full mt-1">
                <div className="h-full w-0 bg-primary rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

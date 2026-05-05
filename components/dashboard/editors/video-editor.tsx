"use client";

import type { VideoContent, SectionContent } from "@/lib/types";
import { TextField, SwitchField, EditorDivider } from "./fields";

interface VideoEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function VideoEditor({ content, onUpdate }: VideoEditorProps) {
  const c = content as VideoContent;

  function update(updates: Partial<VideoContent>) {
    onUpdate({ ...c, ...updates });
  }

  return (
    <div className="space-y-4">
      <TextField
        label="Video URL"
        value={c.url}
        onChange={(v) => update({ url: v })}
        placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
        description="YouTube, Vimeo, or direct video URL"
      />

      <TextField
        label="Thumbnail URL"
        value={c.thumbnail || ""}
        onChange={(v) => update({ thumbnail: v })}
        placeholder="Optional poster image URL"
        description="Shown before the video plays"
      />

      <EditorDivider />

      <div className="space-y-3">
        <SwitchField
          label="Autoplay"
          checked={c.autoplay}
          onCheckedChange={(v) => update({ autoplay: v })}
          description="Start playing automatically (may be muted by browser)"
        />

        <SwitchField
          label="Muted"
          checked={c.muted}
          onCheckedChange={(v) => update({ muted: v })}
          description="Start with sound off"
        />
      </div>

      {c.url && (
        <div className="rounded-md bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground mb-2">Preview</p>
          <div className="aspect-video rounded-md border border-border bg-background flex items-center justify-center">
            <p className="text-xs text-muted-foreground">
              Video preview will render on the page
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

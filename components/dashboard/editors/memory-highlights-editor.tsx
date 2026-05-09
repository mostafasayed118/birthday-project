"use client";

import type { MemoryHighlightsContent, SectionContent } from "@/lib/types";
import { TextField, TextareaField } from "./fields";
import { ImageUpload } from "../image-upload";

interface MemoryHighlightsEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function MemoryHighlightsEditor({ content, onUpdate }: MemoryHighlightsEditorProps) {
  const c = content as MemoryHighlightsContent;

  function update(updates: Partial<MemoryHighlightsContent>) {
    onUpdate({ ...c, ...updates });
  }

  return (
    <div className="space-y-4">
      <TextField
        label="Heading"
        value={c.heading}
        onChange={(v) => update({ heading: v })}
        placeholder="e.g., A Year of Beautiful Light"
      />

      <TextareaField
        label="Body"
        value={c.body}
        onChange={(v) => update({ body: v })}
        placeholder="Describe this memory highlight..."
        rows={4}
      />

      <TextField
        label="Sign-off"
        value={c.signoff}
        onChange={(v) => update({ signoff: v })}
        placeholder="e.g., Cheers to many more"
      />

      <ImageUpload
        label="Highlight Image"
        value={c.image}
        onChange={(v) => update({ image: v })}
        description="The main image for this memory highlight"
      />
    </div>
  );
}

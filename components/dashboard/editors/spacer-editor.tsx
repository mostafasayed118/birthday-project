"use client";

import type { SpacerContent, SectionContent } from "@/lib/types";
import { TextField } from "./fields";

interface SpacerEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function SpacerEditor({ content, onUpdate }: SpacerEditorProps) {
  const c = content as SpacerContent;

  function update(updates: Partial<SpacerContent>) {
    onUpdate({ ...c, ...updates });
  }

  return (
    <div className="space-y-4">
      <TextField
        label="Height"
        value={c.height}
        onChange={(v) => update({ height: v })}
        placeholder="e.g., 80px"
        description="Vertical space this section occupies"
      />

      <div className="rounded-md bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">
          Preview: {c.height || "80px"} of vertical space
        </p>
        <div
          className="mt-2 border border-dashed border-border rounded"
          style={{ height: c.height || "80px" }}
        />
      </div>
    </div>
  );
}

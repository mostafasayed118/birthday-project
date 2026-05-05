"use client";

import type { DividerContent, SectionContent } from "@/lib/types";
import { TextField, SelectField, ColorField } from "./fields";

interface DividerEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function DividerEditor({ content, onUpdate }: DividerEditorProps) {
  const c = content as DividerContent;

  function update(updates: Partial<DividerContent>) {
    onUpdate({ ...c, ...updates });
  }

  return (
    <div className="space-y-4">
      <SelectField
        label="Style"
        value={c.style}
        onValueChange={(v) =>
          update({ style: v as "line" | "ornament" | "gradient" | "image" })
        }
        options={[
          { value: "line", label: "Simple Line" },
          { value: "ornament", label: "Ornament" },
          { value: "gradient", label: "Gradient Fade" },
          { value: "image", label: "Image" },
        ]}
      />

      {c.style === "ornament" && (
        <TextField
          label="Ornament"
          value={c.ornament || ""}
          onChange={(v) => update({ ornament: v })}
          placeholder="e.g., hearts, stars, or any text/emoji"
          description="Text or emoji displayed as the divider ornament"
        />
      )}

      <ColorField
        label="Color"
        value={c.color || "#e5e7eb"}
        onChange={(v) => update({ color: v })}
        description="Override the default divider color"
      />

      <TextField
        label="Height"
        value={c.height || ""}
        onChange={(v) => update({ height: v })}
        placeholder="e.g., 24px"
        description="Vertical spacing for the divider"
      />
    </div>
  );
}

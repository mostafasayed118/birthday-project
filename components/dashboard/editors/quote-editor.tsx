"use client";

import type { QuoteContent, SectionContent } from "@/lib/types";
import {
  TextField,
  TextareaField,
  SelectField,
  EditorDivider,
} from "./fields";
import { ImageUpload } from "../image-upload";

interface QuoteEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function QuoteEditor({ content, onUpdate }: QuoteEditorProps) {
  const c = content as QuoteContent;

  function update(updates: Partial<QuoteContent>) {
    onUpdate({ ...c, ...updates });
  }

  return (
    <div className="space-y-4">
      <TextareaField
        label="Quote Text"
        value={c.text}
        onChange={(v: string) => update({ text: v })}
        placeholder="Enter the quote..."
        rows={3}
      />

      <TextField
        label="Author"
        value={c.author || ""}
        onChange={(v) => update({ author: v })}
        placeholder="Who said this?"
      />

      <EditorDivider />

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Style"
          value={c.style}
          onValueChange={(v) =>
            update({
              style: v as "card" | "inline" | "banner" | "scripture",
            })
          }
          options={[
            { value: "card", label: "Card" },
            { value: "inline", label: "Inline" },
            { value: "banner", label: "Banner" },
            { value: "scripture", label: "Scripture" },
          ]}
        />

        <SelectField
          label="Background Style"
          value={c.backgroundStyle}
          onValueChange={(v) =>
            update({ backgroundStyle: v as "solid" | "gradient" | "image" })
          }
          options={[
            { value: "solid", label: "Solid Color" },
            { value: "gradient", label: "Gradient" },
            { value: "image", label: "Image" },
          ]}
        />
      </div>

      {c.backgroundStyle === "image" && (
        <ImageUpload
          label="Background Image"
          value={c.backgroundImage || ""}
          onChange={(v) => update({ backgroundImage: v })}
        />
      )}
    </div>
  );
}

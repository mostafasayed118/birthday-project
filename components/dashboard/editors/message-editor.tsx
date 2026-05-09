"use client";

import type { MessageContent, SectionContent } from "@/lib/types";
import {
  TextField,
  TextareaField,
  SelectField,
  EditorDivider,
} from "./fields";

interface MessageEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function MessageEditor({ content, onUpdate }: MessageEditorProps) {
  const c = content as MessageContent;

  function update(updates: Partial<MessageContent>) {
    onUpdate({ ...c, ...updates });
  }

  return (
    <div className="space-y-4">
      <TextField
        label="Heading"
        value={c.heading || ""}
        onChange={(v) => update({ heading: v })}
        placeholder="Optional heading"
      />

      <TextareaField
        label="Body"
        value={c.body}
        onChange={(v) => update({ body: v })}
        placeholder="Write your message here..."
        rows={6}
      />

      <EditorDivider />

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Alignment"
          value={c.alignment}
          defaultValue="center"
          onValueChange={(v) =>
            update({ alignment: v as "left" | "center" | "right" })
          }
          options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ]}
        />

        <SelectField
          label="Font Style"
          value={c.fontStyle}
          defaultValue="default"
          onValueChange={(v) =>
            update({ fontStyle: v as "default" | "handwritten" | "elegant" })
          }
          options={[
            { value: "default", label: "Default" },
            { value: "handwritten", label: "Handwritten" },
            { value: "elegant", label: "Elegant" },
          ]}
        />
      </div>

      <TextField
        label="Max Width"
        value={c.maxWidth || ""}
        onChange={(v) => update({ maxWidth: v })}
        placeholder="e.g., 600px or 80%"
        description="Leave empty for default width"
      />
    </div>
  );
}

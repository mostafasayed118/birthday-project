"use client";

import type { CountdownContent, SectionContent } from "@/lib/types";
import {
  TextField,
  SelectField,
  SwitchField,
  EditorDivider,
} from "./fields";
import { ImageUpload } from "../image-upload";

interface CountdownEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function CountdownEditor({ content, onUpdate }: CountdownEditorProps) {
  const c = content as CountdownContent;

  function update(updates: Partial<CountdownContent>) {
    onUpdate({ ...c, ...updates });
  }

  const dateValue = c.targetDate
    ? new Date(c.targetDate).toISOString().slice(0, 16)
    : "";

  const celebration = c.celebrationAnimation || {
    type: "icon" as const,
    asset: "",
    enabled: true,
  };

  const updateCelebration = (updates: Partial<typeof celebration>) => {
    update({
      celebrationAnimation: { ...celebration, ...updates },
    });
  };

  return (
    <div className="space-y-4">
      <TextField
        label="Title"
        value={c.title || ""}
        onChange={(v) => update({ title: v })}
        placeholder="e.g., Counting Down To"
      />

      <TextField
        label="Subtitle"
        value={c.subtitle || ""}
        onChange={(v) => update({ subtitle: v })}
        placeholder="e.g., Our Special Day"
      />

      <div className="space-y-1.5">
        <label className="text-xs font-medium">Target Date &amp; Time</label>
        <input
          type="datetime-local"
          value={dateValue}
          onChange={(e) =>
            update({
              targetDate: e.target.value
                ? new Date(e.target.value).toISOString()
                : new Date().toISOString(),
            })
          }
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <TextField
        label="Expired Message"
        value={c.expiredMessage}
        onChange={(v) => update({ expiredMessage: v })}
        placeholder="Message shown when countdown reaches zero"
      />

      <EditorDivider />

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Style"
          value={c.style}
          onValueChange={(v) =>
            update({ style: v as "boxes" | "flip" | "minimal" })
          }
          options={[
            { value: "boxes", label: "Boxes" },
            { value: "flip", label: "Flip Clock" },
            { value: "minimal", label: "Minimal" },
          ]}
        />

        <SwitchField
          label="Show Labels"
          checked={c.showLabels}
          onCheckedChange={(v) => update({ showLabels: v })}
        />
      </div>

      <EditorDivider />

      <div className="space-y-3">
        <h4 className="text-xs font-medium">Celebration Animation</h4>

        <SwitchField
          label="Show Celebration on Finish"
          checked={celebration.enabled !== false}
          onCheckedChange={(v) => updateCelebration({ enabled: v })}
        />

        {celebration.enabled !== false && (
          <>
            <SelectField
              label="Animation Type"
              value={celebration.type}
              onValueChange={(v) =>
                updateCelebration({ type: v as "gif" | "image" | "icon" })
              }
              options={[
                { value: "icon", label: "Icon (Star)" },
                { value: "image", label: "Image" },
                { value: "gif", label: "GIF" },
              ]}
            />

            {(celebration.type === "image" || celebration.type === "gif") && (
              <ImageUpload
                label="Celebration Asset"
                value={celebration.asset || ""}
                onChange={(v) => updateCelebration({ asset: v })}
                description="Upload an image or GIF for the celebration animation"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

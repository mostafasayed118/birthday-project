"use client";

import type { MapContent, SectionContent } from "@/lib/types";
import { TextField, NumberField, SelectField, SwitchField, EditorDivider } from "./fields";

interface MapEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function MapEditor({ content, onUpdate }: MapEditorProps) {
  const c = content as MapContent;

  function update(updates: Partial<MapContent>) {
    onUpdate({ ...c, ...updates });
  }

  return (
    <div className="space-y-4">
      <TextField
        label="Label"
        value={c.label || ""}
        onChange={(v) => update({ label: v })}
        placeholder="e.g., Paris, France"
      />

      <EditorDivider />

      <div className="grid grid-cols-2 gap-4">
        <NumberField
          label="Latitude"
          value={c.latitude}
          onChange={(v) => update({ latitude: v })}
          min={-90}
          max={90}
          step={0.0001}
        />

        <NumberField
          label="Longitude"
          value={c.longitude}
          onChange={(v) => update({ longitude: v })}
          min={-180}
          max={180}
          step={0.0001}
        />
      </div>

      <NumberField
        label="Zoom Level"
        value={c.zoom || 12}
        onChange={(v) => update({ zoom: v })}
        min={1}
        max={20}
      />

      <EditorDivider />

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Map Style"
          value={c.mapStyle}
          onValueChange={(v) =>
            update({ mapStyle: v as "standard" | "satellite" | "terrain" })
          }
          options={[
            { value: "standard", label: "Standard" },
            { value: "satellite", label: "Satellite" },
            { value: "terrain", label: "Terrain" },
          ]}
        />

        <SwitchField
          label="Show Label"
          checked={c.showLabel}
          onCheckedChange={(v) => update({ showLabel: v })}
        />
      </div>
    </div>
  );
}

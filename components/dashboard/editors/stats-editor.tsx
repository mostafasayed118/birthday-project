"use client";

import type { StatsContent, StatItem, SectionContent } from "@/lib/types";
import {
  TextField,
  SelectField,
  SwitchField,
  EditorDivider,
  AddItemButton,
  RemoveItemButton,
  EmptyState,
} from "./fields";

interface StatsEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function StatsEditor({ content, onUpdate }: StatsEditorProps) {
  const c = content as StatsContent;

  function update(updates: Partial<StatsContent>) {
    onUpdate({ ...c, ...updates });
  }

  function updateItem(index: number, updates: Partial<StatItem>) {
    const items = [...c.items];
    items[index] = { ...items[index], ...updates };
    update({ items });
  }

  function addItem() {
    const newItem: StatItem = {
      id: crypto.randomUUID(),
      value: "0",
      label: "New Stat",
      icon: "",
    };
    update({ items: [...c.items, newItem] });
  }

  function removeItem(index: number) {
    update({ items: c.items.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <TextField
        label="Heading"
        value={c.heading || ""}
        onChange={(v) => update({ heading: v })}
        placeholder="Optional heading"
      />

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Layout"
          value={c.layout}
          onValueChange={(v) => update({ layout: v as "row" | "grid" })}
          options={[
            { value: "row", label: "Row" },
            { value: "grid", label: "Grid" },
          ]}
        />

        <SwitchField
          label="Animate on Scroll"
          checked={c.animateOnScroll}
          onCheckedChange={(v) => update({ animateOnScroll: v })}
        />
      </div>

      <EditorDivider />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Stats ({c.items.length})</h4>
        </div>

        {c.items.length === 0 ? (
          <EmptyState
            message="No stats yet. Add milestone numbers."
            actionLabel="Add Stat"
            onAction={addItem}
          />
        ) : (
          <div className="space-y-3">
            {c.items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-md border border-border p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Stat {index + 1}
                  </span>
                  <RemoveItemButton onClick={() => removeItem(index)} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    label="Value"
                    value={item.value}
                    onChange={(v) => updateItem(index, { value: v })}
                    placeholder="e.g., 365"
                  />

                  <TextField
                    label="Label"
                    value={item.label}
                    onChange={(v) => updateItem(index, { label: v })}
                    placeholder="e.g., Days Together"
                  />
                </div>

                <TextField
                  label="Icon (emoji)"
                  value={item.icon || ""}
                  onChange={(v) => updateItem(index, { icon: v })}
                  placeholder="e.g., heart, calendar, star"
                />
              </div>
            ))}

            <AddItemButton label="Add Stat" onClick={addItem} />
          </div>
        )}
      </div>
    </div>
  );
}

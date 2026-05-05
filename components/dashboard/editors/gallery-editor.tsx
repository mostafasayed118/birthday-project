"use client";

import type { GalleryContent, GalleryImage, SectionContent } from "@/lib/types";
import {
  TextField,
  SelectField,
  SwitchField,
  EditorDivider,
  AddItemButton,
  RemoveItemButton,
  EmptyState,
} from "./fields";

interface GalleryEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function GalleryEditor({ content, onUpdate }: GalleryEditorProps) {
  const c = content as GalleryContent;

  function update(updates: Partial<GalleryContent>) {
    onUpdate({ ...c, ...updates });
  }

  function updateImage(index: number, updates: Partial<GalleryImage>) {
    const images = [...c.images];
    images[index] = { ...images[index], ...updates };
    update({ images });
  }

  function addImage() {
    const newImage: GalleryImage = {
      id: crypto.randomUUID(),
      storageId: "",
      caption: "",
      alt: "",
    };
    update({ images: [...c.images, newImage] });
  }

  function removeImage(index: number) {
    update({ images: c.images.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Layout"
          value={c.layout}
          onValueChange={(v) =>
            update({ layout: v as "grid" | "masonry" | "carousel" | "stack" })
          }
          options={[
            { value: "grid", label: "Grid" },
            { value: "masonry", label: "Masonry" },
            { value: "carousel", label: "Carousel" },
            { value: "stack", label: "Stack" },
          ]}
        />

        <SelectField
          label="Columns"
          value={String(c.columns)}
          onValueChange={(v) => update({ columns: parseInt(v) as 2 | 3 | 4 })}
          options={[
            { value: "2", label: "2 Columns" },
            { value: "3", label: "3 Columns" },
            { value: "4", label: "4 Columns" },
          ]}
        />
      </div>

      <TextField
        label="Gap"
        value={c.gap}
        onChange={(v) => update({ gap: v })}
        placeholder="e.g., 16px"
      />

      <SwitchField
        label="Show Captions"
        checked={c.showCaptions}
        onCheckedChange={(v) => update({ showCaptions: v })}
      />

      <EditorDivider />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Images ({c.images.length})</h4>
        </div>

        {c.images.length === 0 ? (
          <EmptyState
            message="No images yet. Add images to your gallery."
            actionLabel="Add Image"
            onAction={addImage}
          />
        ) : (
          <div className="space-y-3">
            {c.images.map((image, index) => (
              <div
                key={image.id}
                className="rounded-md border border-border p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Image {index + 1}
                  </span>
                  <RemoveItemButton onClick={() => removeImage(index)} />
                </div>

                <TextField
                  label="Image URL"
                  value={image.storageId}
                  onChange={(v) => updateImage(index, { storageId: v })}
                  placeholder="https://... or upload later"
                />

                <TextField
                  label="Caption"
                  value={image.caption || ""}
                  onChange={(v) => updateImage(index, { caption: v })}
                  placeholder="Optional caption"
                />

                <TextField
                  label="Alt Text"
                  value={image.alt || ""}
                  onChange={(v) => updateImage(index, { alt: v })}
                  placeholder="Accessibility description"
                />
              </div>
            ))}

            <AddItemButton label="Add Image" onClick={addImage} />
          </div>
        )}
      </div>
    </div>
  );
}

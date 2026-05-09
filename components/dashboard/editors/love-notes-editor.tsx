"use client";

import type { LoveNotesContent, LoveNoteItem, SectionContent } from "@/lib/types";
import { TextField, TextareaField, SelectField, EditorDivider, AddItemButton, RemoveItemButton, EmptyState } from "./fields";

interface LoveNotesEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function LoveNotesEditor({ content, onUpdate }: LoveNotesEditorProps) {
  const c = content as LoveNotesContent;

  function update(updates: Partial<LoveNotesContent>) {
    onUpdate({ ...c, ...updates });
  }

  function updateNote(index: number, updates: Partial<LoveNoteItem>) {
    const notes = [...c.notes];
    notes[index] = { ...notes[index], ...updates };
    update({ notes });
  }

  function addNote() {
    const newNote: LoveNoteItem = {
      id: crypto.randomUUID(),
      initial: "?",
      name: "Name",
      message: "Your message here...",
      colorScheme: "primary",
    };
    update({ notes: [...c.notes, newNote] });
  }

  function removeNote(index: number) {
    update({ notes: c.notes.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <TextField
        label="Heading"
        value={c.heading}
        onChange={(v) => update({ heading: v })}
        placeholder="e.g., Love Notes"
      />

      <TextField
        label="Subtitle"
        value={c.subtitle}
        onChange={(v) => update({ subtitle: v })}
        placeholder="e.g., Messages from those who adore you."
      />

      <EditorDivider />

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Notes ({c.notes.length})</h4>

        {c.notes.length === 0 ? (
          <EmptyState
            message="No notes yet. Add love notes from friends and family."
            actionLabel="Add Note"
            onAction={addNote}
          />
        ) : (
          <div className="space-y-3">
            {c.notes.map((note, index) => (
              <div
                key={note.id}
                className="rounded-md border border-border p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Note {index + 1}
                  </span>
                  <RemoveItemButton onClick={() => removeNote(index)} />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <TextField
                    label="Initial"
                    value={note.initial}
                    onChange={(v) => updateNote(index, { initial: v })}
                    placeholder="J"
                  />
                  <TextField
                    label="Name"
                    value={note.name}
                    onChange={(v) => updateNote(index, { name: v })}
                    placeholder="James"
                  />
                  <SelectField
                    label="Color"
                    value={note.colorScheme}
                    onValueChange={(v) =>
                      updateNote(index, {
                        colorScheme: v as "primary" | "secondary" | "surface",
                      })
                    }
                    options={[
                      { value: "primary", label: "Primary" },
                      { value: "secondary", label: "Secondary" },
                      { value: "surface", label: "Surface" },
                    ]}
                  />
                </div>

                <TextareaField
                  label="Message"
                  value={note.message}
                  onChange={(v) => updateNote(index, { message: v })}
                  placeholder="Write a love note..."
                  rows={2}
                />
              </div>
            ))}

            <AddItemButton label="Add Note" onClick={addNote} />
          </div>
        )}
      </div>

      <EditorDivider />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="CTA Text"
          value={c.ctaText}
          onChange={(v) => update({ ctaText: v })}
          placeholder="e.g., Leave a Note"
        />
        <TextField
          label="CTA Link"
          value={c.ctaLink}
          onChange={(v) => update({ ctaLink: v })}
          placeholder="#"
        />
      </div>
    </div>
  );
}

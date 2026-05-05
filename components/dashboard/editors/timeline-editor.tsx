"use client";

import type { TimelineContent, TimelineEvent, SectionContent } from "@/lib/types";
import {
  TextField,
  TextareaField,
  SelectField,
  SwitchField,
  EditorDivider,
  AddItemButton,
  RemoveItemButton,
  EmptyState,
} from "./fields";

interface TimelineEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function TimelineEditor({ content, onUpdate }: TimelineEditorProps) {
  const c = content as TimelineContent;

  function update(updates: Partial<TimelineContent>) {
    onUpdate({ ...c, ...updates });
  }

  function updateEvent(index: number, updates: Partial<TimelineEvent>) {
    const events = [...c.events];
    events[index] = { ...events[index], ...updates };
    update({ events });
  }

  function addEvent() {
    const newEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
      title: "New Event",
      description: "",
    };
    update({ events: [...c.events, newEvent] });
  }

  function removeEvent(index: number) {
    update({ events: c.events.filter((_, i) => i !== index) });
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
          label="Layout Style"
          value={c.style}
          onValueChange={(v) =>
            update({ style: v as "vertical" | "horizontal" | "alternating" })
          }
          options={[
            { value: "vertical", label: "Vertical" },
            { value: "horizontal", label: "Horizontal" },
            { value: "alternating", label: "Alternating" },
          ]}
        />

        <div className="space-y-3">
          <SwitchField
            label="Show Dates"
            checked={c.showDates}
            onCheckedChange={(v) => update({ showDates: v })}
          />
          <SwitchField
            label="Show Images"
            checked={c.showImages}
            onCheckedChange={(v) => update({ showImages: v })}
          />
        </div>
      </div>

      <EditorDivider />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Events ({c.events.length})</h4>
        </div>

        {c.events.length === 0 ? (
          <EmptyState
            message="No events yet. Add milestones to your timeline."
            actionLabel="Add Event"
            onAction={addEvent}
          />
        ) : (
          <div className="space-y-3">
            {c.events.map((event, index) => (
              <div
                key={event.id}
                className="rounded-md border border-border p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Event {index + 1}
                  </span>
                  <RemoveItemButton onClick={() => removeEvent(index)} />
                </div>

                <TextField
                  label="Title"
                  value={event.title}
                  onChange={(v) => updateEvent(index, { title: v })}
                  placeholder="Event title"
                />

                <TextField
                  label="Date"
                  value={event.date}
                  onChange={(v) => updateEvent(index, { date: v })}
                  type="date"
                />

                <TextareaField
                  label="Description"
                  value={event.description || ""}
                  onChange={(v) => updateEvent(index, { description: v })}
                  placeholder="Describe this moment..."
                  rows={2}
                />

                <TextField
                  label="Image URL"
                  value={event.image || ""}
                  onChange={(v) => updateEvent(index, { image: v })}
                  placeholder="Optional image URL"
                />
              </div>
            ))}

            <AddItemButton label="Add Event" onClick={addEvent} />
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SECTION_TYPES } from "@/lib/constants";
import type { SectionType } from "@/lib/types";

const SECTION_DESCRIPTIONS: Record<SectionType, string> = {
  hero: "Full-width banner with title, subtitle, and background image",
  message: "Text block for letters, messages, or heartfelt writing",
  gallery: "Photo gallery with grid, masonry, or carousel layouts",
  timeline: "Relationship timeline with dates, events, and images",
  quote: "Featured quote with author attribution and styling options",
  countdown: "Real-time countdown timer to a special date",
  map: "Location map with custom marker and label",
  divider: "Visual separator between sections",
  spacer: "Empty vertical space between sections",
  stats: "Milestone numbers and statistics display",
  footer: "Page footer with closing message and links",
  video: "Embedded video player",
  audio: "Audio player for music or voice messages",
};

interface SectionTypePickerProps {
  onAdd: (type: SectionType) => void;
}

export function SectionTypePicker({ onAdd }: SectionTypePickerProps) {
  const [open, setOpen] = useState(false);

  function handleAdd(type: SectionType) {
    onAdd(type);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="w-full" />}>
        + Add Section
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
          <DialogDescription>
            Choose a section type to add to your page
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 mt-4">
          {SECTION_TYPES.map((sectionType) => (
            <button
              key={sectionType.type}
              onClick={() => handleAdd(sectionType.type)}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent text-left transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{sectionType.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {SECTION_DESCRIPTIONS[sectionType.type]}
                </div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
import { initializeRegistry, getAllSectionEntries } from "@/lib/section-registry";
import "@/lib/section-entries";
import type { SectionType } from "@/lib/types";

initializeRegistry();

interface SectionTypePickerProps {
  onAdd: (type: SectionType) => void;
}

export function SectionTypePicker({ onAdd }: SectionTypePickerProps) {
  const [open, setOpen] = useState(false);
  const entries = getAllSectionEntries();

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
          {entries.map((entry) => (
            <button
              key={entry.type}
              onClick={() => handleAdd(entry.type)}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent text-left transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{entry.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {entry.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

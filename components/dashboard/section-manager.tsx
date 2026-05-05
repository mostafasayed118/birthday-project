"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GripVertical, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SectionTypePicker } from "./section-type-picker";
import type { SectionData, SectionType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SectionManagerProps {
  siteId: string;
  sections: SectionData[];
  selectedSectionId: string | null;
  onSelect: (sectionId: string) => void;
}

function SortableSectionItem({
  section,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDelete,
}: {
  section: SectionData;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-1 p-2 rounded-md border cursor-pointer transition-colors",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:bg-accent",
        isDragging && "shadow-lg"
      )}
      onClick={onSelect}
    >
      <button
        className="cursor-grab active:cursor-grabbing p-0.5 text-muted-foreground hover:text-foreground shrink-0"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">
        {section.order + 1}
      </span>

      <span className="text-sm flex-1 truncate capitalize min-w-0">
        {section.type}
      </span>

      <button
        className="p-0.5 text-muted-foreground hover:text-foreground shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility();
        }}
        title={section.visible ? "Hide section" : "Show section"}
      >
        {section.visible ? (
          <Eye className="h-3.5 w-3.5" />
        ) : (
          <EyeOff className="h-3.5 w-3.5 text-muted-foreground/50" />
        )}
      </button>

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <button
              className="p-0.5 text-muted-foreground hover:text-destructive shrink-0"
              onClick={(e) => e.stopPropagation()}
              title="Delete section"
            />
          }
        >
          <Trash2 className="h-3.5 w-3.5" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {section.type} section? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function SectionManager({
  siteId,
  sections,
  selectedSectionId,
  onSelect,
}: SectionManagerProps) {
  const addSection = useMutation(api.sections.addSection);
  const removeSection = useMutation(api.sections.removeSection);
  const toggleVisibility = useMutation(api.sections.toggleSectionVisibility);
  const reorderSections = useMutation(api.sections.reorderSections);

  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const sectionIds = sorted.map((s) => s.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sectionIds.indexOf(active.id as string);
    const newIndex = sectionIds.indexOf(over.id as string);
    const newOrder = arrayMove(sectionIds, oldIndex, newIndex);

    reorderSections({ siteId: siteId as any, sectionIds: newOrder });
  }

  function handleAdd(type: SectionType) {
    addSection({ siteId: siteId as any, type });
  }

  function handleDelete(sectionId: string) {
    removeSection({ siteId: siteId as any, sectionId });
  }

  function handleToggleVisibility(sectionId: string) {
    toggleVisibility({ siteId: siteId as any, sectionId });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Sections</h3>
          <span className="text-xs text-muted-foreground">{sorted.length}</span>
        </div>
        <SectionTypePicker onAdd={handleAdd} />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {sorted.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-muted-foreground">
              No sections yet. Add your first section to get started.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sectionIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1">
                {sorted.map((section) => (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    isSelected={selectedSectionId === section.id}
                    onSelect={() => onSelect(section.id)}
                    onToggleVisibility={() =>
                      handleToggleVisibility(section.id)
                    }
                    onDelete={() => handleDelete(section.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

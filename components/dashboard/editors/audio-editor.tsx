"use client";

import type { AudioContent, AudioTrack, SectionContent } from "@/lib/types";
import {
  TextField,
  SwitchField,
  EditorDivider,
  AddItemButton,
} from "./fields";
import { AudioUpload } from "@/components/dashboard/audio-upload";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
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
import { GripVertical, Trash2, Star, StarOff, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

function createBlankTrack(order: number): AudioTrack {
  return {
    id: crypto.randomUUID(),
    title: "",
    artist: "",
    storageId: undefined,
    url: undefined,
    coverImage: undefined,
    duration: undefined,
    caption: undefined,
    order,
    enabled: true,
  };
}

function SortableTrackCard({
  track,
  isDefault,
  onUpdate,
  onRemove,
  onSetDefault,
}: {
  track: AudioTrack;
  isDefault: boolean;
  onUpdate: (updates: Partial<AudioTrack>) => void;
  onRemove: () => void;
  onSetDefault: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-md border p-3 space-y-3 transition-colors",
        isDefault ? "border-primary bg-primary/5" : "border-border",
        !track.enabled && "opacity-50",
        isDragging && "shadow-lg"
      )}
    >
      <div className="flex items-center gap-2">
        <button
          className="cursor-grab active:cursor-grabbing p-0.5 text-muted-foreground hover:text-foreground shrink-0"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium truncate block">
            {track.title || "Untitled Track"}
          </span>
          <span className="text-[10px] text-muted-foreground truncate block">
            {track.artist || "Unknown Artist"}
          </span>
        </div>

        <button
          className="p-0.5 text-muted-foreground hover:text-primary shrink-0"
          onClick={onSetDefault}
          title={isDefault ? "Default track" : "Set as default"}
        >
          {isDefault ? (
            <Star className="h-3.5 w-3.5 text-primary fill-primary" />
          ) : (
            <StarOff className="h-3.5 w-3.5" />
          )}
        </button>

        <button
          className="p-0.5 text-muted-foreground hover:text-foreground shrink-0"
          onClick={() => onUpdate({ enabled: !track.enabled })}
          title={track.enabled ? "Disable track" : "Enable track"}
        >
          {track.enabled ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground/50" />
          )}
        </button>

        <button
          className="p-0.5 text-muted-foreground hover:text-destructive shrink-0"
          onClick={onRemove}
          title="Remove track"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground">Title</label>
          <input
            value={track.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Track title"
            className="w-full h-7 text-xs px-2 rounded border border-border bg-background"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground">Artist</label>
          <input
            value={track.artist}
            onChange={(e) => onUpdate({ artist: e.target.value })}
            placeholder="Artist name"
            className="w-full h-7 text-xs px-2 rounded border border-border bg-background"
          />
        </div>
      </div>

      <AudioUpload
        label="Audio File"
        storageId={track.storageId || ""}
        url={track.url || ""}
        onChange={(sid, u) => onUpdate({ storageId: sid || undefined, url: u || undefined })}
      />

      <div className="space-y-1">
        <label className="text-[10px] text-muted-foreground">Cover Image URL</label>
        <input
          value={track.coverImage || ""}
          onChange={(e) => onUpdate({ coverImage: e.target.value || undefined })}
          placeholder="Optional cover image URL"
          className="w-full h-7 text-xs px-2 rounded border border-border bg-background"
        />
      </div>
    </div>
  );
}

export function AudioEditor({ content, onUpdate }: AudioEditorProps) {
  const c = content as AudioContent;

  function update(updates: Partial<AudioContent>) {
    onUpdate({ ...c, ...updates });
  }

  function updateTrack(trackId: string, updates: Partial<AudioTrack>) {
    const tracks = c.tracks.map((t) =>
      t.id === trackId ? { ...t, ...updates } : t
    );
    update({ tracks });
  }

  function removeTrack(trackId: string) {
    const tracks = c.tracks.filter((t) => t.id !== trackId);
    const updates: Partial<AudioContent> = { tracks };
    if (c.defaultTrackId === trackId) {
      updates.defaultTrackId = tracks.length > 0 ? tracks[0].id : undefined;
    }
    update(updates);
  }

  function addTrack() {
    const newTrack = createBlankTrack(c.tracks.length);
    update({ tracks: [...c.tracks, newTrack] });
  }

  function setDefaultTrack(trackId: string) {
    update({ defaultTrackId: trackId });
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = c.tracks.findIndex((t) => t.id === active.id);
    const newIndex = c.tracks.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(c.tracks, oldIndex, newIndex).map((t, i) => ({
      ...t,
      order: i,
    }));
    update({ tracks: reordered });
  }

  const trackIds = c.tracks.map((t) => t.id);

  return (
    <div className="space-y-4">
      <TextField
        label="Playlist Title"
        value={c.playlistTitle}
        onChange={(v) => update({ playlistTitle: v })}
        placeholder="Our Soundtrack"
      />

      <TextField
        label="Playlist Subtitle"
        value={c.playlistSubtitle || ""}
        onChange={(v) => update({ playlistSubtitle: v || undefined })}
        placeholder="Songs that tell our story"
      />

      <EditorDivider />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Tracks</h4>
          <span className="text-xs text-muted-foreground">{c.tracks.length}</span>
        </div>

        {c.tracks.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={trackIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {c.tracks.map((track) => (
                  <SortableTrackCard
                    key={track.id}
                    track={track}
                    isDefault={c.defaultTrackId === track.id}
                    onUpdate={(updates) => updateTrack(track.id, updates)}
                    onRemove={() => removeTrack(track.id)}
                    onSetDefault={() => setDefaultTrack(track.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="rounded-md border border-dashed border-border p-6 text-center">
            <p className="text-xs text-muted-foreground">
              No tracks yet. Add your first track to build a playlist.
            </p>
          </div>
        )}

        <AddItemButton label="Add Track" onClick={addTrack} />
      </div>

      <EditorDivider />

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Player Settings</h4>

        <SwitchField
          label="Show Player"
          checked={c.showPlayer}
          onCheckedChange={(v) => update({ showPlayer: v })}
          description="Show the audio player on the page"
        />

        <SwitchField
          label="Show Playlist"
          checked={c.showPlaylist}
          onCheckedChange={(v) => update({ showPlaylist: v })}
          description="Display the track list below the player"
        />

        <SwitchField
          label="Show Cover Image"
          checked={c.showCoverImage}
          onCheckedChange={(v) => update({ showCoverImage: v })}
          description="Display album art in the player"
        />

        <SwitchField
          label="Show Progress Bar"
          checked={c.showProgressBar}
          onCheckedChange={(v) => update({ showProgressBar: v })}
          description="Display playback progress and time"
        />

        <SwitchField
          label="Autoplay"
          checked={c.autoplay}
          onCheckedChange={(v) => update({ autoplay: v })}
          description="Start playing when the section loads"
        />

        <SwitchField
          label="Loop"
          checked={c.loop}
          onCheckedChange={(v) => update({ loop: v })}
          description="Loop back to the first track after the last one"
        />
      </div>
    </div>
  );
}

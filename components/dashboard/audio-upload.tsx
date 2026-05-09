"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Music } from "lucide-react";

interface AudioUploadProps {
  label: string;
  storageId: string;
  url: string;
  onChange: (storageId: string, url: string) => void;
  description?: string;
}

export function AudioUpload({
  label,
  storageId,
  url,
  onChange,
  description,
}: AudioUploadProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("audio/")) return;
    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId: newStorageId } = await result.json();
      onChange(newStorageId, "");
    } catch (err) {
      console.error("Audio upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  const hasAudio = storageId || url;

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>

      {hasAudio && (
        <div className="flex items-center gap-2 p-2 rounded-md border border-border bg-muted/30">
          <Music className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground flex-1 truncate">
            {storageId ? `Uploaded (${storageId.slice(0, 12)}...)` : url || "No audio"}
          </span>
          <button
            className="p-0.5 text-muted-foreground hover:text-destructive"
            onClick={() => onChange("", "")}
            type="button"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div
        className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-dashed border-border hover:border-primary/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/aac,.mp3,.wav,.ogg,.m4a,.aac"
          className="hidden"
          onChange={handleFileInput}
        />
        {isUploading ? (
          <span className="text-xs text-muted-foreground">Uploading...</span>
        ) : (
          <>
            <Upload className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">Upload audio (MP3, WAV, OGG)</span>
          </>
        )}
      </div>

      <Input
        value={url}
        onChange={(e) => onChange(storageId, e.target.value)}
        placeholder="Or paste audio URL"
        className="text-xs font-mono h-8"
      />

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

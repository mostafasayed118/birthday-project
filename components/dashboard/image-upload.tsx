"use client";

import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}

export function ImageUpload({ label, value, onChange, description }: ImageUploadProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const fileUrl = useQuery(api.files.getFileUrl, value && !value.startsWith("http") ? { storageId: value } : "skip");
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      onChange(storageId);
    } catch (err) {
      console.error("Upload failed:", err);
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

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>

      {(value && (value.startsWith("http") || fileUrl)) && (
        <div className="relative group">
          <img
            src={value.startsWith("http") ? value : (fileUrl as string)}
            alt=""
            className="w-full h-32 object-cover rounded-md border border-border"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-background text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onChange("")}
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
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
        {isUploading ? (
          <span className="text-xs text-muted-foreground">Uploading...</span>
        ) : (
          <>
            <Upload className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">Upload or drag image</span>
          </>
        )}
      </div>

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        className="text-xs font-mono h-8"
      />

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

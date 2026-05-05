"use client";

import type { HeroContent, SectionContent } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeroEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function HeroEditor({ content, onUpdate }: HeroEditorProps) {
  const c = content as HeroContent;

  function update(updates: Partial<HeroContent>) {
    onUpdate({ ...c, ...updates });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hero-title">Title</Label>
        <Input
          id="hero-title"
          value={c.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Enter hero title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-subtitle">Subtitle</Label>
        <Textarea
          id="hero-subtitle"
          value={c.subtitle || ""}
          onChange={(e) => update({ subtitle: e.target.value })}
          placeholder="Enter subtitle text"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Alignment</Label>
          <Select
            value={c.titleAlignment}
            onValueChange={(v) =>
              update({ titleAlignment: v as "left" | "center" | "right" })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Height</Label>
          <Select
            value={c.height}
            onValueChange={(v) =>
              update({ height: v as "full" | "large" | "medium" })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Screen</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-cta-text">CTA Button Text</Label>
        <Input
          id="hero-cta-text"
          value={c.ctaText || ""}
          onChange={(e) => update({ ctaText: e.target.value })}
          placeholder="e.g., Our Story"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-cta-link">CTA Button Link</Label>
        <Input
          id="hero-cta-link"
          value={c.ctaLink || ""}
          onChange={(e) => update({ ctaLink: e.target.value })}
          placeholder="e.g., #story or https://..."
        />
      </div>

      <div className="space-y-2">
        <Label>Background Image</Label>
        <div className="rounded-md border border-dashed border-border p-8 text-center">
          <p className="text-xs text-muted-foreground">
            Image upload will be available in Phase 3 (Content Editing)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hero-overlay">Overlay Opacity</Label>
          <Input
            id="hero-overlay"
            type="number"
            min={0}
            max={100}
            value={c.backgroundOverlay || 0}
            onChange={(e) =>
              update({ backgroundOverlay: parseInt(e.target.value) || 0 })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-overlay-color">Overlay Color</Label>
          <div className="flex gap-2">
            <Input
              id="hero-overlay-color"
              type="color"
              value={c.overlayColor || "#000000"}
              onChange={(e) => update({ overlayColor: e.target.value })}
              className="w-10 h-9 p-1 cursor-pointer"
            />
            <Input
              value={c.overlayColor || "#000000"}
              onChange={(e) => update({ overlayColor: e.target.value })}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

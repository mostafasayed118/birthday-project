"use client";

import type { HeroContent, SectionContent } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "../image-upload";
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
            value={c.titleAlignment || "center"}
            onValueChange={(v) =>
              update({ titleAlignment: v as "left" | "center" | "right" })
            }
            items={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ]}
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
            value={c.height || "large"}
            onValueChange={(v) =>
              update({ height: v as "full" | "large" | "medium" })
            }
            items={[
              { value: "full", label: "Full Screen" },
              { value: "large", label: "Large" },
              { value: "medium", label: "Medium" },
            ]}
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
        <Label htmlFor="hero-send-love-text">Send Love Button Text</Label>
        <Input
          id="hero-send-love-text"
          value={c.sendLoveText || ""}
          onChange={(e) => update({ sendLoveText: e.target.value })}
          placeholder="e.g., Send Love"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-heart-duration">Heart Animation Duration (ms)</Label>
        <Input
          id="hero-heart-duration"
          type="number"
          min={100}
          max={10000}
          step={100}
          value={c.heartAnimationDuration || 1000}
          onChange={(e) =>
            update({ heartAnimationDuration: parseInt(e.target.value) || 1000 })
          }
        />
        <p className="text-xs text-muted-foreground">
          Duration of the heart animation when clicking &quot;Send Love&quot; button
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-love-messages">Love Messages</Label>
        <Textarea
          id="hero-love-messages"
          value={(c.loveMessages || []).join("\n")}
          onChange={(e) =>
            update({
              loveMessages: e.target.value
                .split("\n")
                .map((m) => m.trim())
                .filter((m) => m),
            })
          }
          placeholder="One message per line - selected randomly when Send Love is clicked"
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          {(c.loveMessages || []).length} message(s) configured
        </p>
      </div>

      <ImageUpload
        label="Background Image"
        value={c.backgroundImage || ""}
        onChange={(v) => update({ backgroundImage: v })}
        description="Full-screen background image for the hero section"
      />

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

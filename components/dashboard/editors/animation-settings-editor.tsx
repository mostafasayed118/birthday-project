"use client";

import { useState } from "react";
import type { AnimationSettings } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface AnimationSettingsEditorProps {
  settings: Record<string, unknown>;
  onUpdate: (settings: Record<string, unknown>) => void;
}

const DEFAULT_ANIMATION: AnimationSettings = {
  enabled: true,
  type: "fade",
  duration: 800,
  delay: 0,
  easing: "ease-out",
};

const PRESETS: Record<string, Partial<AnimationSettings>> = {
  subtle: { type: "fade", duration: 300, delay: 0, easing: "ease-out" },
  smooth: { type: "slide", duration: 600, delay: 100, easing: "ease-in-out" },
  dramatic: { type: "scale", duration: 1000, delay: 0, easing: "ease-out" },
};

export function AnimationSettingsEditor({
  settings,
  onUpdate,
}: AnimationSettingsEditorProps) {
  const [clipboard, setClipboard] = useState<AnimationSettings | null>(null);
  const anim: AnimationSettings = { ...DEFAULT_ANIMATION, ...(settings.animation as Partial<AnimationSettings>) };

  function updateAnimation(updates: Partial<AnimationSettings>) {
    onUpdate({
      ...settings,
      animation: { ...anim, ...updates },
    });
  }

  const applyPreset = (preset: Partial<AnimationSettings>) => {
    updateAnimation(preset);
  };

  const copySettings = () => {
    setClipboard({ ...anim });
  };

  const pasteSettings = () => {
    if (clipboard) {
      updateAnimation(clipboard);
    }
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="animation-enabled" className="text-sm font-medium">
          Enable Animation
        </Label>
        <Switch
          id="animation-enabled"
          checked={anim.enabled}
          onCheckedChange={(checked) => updateAnimation({ enabled: checked })}
        />
      </div>

      {anim.enabled && (
        <>
          <div className="space-y-2">
            <Label>Presets</Label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(PRESETS).map(([name, preset]) => (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  className="capitalize"
                >
                  {name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="animation-type">Animation Type</Label>
            <Select
              value={anim.type}
              onValueChange={(v) => updateAnimation({ type: v as AnimationSettings["type"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fade">Fade</SelectItem>
                <SelectItem value="slide">Slide In</SelectItem>
                <SelectItem value="scale">Scale Up</SelectItem>
                <SelectItem value="bounce">Bounce</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="animation-duration">Duration (ms)</Label>
            <Input
              id="animation-duration"
              type="number"
              min={100}
              max={5000}
              step={50}
              value={anim.duration}
              onChange={(e) => updateAnimation({ duration: parseInt(e.target.value) || 800 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="animation-delay">Delay (ms)</Label>
            <Input
              id="animation-delay"
              type="number"
              min={0}
              max={5000}
              step={50}
              value={anim.delay}
              onChange={(e) => updateAnimation({ delay: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="animation-easing">Easing</Label>
            <Select
              value={anim.easing}
              onValueChange={(v) => updateAnimation({ easing: v as AnimationSettings["easing"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ease">Ease</SelectItem>
                <SelectItem value="ease-in">Ease In</SelectItem>
                <SelectItem value="ease-out">Ease Out</SelectItem>
                <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                <SelectItem value="linear">Linear</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Actions</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copySettings}
              >
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={pasteSettings}
                disabled={!clipboard}
              >
                Paste
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
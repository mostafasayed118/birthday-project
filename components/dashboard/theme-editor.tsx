"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, Check } from "lucide-react";
import type { ThemeData } from "@/lib/types";
import {
  DEFAULT_THEME,
  THEME_PRESETS,
  GOOGLE_FONTS,
} from "@/lib/theme-tokens";

interface ThemeEditorProps {
  siteId: string;
  theme: ThemeData;
}

const PRESET_LABELS: Record<string, string> = {
  "romantic-rose": "Romantic Rose",
  "midnight-love": "Midnight Love",
  "garden-romance": "Garden Romance",
  "classic-elegance": "Classic Elegance",
  "sunset-passion": "Sunset Passion",
  "ocean-dreams": "Ocean Dreams",
};

function findMatchingPreset(theme: ThemeData): string | null {
  for (const [id, preset] of Object.entries(THEME_PRESETS)) {
    if (
      JSON.stringify(preset.colors) === JSON.stringify(theme.colors) &&
      JSON.stringify(preset.typography) === JSON.stringify(theme.typography) &&
      JSON.stringify(preset.spacing) === JSON.stringify(theme.spacing) &&
      JSON.stringify(preset.borders) === JSON.stringify(theme.borders) &&
      JSON.stringify(preset.effects) === JSON.stringify(theme.effects)
    ) {
      return id;
    }
  }
  return null;
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded border border-border cursor-pointer shrink-0 p-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium">{label}</p>
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 h-7 text-xs font-mono"
      />
    </div>
  );
}

function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <span className="text-xs text-muted-foreground font-mono">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
}

export function ThemeEditor({ siteId, theme }: ThemeEditorProps) {
  const updateTheme = useMutation(api.themes.updateTheme);
  const applyPreset = useMutation(api.themes.applyPreset);

  const [localTheme, setLocalTheme] = useState<ThemeData>(theme);
  const [activePreset, setActivePreset] = useState<string | null>(() =>
    findMatchingPreset(theme)
  );
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalTheme(theme);
    setActivePreset(findMatchingPreset(theme));
  }, [theme]);

  const persistTheme = useCallback(
    (newTheme: ThemeData) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateTheme({ siteId: siteId as any, theme: newTheme });
      }, 300);
    },
    [siteId, updateTheme]
  );

  function updateLocal(updates: Partial<ThemeData>) {
    const newTheme = { ...localTheme, ...updates };
    setLocalTheme(newTheme);
    setActivePreset(findMatchingPreset(newTheme));
    persistTheme(newTheme);
  }

  function updateColors(updates: Partial<ThemeData["colors"]>) {
    updateLocal({ colors: { ...localTheme.colors, ...updates } });
  }

  function updateTypography(updates: Partial<ThemeData["typography"]>) {
    updateLocal({ typography: { ...localTheme.typography, ...updates } });
  }

  function updateSpacing(updates: Partial<ThemeData["spacing"]>) {
    updateLocal({ spacing: { ...localTheme.spacing, ...updates } });
  }

  function updateBorders(updates: Partial<ThemeData["borders"]>) {
    updateLocal({ borders: { ...localTheme.borders, ...updates } });
  }

  function updateEffects(updates: Partial<ThemeData["effects"]>) {
    updateLocal({ effects: { ...localTheme.effects, ...updates } });
  }

  function handlePresetSelect(presetId: string) {
    const preset = THEME_PRESETS[presetId];
    if (!preset) return;
    setLocalTheme(preset);
    setActivePreset(presetId);
    updateTheme({ siteId: siteId as any, theme: preset });
  }

  function handleResetToDefault() {
    setLocalTheme(DEFAULT_THEME);
    setActivePreset(findMatchingPreset(DEFAULT_THEME));
    updateTheme({ siteId: siteId as any, theme: DEFAULT_THEME });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Theme Editor</h3>
          {activePreset && (
            <span className="text-xs text-muted-foreground">
              {PRESET_LABELS[activePreset]}
            </span>
          )}
          {!activePreset && (
            <span className="text-xs text-amber-600 font-medium">
              Customized
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Preset Selector */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Presets</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(PRESET_LABELS).map(([id, label]) => (
              <button
                key={id}
                onClick={() => handlePresetSelect(id)}
                className={`relative flex items-center gap-2 p-2 rounded-md border text-left transition-colors ${
                  activePreset === id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent"
                }`}
              >
                <div className="flex gap-0.5">
                  <div
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: THEME_PRESETS[id].colors.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: THEME_PRESETS[id].colors.accent }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: THEME_PRESETS[id].colors.background }}
                  />
                </div>
                <span className="text-xs font-medium truncate">{label}</span>
                {activePreset === id && (
                  <Check className="h-3 w-3 text-primary absolute top-1.5 right-1.5" />
                )}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Colors */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Colors</h4>
          <div className="space-y-2">
            <ColorControl
              label="Primary"
              value={localTheme.colors.primary}
              onChange={(v) => updateColors({ primary: v })}
            />
            <ColorControl
              label="Secondary"
              value={localTheme.colors.secondary}
              onChange={(v) => updateColors({ secondary: v })}
            />
            <ColorControl
              label="Accent"
              value={localTheme.colors.accent}
              onChange={(v) => updateColors({ accent: v })}
            />
            <Separator />
            <ColorControl
              label="Background"
              value={localTheme.colors.background}
              onChange={(v) => updateColors({ background: v })}
            />
            <ColorControl
              label="Surface / Cards"
              value={localTheme.colors.surface}
              onChange={(v) => updateColors({ surface: v })}
            />
            <Separator />
            <ColorControl
              label="Text"
              value={localTheme.colors.text}
              onChange={(v) => updateColors({ text: v })}
            />
            <ColorControl
              label="Muted Text"
              value={localTheme.colors.textSecondary}
              onChange={(v) => updateColors({ textSecondary: v })}
            />
            <ColorControl
              label="Border"
              value={localTheme.colors.border}
              onChange={(v) => updateColors({ border: v })}
            />
          </div>
        </div>

        <Separator />

        {/* Typography */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Typography</h4>

          <div className="space-y-1.5">
            <Label className="text-xs">Heading Font</Label>
            <Select
              value={localTheme.typography.headingFont}
              onValueChange={(v) => {
                if (v) updateTypography({ headingFont: v });
              }}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOOGLE_FONTS.heading.map((font) => (
                  <SelectItem key={font} value={font}>
                    <span style={{ fontFamily: `'${font}', serif` }}>
                      {font}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Body Font</Label>
            <Select
              value={localTheme.typography.bodyFont}
              onValueChange={(v) => {
                if (v) updateTypography({ bodyFont: v });
              }}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOOGLE_FONTS.body.map((font) => (
                  <SelectItem key={font} value={font}>
                    <span style={{ fontFamily: `'${font}', sans-serif` }}>
                      {font}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SliderControl
            label="Base Font Size"
            value={localTheme.typography.baseFontSize}
            onChange={(v) => updateTypography({ baseFontSize: v })}
            min={12}
            max={24}
            step={1}
            unit="px"
          />

          <SliderControl
            label="Line Height"
            value={localTheme.typography.lineHeight}
            onChange={(v) => updateTypography({ lineHeight: v })}
            min={1.0}
            max={2.5}
            step={0.1}
          />

          <SliderControl
            label="Heading Scale"
            value={localTheme.typography.headingScale}
            onChange={(v) => updateTypography({ headingScale: v })}
            min={1.0}
            max={2.0}
            step={0.05}
          />

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Heading Weight</Label>
              <Select
                value={localTheme.typography.headingWeight}
                onValueChange={(v) => {
                  if (v) updateTypography({ headingWeight: v });
                }}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="400">Normal (400)</SelectItem>
                  <SelectItem value="500">Medium (500)</SelectItem>
                  <SelectItem value="600">Semibold (600)</SelectItem>
                  <SelectItem value="700">Bold (700)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Body Weight</Label>
              <Select
                value={localTheme.typography.bodyWeight}
                onValueChange={(v) => {
                  if (v) updateTypography({ bodyWeight: v });
                }}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Light (300)</SelectItem>
                  <SelectItem value="400">Normal (400)</SelectItem>
                  <SelectItem value="500">Medium (500)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Spacing */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Spacing</h4>

          <div className="space-y-1.5">
            <Label className="text-xs">Section Padding</Label>
            <Input
              value={localTheme.spacing.sectionPadding}
              onChange={(e) =>
                updateSpacing({ sectionPadding: e.target.value })
              }
              placeholder="80px"
              className="h-8 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Container Width</Label>
            <Input
              value={localTheme.spacing.containerWidth}
              onChange={(e) =>
                updateSpacing({ containerWidth: e.target.value })
              }
              placeholder="1200px"
              className="h-8 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Element Gap</Label>
            <Input
              value={localTheme.spacing.elementGap}
              onChange={(e) => updateSpacing({ elementGap: e.target.value })}
              placeholder="24px"
              className="h-8 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Card Padding</Label>
            <Input
              value={localTheme.spacing.cardPadding}
              onChange={(e) => updateSpacing({ cardPadding: e.target.value })}
              placeholder="32px"
              className="h-8 text-xs font-mono"
            />
          </div>
        </div>

        <Separator />

        {/* Borders */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Borders & Radius</h4>

          <div className="space-y-1.5">
            <Label className="text-xs">Default Radius</Label>
            <Input
              value={localTheme.borders.radius}
              onChange={(e) => updateBorders({ radius: e.target.value })}
              placeholder="8px"
              className="h-8 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Card Radius</Label>
            <Input
              value={localTheme.borders.cardRadius}
              onChange={(e) => updateBorders({ cardRadius: e.target.value })}
              placeholder="12px"
              className="h-8 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Button Radius</Label>
            <Input
              value={localTheme.borders.buttonRadius}
              onChange={(e) => updateBorders({ buttonRadius: e.target.value })}
              placeholder="8px"
              className="h-8 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Border Width</Label>
            <Input
              value={localTheme.borders.borderWidth}
              onChange={(e) => updateBorders({ borderWidth: e.target.value })}
              placeholder="1px"
              className="h-8 text-xs font-mono"
            />
          </div>
        </div>

        <Separator />

        {/* Effects */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Effects</h4>

          <div className="space-y-1.5">
            <Label className="text-xs">Shadow</Label>
            <Input
              value={localTheme.effects.shadow}
              onChange={(e) => updateEffects({ shadow: e.target.value })}
              placeholder="0 1px 3px rgba(0,0,0,0.1)"
              className="h-8 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Card Shadow</Label>
            <Input
              value={localTheme.effects.cardShadow}
              onChange={(e) => updateEffects({ cardShadow: e.target.value })}
              placeholder="0 4px 6px rgba(0,0,0,0.1)"
              className="h-8 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Transition</Label>
            <Input
              value={localTheme.effects.transition}
              onChange={(e) => updateEffects({ transition: e.target.value })}
              placeholder="all 0.2s ease"
              className="h-8 text-xs font-mono"
            />
          </div>
        </div>

        <Separator />

        {/* Reset */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetToDefault}
            className="w-full"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-2" />
            Reset to Default
          </Button>
        </div>
      </div>
    </div>
  );
}

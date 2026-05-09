"use client";

import { useState, useCallback, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/dashboard/image-upload";
import type { SiteSettings } from "@/lib/types";

interface SiteSettingsEditorProps {
  siteId: string;
  title: string;
  description: string;
  slug: string;
  settings: SiteSettings;
  onUpdateMeta: (fields: { title?: string; description?: string; slug?: string }) => void;
}

export function SiteSettingsEditor({
  siteId,
  title,
  description,
  slug,
  settings,
  onUpdateMeta,
}: SiteSettingsEditorProps) {
  const updateSiteSettings = useMutation(api.sites.updateSiteSettings);
  const checkSlug = useQuery(api.sites.checkSlugUnique, {
    slug: slug,
    excludeSiteId: siteId as Id<"sites">,
  });

  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(description);
  const [localSlug, setLocalSlug] = useState(slug);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const slugAvailable = checkSlug !== undefined ? checkSlug : true;

  const persistSettings = useCallback(
    (newSettings: SiteSettings) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateSiteSettings({ siteId: siteId as Id<"sites">, settings: newSettings });
      }, 400);
    },
    [siteId, updateSiteSettings]
  );

  function handleTitleChange(value: string) {
    setLocalTitle(value);
    onUpdateMeta({ title: value });
  }

  function handleDescriptionChange(value: string) {
    setLocalDescription(value);
    onUpdateMeta({ description: value });
  }

  function handleSlugChange(value: string) {
    const sanitized = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    setLocalSlug(sanitized);
    onUpdateMeta({ slug: sanitized });
  }

  function handleSettingsChange(updates: Partial<SiteSettings>) {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    persistSettings(newSettings);
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-1">Site Settings</h3>
        <p className="text-xs text-muted-foreground">
          Configure your site&apos;s metadata and display information.
        </p>
      </div>

      <Separator />

      <div className="space-y-3">
        <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Basic Info</h4>

        <div className="space-y-1.5">
          <Label htmlFor="site-title" className="text-xs">Site Title</Label>
          <Input
            id="site-title"
            value={localTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="My Romantic Microsite"
            className="h-8"
          />
          <p className="text-xs text-muted-foreground">
            Displayed in the browser tab and social previews.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="site-description" className="text-xs">Description</Label>
          <Textarea
            id="site-description"
            value={localDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="A short description of your site"
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            Used in meta tags and search engine results.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="site-slug" className="text-xs">URL Slug</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">/</span>
            <Input
              id="site-slug"
              value={localSlug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="my-site"
              className="h-8 flex-1"
            />
          </div>
          {slugAvailable === false && (
            <p className="text-xs text-destructive">
              This slug is already taken. Please choose another.
            </p>
          )}
          {slugAvailable === true && localSlug && localSlug !== slug && (
            <p className="text-xs text-green-600">
              This slug is available.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Your public URL will be: /{localSlug || "your-slug"}
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">SEO & Social</h4>

        <div className="space-y-1.5">
          <Label className="text-xs">SEO Title</Label>
          <Input
            value={localSettings.seoTitle || ""}
            onChange={(e) => handleSettingsChange({ seoTitle: e.target.value })}
            placeholder="Defaults to site title if empty"
            className="h-8"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">SEO Description</Label>
          <Textarea
            value={localSettings.seoDescription || ""}
            onChange={(e) => handleSettingsChange({ seoDescription: e.target.value })}
            placeholder="Defaults to site description if empty"
            rows={2}
          />
        </div>

        <ImageUpload
          label="Social Preview Image (OG Image)"
          value={localSettings.seoImage || ""}
          onChange={(v: string) => handleSettingsChange({ seoImage: v })}
          description="Shown when your site is shared on social media. Recommended: 1200x630px."
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Appearance</h4>

        <div className="space-y-1.5">
          <Label className="text-xs">Background Color Override</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={localSettings.backgroundColor || "#fdf8ff"}
              onChange={(e) => handleSettingsChange({ backgroundColor: e.target.value })}
              className="w-10 h-8 p-1 cursor-pointer shrink-0"
            />
            <Input
              value={localSettings.backgroundColor || ""}
              onChange={(e) => handleSettingsChange({ backgroundColor: e.target.value })}
              placeholder="#fdf8ff"
              className="h-8 flex-1 font-mono text-xs"
            />
          </div>
        </div>

        <ImageUpload
          label="Favicon"
          value={localSettings.favicon || ""}
          onChange={(v: string) => handleSettingsChange({ favicon: v })}
          description="Small icon shown in browser tabs. Recommended: 32x32px."
        />
      </div>
    </div>
  );
}

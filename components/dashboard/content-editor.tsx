"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SectionEditor } from "./editors";
import { ThemeEditor } from "./theme-editor";
import { SiteSettingsEditor } from "./site-settings-editor";
import type {
  SectionData,
  EditorMode,
  SectionContent,
  SectionSettings,
  ThemeData,
  SiteSettings,
} from "@/lib/types";

interface ContentEditorProps {
  siteId: string;
  section: SectionData | null;
  editorMode: EditorMode;
  theme: ThemeData;
  siteTitle: string;
  siteDescription: string;
  siteSlug: string;
  siteSettings: SiteSettings;
  onUpdateSiteMeta: (fields: { title?: string; description?: string; slug?: string }) => void;
}

export function ContentEditor({
  siteId,
  section,
  editorMode,
  theme,
  siteTitle,
  siteDescription,
  siteSlug,
  siteSettings,
  onUpdateSiteMeta,
}: ContentEditorProps) {
  const updateContent = useMutation(api.sections.updateSectionContent);
  const updateSettings = useMutation(api.sections.updateSectionSettings);
  const setVisibility = useMutation(api.sections.setVisibility);

  if (editorMode === "theme") {
    return <ThemeEditor siteId={siteId} theme={theme} />;
  }

  if (editorMode === "settings") {
    return (
      <SiteSettingsEditor
        siteId={siteId}
        title={siteTitle}
        description={siteDescription}
        slug={siteSlug}
        settings={siteSettings}
        onUpdateMeta={onUpdateSiteMeta}
      />
    );
  }

  if (!section) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Select a section to edit its content
          </p>
          <p className="text-xs text-muted-foreground">
            Or add a new section from the left panel
          </p>
        </div>
      </div>
    );
  }

  function handleUpdateContent(content: SectionContent) {
    if (!section) return;
    updateContent({
      siteId: siteId as Id<"sites">,
      sectionId: section.id,
      content,
    });
  }

  function handleUpdateSettings(settings: SectionSettings) {
    if (!section) return;
    updateSettings({
      siteId: siteId as Id<"sites">,
      sectionId: section.id,
      settings,
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium capitalize">
            {section.type} Editor
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            {section.id.slice(0, 8)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="section-visible">Visible</Label>
            <Switch
              id="section-visible"
              checked={section.visible}
              onCheckedChange={(checked) => {
                setVisibility({
                  siteId: siteId as Id<"sites">,
                  sectionId: section.id,
                  visible: checked,
                });
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {section.visible
              ? "This section is visible on the page"
              : "This section is hidden from the page"}
          </p>
        </div>

        <Separator />

        <SectionEditor
          sectionType={section.type}
          content={section.content}
          settings={section.settings}
          onUpdateContent={handleUpdateContent}
          onUpdateSettings={handleUpdateSettings}
        />
      </div>
    </div>
  );
}

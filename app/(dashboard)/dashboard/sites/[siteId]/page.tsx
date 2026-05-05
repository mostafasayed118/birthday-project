"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SectionManager } from "@/components/dashboard/section-manager";
import { ContentEditor } from "@/components/dashboard/content-editor";
import { PreviewPanel } from "@/components/dashboard/preview-panel";
import { PublishControls } from "@/components/dashboard/publish-controls";
import { DEFAULT_THEME } from "@/lib/theme-tokens";
import type { ViewData, EditorMode } from "@/lib/types";

export default function SiteEditorPage() {
  const params = useParams();
  const siteId = params.siteId as string;

  const site = useQuery(
    api.sites.getById,
    siteId ? { siteId: siteId as any } : "skip"
  );

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("content");
  const [viewport, setViewport] = useState<ViewData>("desktop");
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  const isLoading = site === undefined;
  const siteData = site ?? null;

  const hasUnpublishedChanges = useMemo(() => {
    if (!siteData) return false;
    if (!siteData.publishedData) return true;
    return (
      JSON.stringify(siteData.draftData) !==
      JSON.stringify(siteData.publishedData)
    );
  }, [siteData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading site...</p>
        </div>
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard/sites" className="hover:text-foreground">
            Sites
          </Link>
          <span>/</span>
          <span className="text-foreground">Not Found</span>
        </div>
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            Site not found or you don&apos;t have access.
          </p>
          <Link
            href="/dashboard/sites"
            className="mt-4 inline-flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Sites
          </Link>
        </div>
      </div>
    );
  }

  const sections = siteData.draftData?.sections ?? [];
  const theme = siteData.draftData?.theme ?? DEFAULT_THEME;
  const selectedSection = sections.find((s: any) => s.id === selectedSectionId) ?? null;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-6">
      {/* Header */}
      <div className="h-12 border-b border-border bg-card flex items-center px-4 gap-3 shrink-0">
        <Link
          href="/dashboard/sites"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-medium truncate">{siteData.title}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={editorMode === "content" ? "default" : "ghost"}
            size="sm"
            onClick={() => setEditorMode("content")}
            className="h-7 text-xs"
          >
            Content
          </Button>
          <Button
            variant={editorMode === "theme" ? "default" : "ghost"}
            size="sm"
            onClick={() => setEditorMode("theme")}
            className="h-7 text-xs"
          >
            Theme
          </Button>
          <Button
            variant={editorMode === "settings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setEditorMode("settings")}
            className="h-7 text-xs"
          >
            Settings
          </Button>
        </div>
        <Separator orientation="vertical" className="h-6" />
        <PublishControls
          siteId={siteId}
          slug={siteData.slug}
          status={siteData.status as "draft" | "published" | "archived"}
          publishedAt={siteData.publishedAt}
          hasUnpublishedChanges={hasUnpublishedChanges}
        />
      </div>

      {/* 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Section Manager */}
        {!leftPanelCollapsed && (
          <div className="w-64 border-r border-border bg-card shrink-0 flex flex-col">
            <SectionManager
              siteId={siteId}
              sections={sections}
              selectedSectionId={selectedSectionId}
              onSelect={(id) => {
                setSelectedSectionId(id);
                setEditorMode("content");
              }}
            />
          </div>
        )}

        {/* Center Panel: Content Editor */}
        <div className="flex-1 flex flex-col border-r border-border bg-background min-w-0">
          <ContentEditor
            siteId={siteId}
            section={selectedSection}
            editorMode={editorMode}
            theme={theme}
          />
        </div>

        {/* Right Panel: Preview */}
        {!rightPanelCollapsed && (
          <div className="w-[400px] bg-card shrink-0 flex flex-col">
            <PreviewPanel
              sections={sections}
              theme={theme}
              viewport={viewport}
              highlightedSectionId={selectedSectionId}
              selectedSectionId={selectedSectionId}
              onViewportChange={setViewport}
              onSelectSection={(id) => {
                setSelectedSectionId(id);
                setEditorMode("content");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SectionManager } from "@/components/dashboard/section-manager";
import { ContentEditor } from "@/components/dashboard/content-editor";
import { PreviewPanel } from "@/components/dashboard/preview-panel";
import { PublishControls } from "@/components/dashboard/publish-controls";
import { DEFAULT_THEME } from "@/lib/theme-tokens";
import type { ViewData, EditorMode } from "@/lib/types";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export default function SiteEditorPage() {
  const params = useParams();
  const siteId = params.siteId as string;

  const site = useQuery(
    api.sites.getById,
    siteId ? { siteId: siteId as Id<"sites"> } : "skip"
  );

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("content");
  const [viewport, setViewport] = useState<ViewData>("desktop");

  const updateSiteMeta = useMutation(api.sites.update);
  const publishSite = useMutation(api.sites.publish);

  const handleUpdateSiteMeta = useCallback(
    (fields: { title?: string; description?: string; slug?: string }) => {
      updateSiteMeta({ siteId: siteId as Id<"sites">, ...fields });
    },
    [siteId, updateSiteMeta]
  );

  const hasUnpublishedChanges = useMemo(() => {
    if (!site) return false;
    if (!site.publishedData) return true;
    return (
      JSON.stringify(site.draftData) !==
      JSON.stringify(site.publishedData)
    );
  }, [site]);

  const isLoading = site === undefined;

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPublish: hasUnpublishedChanges ? () => {
      if (siteId) {
        publishSite({ siteId: siteId as Id<"sites"> });
      }
    } : undefined,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-6">
        <div className="h-12 border-b border-border bg-card flex items-center px-4 gap-3 shrink-0">
          <Skeleton className="h-4 w-4" />
          <Separator orientation="vertical" className="h-6" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 border-r border-border bg-card shrink-0 p-3 space-y-2">
            <Skeleton className="h-8 w-full" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
          <div className="w-[400px] bg-card shrink-0 p-4">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

if (!site) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard/sites" className="hover:text-foreground">
            Sites
          </Link>
          <span>/</span>
          <span className="text-foreground">Not Found</span>
        </div>
        <div className="rounded-lg border border-border bg-card p-8 text-center space-y-4">
          <p className="text-muted-foreground">
            Site not found or you don&apos;t have access.
          </p>
          <Link href="/dashboard/sites">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Sites
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sections = site.draftData?.sections ?? [];
  const theme = site.draftData?.theme ?? DEFAULT_THEME;
  const selectedSection = sections.find((s) => s.id === selectedSectionId) ?? null;

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] -m-6">
      <div className="h-12 border-b border-border bg-card flex items-center px-3 sm:px-4 gap-2 sm:gap-3 shrink-0">
        <Link
          href="/dashboard/sites"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Back to sites"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-medium truncate">{site.title}</h1>
        </div>
        <div className="flex items-center gap-1" role="tablist" aria-label="Editor mode">
          {(["content", "theme", "settings"] as const).map((mode) => (
            <Button
              key={mode}
              variant={editorMode === mode ? "default" : "ghost"}
              size="sm"
              onClick={() => setEditorMode(mode)}
              className="h-7 text-xs capitalize px-2 sm:px-3"
              role="tab"
              aria-selected={editorMode === mode}
            >
              {mode}
            </Button>
          ))}
        </div>
        <Separator orientation="vertical" className="h-6" />
        <PublishControls
          siteId={siteId}
          slug={site.slug}
          status={site.status}
          publishedAt={site.publishedAt}
          hasUnpublishedChanges={hasUnpublishedChanges}
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-64 border-r border-border bg-card shrink-0 lg:flex-col lg:flex">
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

        <div className="flex-1 flex flex-col border-r border-border bg-background min-w-0">
          <ContentEditor
            siteId={siteId}
            section={selectedSection}
            editorMode={editorMode}
            theme={theme}
            siteTitle={site.title}
            siteDescription={site.description || ""}
            siteSlug={site.slug}
            siteSettings={site.draftData?.settings || {}}
            onUpdateSiteMeta={handleUpdateSiteMeta}
          />
        </div>

        <div className="w-full lg:w-[400px] bg-card shrink-0 lg:flex flex-col">
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
      </div>
    </div>
  );
}

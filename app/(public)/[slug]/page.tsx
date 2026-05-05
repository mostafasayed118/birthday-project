"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { PublicPage } from "@/components/public/public-page";
import { DEFAULT_THEME } from "@/lib/theme-tokens";

export default function PublicSlugPage() {
  const params = useParams();
  const slug = params.slug as string;

  const site = useQuery(
    api.sites.getBySlug,
    slug ? { slug } : "skip"
  );

  const isLoading = site === undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Page Not Found</h1>
          <p className="text-muted-foreground">
            This page doesn&apos;t exist or hasn&apos;t been published yet.
          </p>
        </div>
      </div>
    );
  }

  const data = site.data;
  const sections = data?.sections ?? [];
  const theme = data?.theme ?? DEFAULT_THEME;

  return (
    <PublicPage
      sections={sections}
      theme={theme}
    />
  );
}

"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { PublicPage } from "@/components/public/public-page";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="min-h-screen">
        <Skeleton className="h-[60vh] w-full" />
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
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
    <>
      <title>{site.title}</title>
      <meta
        name="description"
        content={site.description || `${site.title} — A romantic microsite`}
      />
      <meta property="og:title" content={site.title} />
      <meta
        property="og:description"
        content={site.description || `${site.title} — A romantic microsite`}
      />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={site.title} />
      <meta
        name="twitter:description"
        content={site.description || `${site.title} — A romantic microsite`}
      />
      <PublicPage sections={sections} theme={theme} />
    </>
  );
}

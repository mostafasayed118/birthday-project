import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Romantic Microsite Platform — Create Beautiful Love Pages",
  description:
    "Build stunning, customizable romantic microsites for anniversaries, proposals, Valentine's Day, and more. Full content and design control with live preview.",
  openGraph: {
    title: "Romantic Microsite Platform",
    description:
      "Create beautiful, configurable romantic microsites with full control over content, design, and layout.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Romantic Microsite Platform",
    description:
      "Create beautiful, configurable romantic microsites with full control over content, design, and layout.",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <main className="flex flex-col items-center gap-10 text-center px-4 py-16">
        <div className="space-y-4 max-w-3xl">
          <p className="text-sm font-medium text-primary tracking-wide uppercase">
            Microsite Studio
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Romantic Microsite Platform
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Create beautiful, configurable romantic microsites with full
            control over content, design, and layout.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Open Dashboard
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View Demo
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8 max-w-4xl w-full">
          <FeatureCard
            title="Dynamic Sections"
            description="Compose pages from reorderable, toggleable section blocks"
          />
          <FeatureCard
            title="Theme Control"
            description="Full control over colors, fonts, spacing, and effects"
          />
          <FeatureCard
            title="Draft & Publish"
            description="Edit safely with a draft/publish workflow"
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm text-left">
      <h3 className="font-semibold text-card-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

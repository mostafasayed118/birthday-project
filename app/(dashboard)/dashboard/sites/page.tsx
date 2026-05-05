import Link from "next/link";

export default function SitesListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Sites</h2>
          <p className="text-muted-foreground">
            All your romantic microsites in one place.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          No sites yet. Create your first romantic microsite to get started.
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          Site creation will be available after Phase 1 (Auth & Site CRUD).
        </p>
      </div>
    </div>
  );
}

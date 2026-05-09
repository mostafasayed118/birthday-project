"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Globe, FileEdit, Clock, Loader2 } from "lucide-react";

const OCCASION_OPTIONS = [
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "proposal", label: "Proposal" },
  { value: "valentine", label: "Valentine's Day" },
  { value: "wedding", label: "Wedding" },
  { value: "love-story", label: "Love Story" },
  { value: "custom", label: "Custom" },
] as const;

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const sites = useQuery(api.sites.listByOwner);
  const createSite = useMutation(api.sites.create);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newOccasion, setNewOccasion] = useState<string>("birthday");
  const [createError, setCreateError] = useState<string | null>(null);

  const totalSites = sites?.length ?? 0;
  const publishedSites = sites?.filter((s) => s.status === "published").length ?? 0;
  const draftSites = sites?.filter((s) => s.status === "draft").length ?? 0;

  function handleSlugFromTitle(title: string) {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    setNewSlug(slug);
  }

  async function handleCreate() {
    if (!isAuthenticated) {
      setCreateError("You must be signed in to create a site");
      return;
    }
    if (!newTitle.trim() || !newSlug.trim()) return;
    setIsCreating(true);
    setCreateError(null);
    try {
      const id = await createSite({
        title: newTitle.trim(),
        slug: newSlug.trim(),
        occasionType: newOccasion as "birthday" | "anniversary" | "proposal" | "valentine" | "wedding" | "love-story" | "custom",
      });
      setShowCreateDialog(false);
      setNewTitle("");
      setNewSlug("");
      setNewOccasion("birthday");
      router.push(`/dashboard/sites/${id}`);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create site");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your romantic microsites.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Site
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Sites"
              value={String(totalSites)}
              icon={<FileEdit className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
              title="Published"
              value={String(publishedSites)}
              icon={<Globe className="h-4 w-4 text-green-600" />}
            />
            <StatsCard
              title="Drafts"
              value={String(draftSites)}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
          </>
        )}
      </div>

      {!isLoading && totalSites > 0 && (
        <div className="rounded-lg border border-border bg-card">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-medium">Recent Sites</h3>
            <Link href="/dashboard/sites" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {sites!.slice(0, 5).map((site) => (
              <Link
                key={site._id}
                href={`/dashboard/sites/${site._id}`}
                className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{site.title}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                      {site.occasionType}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    /{site.slug} · {site.draftData?.sections?.length ?? 0} sections
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-4 ${
                    site.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {site.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!isLoading && totalSites === 0 && (
        <div className="rounded-lg border border-dashed border-border p-12 text-center space-y-4">
          <p className="text-muted-foreground">
            No sites yet. Create your first romantic microsite to get started.
          </p>
          <Button size="sm" variant="outline" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Create Site
          </Button>
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Site</DialogTitle>
            <DialogDescription>
              Set up a new romantic microsite. You can customize everything after creation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="create-title">Site Title</Label>
              <Input
                id="create-title"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  handleSlugFromTitle(e.target.value);
                }}
                placeholder="Happy Birthday, Beautiful!"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-slug">URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">/</span>
                <Input
                  id="create-slug"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  placeholder="happy-birthday"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Occasion Type</Label>
              <Select value={newOccasion} onValueChange={(v) => { if (v) setNewOccasion(v); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OCCASION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {createError && (
              <p className="text-xs text-destructive">{createError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating || !newTitle.trim() || !newSlug.trim()}>
              {isCreating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Site"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

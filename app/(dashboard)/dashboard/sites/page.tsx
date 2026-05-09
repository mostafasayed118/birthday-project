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
import { Plus, Globe, FileText, Loader2 } from "lucide-react";

const OCCASION_OPTIONS = [
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "proposal", label: "Proposal" },
  { value: "valentine", label: "Valentine's Day" },
  { value: "wedding", label: "Wedding" },
  { value: "love-story", label: "Love Story" },
  { value: "custom", label: "Custom" },
] as const;

const OCCASION_COLORS: Record<string, string> = {
  birthday: "bg-pink-100 text-pink-700",
  anniversary: "bg-purple-100 text-purple-700",
  proposal: "bg-red-100 text-red-700",
  valentine: "bg-rose-100 text-rose-700",
  wedding: "bg-amber-100 text-amber-700",
  "love-story": "bg-indigo-100 text-indigo-700",
  custom: "bg-gray-100 text-gray-700",
};

export default function SitesListPage() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const sites = useQuery(api.sites.listByOwner);
  const createSite = useMutation(api.sites.create);
  const isLoading = sites === undefined;

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newOccasion, setNewOccasion] = useState<string>("birthday");
  const [createError, setCreateError] = useState<string | null>(null);

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
          <h2 className="text-2xl font-bold tracking-tight">My Sites</h2>
          <p className="text-muted-foreground">
            All your romantic microsites in one place.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Site
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : sites && sites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site) => (
            <Link
              key={site._id}
              href={`/dashboard/sites/${site._id}`}
              className="group rounded-lg border border-border bg-card p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-card-foreground truncate group-hover:text-primary transition-colors">
                  {site.title}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                    site.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {site.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">/{site.slug}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {site.draftData?.sections?.length ?? 0} sections
                </span>
                <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${OCCASION_COLORS[site.occasionType] || OCCASION_COLORS.custom}`}>
                  <Globe className="h-3 w-3" />
                  {site.occasionType}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
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
              Set up a new romantic microsite.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="list-create-title">Site Title</Label>
              <Input
                id="list-create-title"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  handleSlugFromTitle(e.target.value);
                }}
                placeholder="Happy Birthday, Beautiful!"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="list-create-slug">URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">/</span>
                <Input
                  id="list-create-slug"
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

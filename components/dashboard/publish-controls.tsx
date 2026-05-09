"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExternalLink, RotateCcw, Check } from "lucide-react";

interface PublishControlsProps {
  siteId: string;
  slug: string;
  status: "draft" | "published" | "archived";
  publishedAt?: number;
  hasUnpublishedChanges: boolean;
}

export function PublishControls({
  siteId,
  slug,
  status,
  publishedAt,
  hasUnpublishedChanges,
}: PublishControlsProps) {
  const publish = useMutation(api.sites.publish);
  const rollback = useMutation(api.sites.rollback);

  const [isPublishing, setIsPublishing] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [showRollbackConfirm, setShowRollbackConfirm] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  async function handlePublish() {
    setIsPublishing(true);
    setPublishSuccess(false);
    try {
      await publish({ siteId: siteId as Id<"sites"> });
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3000);
    } catch (error) {
      console.error("Publish failed:", error);
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleRollback() {
    setIsRollingBack(true);
    setShowRollbackConfirm(false);
    try {
      await rollback({ siteId: siteId as Id<"sites"> });
    } catch (error) {
      console.error("Rollback failed:", error);
    } finally {
      setIsRollingBack(false);
    }
  }

  const publishedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <>
      <div className="flex items-center gap-2">
        {status === "published" && !hasUnpublishedChanges && (
          <Badge variant="secondary" className="text-xs">
            <Check className="h-3 w-3 mr-1" />
            Published
          </Badge>
        )}

        {status === "published" && hasUnpublishedChanges && (
          <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
            Unpublished Changes
          </Badge>
        )}

        {status === "draft" && (
          <Badge variant="outline" className="text-xs">
            Draft Only
          </Badge>
        )}

        {publishedDate && (
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {publishedDate}
          </span>
        )}

        {status === "published" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              window.open(`/${slug}`, "_blank");
            }}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Live
          </Button>
        )}

        {status === "published" && hasUnpublishedChanges && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-destructive hover:text-destructive"
            disabled={isRollingBack}
            onClick={() => setShowRollbackConfirm(true)}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Rollback
          </Button>
        )}

        <Button
          size="sm"
          className="h-7 text-xs"
          disabled={isPublishing || (status === "published" && !hasUnpublishedChanges)}
          onClick={handlePublish}
        >
          {isPublishing
            ? "Publishing..."
            : publishSuccess
            ? "Published!"
            : status === "draft"
            ? "Publish"
            : "Update"}
        </Button>
      </div>

      <AlertDialog open={showRollbackConfirm} onOpenChange={setShowRollbackConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rollback to Published Version</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current draft with the last published version.
              All unpublished changes will be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRollback}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRollingBack ? "Rolling back..." : "Rollback"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

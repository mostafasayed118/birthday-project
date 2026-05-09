# Image Asset Library Dashboard - Technical Specification

## 1. Overview

Centralized administrative dashboard for granular control over image assets with upload, transform, metadata, and visibility management.

---

## 2. Data Schema

### 2.1 Image Object Schema (Convex Schema Addition)

```typescript
// convex/schema.ts - Add images table
images: defineTable({
  storageId: v.string(),           // Convex storage reference
  filename: v.string(),            // Original filename
  url: v.string(),                 // CDN URL (Cloudinary/S3)
  alt: v.string(),                 // Alt text for accessibility
  caption: v.optional(v.string()), // Image caption
  tags: v.array(v.string()),       // SEO tags array
  width: v.number(),               // Original width in px
  height: v.number(),              // Original height in px
  mimeType: v.string(),            // image/jpeg, image/png, etc.
  size: v.number(),                // File size in bytes
  status: v.union(
    v.literal("published"),
    v.literal("draft")
  ),
  order: v.number(),               // Sort order in library
  createdBy: v.string(),           // User ID
  createdAt: v.number(),           // Timestamp
  updatedAt: v.number(),           // Timestamp
  metadata: v.optional(v.object({  // Optional EXIF/SYSTEM metadata
    camera: v.optional(v.string()),
    location: v.optional(v.string()),
    iso: v.optional(v.number()),
    aperture: v.optional(v.string()),
  })),
})
  .index("by_creator", ["createdBy"])
  .index("by_status", ["status"])
  .index("by_order", ["order"])
  .index("by_tags", ["tags"]),
```

### 2.2 TypeScript Types

```typescript
// lib/types.ts
export type ImageStatus = "published" | "draft";

export interface ImageObject {
  _id: string;
  _creationTime: number;
  storageId: string;
  filename: string;
  url: string;
  alt: string;
  caption?: string;
  tags: string[];
  width: number;
  height: number;
  mimeType: string;
  size: number;
  status: ImageStatus;
  order: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  metadata?: {
    camera?: string;
    location?: string;
    iso?: number;
    aperture?: string;
  };
}

export interface ImageTransform {
  resize?: { width?: number; height?: number };
  crop?: { x: number; y: number; width: number; height: number };
  aspectRatio?: "original" | "square" | "16:9" | "4:3" | "3:2";
}

export interface BulkAction {
  type: "delete" | "publish" | "draft" | "addTags" | "removeTags";
  imageIds: string[];
  payload?: { tags?: string[] };
}
```

---

## 3. Frontend Interface Components

### 3.1 Component Hierarchy

```
dashboard/
├── image-library/
│   ├── page.tsx                    # Route: /dashboard/images
│   └── components/
│       ├── image-library-header.tsx    # Title + stats + upload button
│       ├── image-toolbar.tsx           # Bulk actions, filters, view toggle
│       ├── image-grid.tsx              # Thumbnail grid with DnD
│       ├── image-thumbnail.tsx         # Individual thumbnail card
│       ├── image-editor-modal.tsx      # Modal for edit/transform
│       ├── image-upload-zone.tsx       # Drag-drop upload area
│       ├── image-transform-panel.tsx   # Real-time transform controls
│       ├── image-metadata-form.tsx     # Alt, caption, tags input
│       └── image-visibility-toggle.tsx # Published/draft switch
```

### 3.2 Thumbnail Grid (`image-grid.tsx`)

```tsx
"use client";

import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { ImageThumbnail } from "./image-thumbnail";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ImageGrid({ images }: { images: ImageObject[] }) {
  const reorderImages = useMutation(api.images.reorder);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img._id === active.id);
      const newIndex = images.findIndex((img) => img._id === over.id);
      reorderImages({ imageId: active.id as string, newOrder: newIndex });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={images.map(i => i._id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map(img => (
            <ImageThumbnail key={img._id} image={img} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
```

### 3.3 Image Editor Modal (`image-editor-modal.tsx`)

```tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageTransformPanel } from "./image-transform-panel";
import { ImageMetadataForm } from "./image-metadata-form";
import { ImageVisibilityToggle } from "./image-visibility-toggle";

interface ImageEditorModalProps {
  image: ImageObject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageEditorModal({ image, open, onOpenChange }: ImageEditorModalProps) {
  const [activeTab, setActiveTab] = useState<"transform" | "metadata">("transform");

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="transform">Transform</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          <TabsContent value="transform">
            <ImageTransformPanel image={image} />
          </TabsContent>
          <TabsContent value="metadata">
            <ImageMetadataForm image={image} />
          </TabsContent>
        </Tabs>
        <ImageVisibilityToggle image={image} />
      </DialogContent>
    </Dialog>
  );
}
```

### 3.4 Bulk Action Toolbar (`image-toolbar.tsx`)

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Trash2, MoreVertical, Tag, Eye, EyeOff } from "lucide-react";

export function ImageToolbar({
  selectedCount,
  onDelete,
  onBulkPublish,
  onBulkDraft,
  onAddTags,
}: {
  selectedCount: number;
  onDelete: () => void;
  onBulkPublish: () => void;
  onBulkDraft: () => void;
  onAddTags: (tags: string[]) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Checkbox />
        <span className="text-sm text-muted-foreground">
          {selectedCount} selected
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onBulkPublish}>
              <Eye className="h-4 w-4 mr-2" /> Publish
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBulkDraft}>
              <EyeOff className="h-4 w-4 mr-2" /> Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddTags([])}>
              <Tag className="h-4 w-4 mr-2" /> Add Tags
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
```

---

## 4. Convex Backend API Architecture

### 4.1 Schema File Update (`convex/images.ts`)

```typescript
import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";

// Generate upload URL (returns S3/Cloudinary signed URL)
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

// Create image record after upload
export const create = mutation({
  args: {
    storageId: v.string(),
    filename: v.string(),
    alt: v.string(),
    tags: v.array(v.string()),
    width: v.number(),
    height: v.number(),
    mimeType: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const url = await ctx.storage.getUrl(args.storageId);
    const maxOrder = await ctx.db
      .query("images")
      .order("desc")
      .take(1)
      .then((r) => r[0]?.order ?? 0);

    return await ctx.db.insert("images", {
      ...args,
      url: url ?? "",
      status: "draft",
      order: maxOrder + 1,
      createdBy: identity.subject,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// List images with filters
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("published"), v.literal("draft"))),
    tag: v.optional(v.string()),
  },
  handler: async (ctx, { status, tag }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    let query = ctx.db.query("images").withIndex("by_creator", (q) =>
      q.eq("createdBy", identity.subject)
    );

    if (status) query = query.filter((q) => q.eq(q.field("status"), status));
    if (tag) query = query.filter((q) => q.elemMatch(q.field("tags"), (t) => t.eq(tag)));

    return await query.order("asc").collect();
  },
});

// Update image (metadata/transform)
export const update = mutation({
  args: {
    imageId: v.string(),
    alt: v.optional(v.string()),
    caption: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("published"), v.literal("draft"))),
  },
  handler: async (ctx, { imageId, ...updates }) => {
    await ctx.db.patch(imageId, { ...updates, updatedAt: Date.now() });
  },
});

// Reorder images
export const reorder = mutation({
  args: { imageId: v.string(), newOrder: v.number() },
  handler: async (ctx, { imageId, newOrder }) => {
    const image = await ctx.db.get(imageId);
    if (!image) throw new Error("Image not found");

    // Swap orders with adjacent image
    const adjacent = await ctx.db
      .query("images")
      .withIndex("by_order", (q) => q.eq("order", newOrder))
      .unique();

    if (adjacent) {
      await ctx.db.patch(adjacent._id, { order: image.order });
    }
    await ctx.db.patch(imageId, { order: newOrder });
  },
});

// Delete image
export const remove = mutation({
  args: { imageId: v.string() },
  handler: async (ctx, { imageId }) => {
    const image = await ctx.db.get(imageId);
    if (!image) throw new Error("Image not found");

    await ctx.storage.delete(image.storageId);
    await ctx.db.delete(imageId);
  },
});

// Bulk delete
export const bulkDelete = mutation({
  args: { imageIds: v.array(v.string()) },
  handler: async (ctx, { imageIds }) => {
    for (const id of imageIds) {
      const image = await ctx.db.get(id);
      if (image) {
        await ctx.storage.delete(image.storageId);
        await ctx.db.delete(id);
      }
    }
  },
});

// Generate transformed image URL (Cloudinary transformations)
export const getTransformedUrl = action({
  args: {
    storageId: v.string(),
    transformations: v.object({
      resize: v.optional(v.object({ width: v.number(), height: v.number() })),
      crop: v.optional(v.object({ x: v.number(), y: v.number(), width: v.number(), height: v.number() })),
      aspectRatio: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { storageId, transformations }) => {
    // If using Cloudinary, construct transformation URL
    const baseUrl = await ctx.storage.getUrl(storageId);
    
    // For Cloudinary: https://res.cloudinary.com/demo/image/upload/c_fill,w_500,h_500/myimage.jpg
    const cloudinaryUrl = baseUrl?.replace(
      "/upload/",
      `/upload/${buildCloudinaryTransform(transformations)}/`
    );
    
    return cloudinaryUrl;
  },
});

function buildCloudinaryTransform(t: any) {
  const parts: string[] = [];
  if (t.resize) parts.push(`w_${t.resize.width}`, `h_${t.resize.height}`);
  if (t.aspectRatio) parts.push(`ar_${t.aspectRatio}`);
  return parts.join(",");
}
```

### 4.2 File Upload Flow

```
1. Client calls generateUploadUrl → Convex returns signed URL
2. Client uploads directly to S3/Cloudinary via fetch/axios
3. Client gets storage ID from upload response
4. Client calls create() with metadata to persist to DB
5. Convex returns full image object with CDN URL
```

---

## 5. Cloud Storage Integration

### 5.1 Cloudinary Configuration

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function getOptimizedUrl(publicId: string, options: {
  width?: number;
  height?: number;
  crop?: "fill" | "scale" | "fit";
  quality?: number;
  format?: "auto" | "webp" | "avif";
}) {
  return cloudinary.url(publicId, {
    ...options,
    fetch_format: options.format || "auto",
    quality: "auto",
  });
}
```

### 5.2 Upload Widget Integration

```tsx
// components/dashboard/image-library/image-upload-zone.tsx
"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function ImageUploadZone() {
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const createImage = useMutation(api.images.create);

  const handleUpload = async (files: FileList) => {
    const uploadUrl = await generateUploadUrl();
    
    for (const file of Array.from(files)) {
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      const { storageId } = await response.json();
      
      createImage({
        storageId,
        filename: file.name,
        alt: file.name.replace(/\.[^/.]+$/, ""),
        tags: [],
        width: 0, // Will be populated from image metadata
        height: 0,
        mimeType: file.type,
        size: file.size,
      });
    }
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer">
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drop images here or click to upload
        </p>
      </label>
    </div>
  );
}
```

---

## 6. UI/UX Workflow

### 6.1 User Journey

```
Dashboard → Images (/dashboard/images)
    ↓
[Thumbnail Grid View]
    ├─ Upload Button → Upload Zone Modal
    ├─ Bulk Select → Toolbar Actions
    ├─ Drag/Drop → Reorder Mutation
    └─ Click Image → Edit Modal
```

### 6.2 State Management

```typescript
// hooks/use-image-library.ts
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export function useImageLibrary() {
  const images = useQuery(api.images.list) ?? [];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingImage, setEditingImage] = useState<ImageObject | null>(null);

  return {
    images,
    selectedIds,
    setSelectedIds,
    editingImage,
    setEditingImage,
  };
}
```

---

## 7. Performance Considerations

| Aspect | Strategy |
|--------|----------|
| Image Loading | Lazy loading with `loading="lazy"` |
| Thumbnails | Cloudinary auto-format + quality |
| Drag/Drop | `@dnd-kit/core` with virtualization for 100+ images |
| Search | Index on `tags` and `alt` fields |
| Bulk Actions | Batch mutations with Promise.all |

---

## 8. Security

- Authentication via Clerk JWT in Convex
- File size/type validation on upload endpoint
- Rate limiting on upload endpoint (100 req/min per user)
- Storage bucket CORS restricted to domain
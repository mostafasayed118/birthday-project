# Convex Schema Plan — Romantic Microsite Platform

## Overview

This document defines the planned Convex database schema. It serves as the reference for all Convex functions and the data model used throughout the application.

## Schema Design Philosophy

1. **Snapshot-based draft/publish** — Full data snapshots for draft and published states
2. **Embedded sections** — Sections stored as arrays within the site document (not separate tables) for atomic updates and simpler queries
3. **Denormalized for read performance** — Public page needs one query to get everything
4. **Validated at the schema level** — Convex schema validators enforce data integrity

## Tables

### `sites` — Main site document

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sites: defineTable({
    // Ownership
    ownerId: v.string(),                    // Convex Auth user ID

    // Basic info
    title: v.string(),                      // Display title
    slug: v.string(),                       // URL slug (unique)
    description: v.optional(v.string()),    // Meta description
    occasionType: v.union(                  // Type of occasion
      v.literal("anniversary"),
      v.literal("proposal"),
      v.literal("valentine"),
      v.literal("birthday"),
      v.literal("love-story"),
      v.literal("wedding"),
      v.literal("custom")
    ),

    // Status
    status: v.union(                        // Site status
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived")
    ),

    // Timestamps
    createdAt: v.number(),                  // Creation timestamp
    updatedAt: v.number(),                  // Last update timestamp
    publishedAt: v.optional(v.number()),    // Last publish timestamp

    // Data snapshots
    draftData: v.object({                   // Working copy
      sections: v.array(v.any()),           // Array of section objects
      theme: v.any(),                       // Theme token object
      settings: v.any(),                    // Site-level settings
    }),
    publishedData: v.optional(v.object({    // Live version (null if never published)
      sections: v.array(v.any()),
      theme: v.any(),
      settings: v.any(),
    })),
  })

  // Indexes
  .index("by_owner", ["ownerId"])
  .index("by_slug", ["slug"])
  .index("by_owner_status", ["ownerId", "status"])
});
```

### Table Design Decisions

#### Why snapshot-based draft/publish?

- **Atomic publish**: Publishing is a single write (copy draftData → publishedData)
- **Simple rollback**: Copy publishedData back to draftData
- **No diff tracking needed**: Both states are complete
- **Read performance**: Public page needs one query to get all data
- **Isolation**: Draft changes never leak to production

#### Why embedded sections?

- **Single query**: One `getSiteBySlug` query returns everything needed for the public page
- **Atomic updates**: Updating a section's content is a single document write
- **Ordering simplicity**: Reordering sections is just array manipulation
- **No join queries**: Everything is in one document
- **Trade-off**: Document size limits (Convex max ~1MB per document) — acceptable for microsites

#### Why `v.any()` for sections/theme/settings?

- **Flexibility**: Section content varies wildly by type
- **Schema evolution**: Can add new section types without schema migration
- **Trade-off**: Less type safety at the DB level — compensated by Convex function validation
- **Future**: Could add more specific validators as the schema stabilizes

## Data Size Considerations

### Convex Document Limits

- Maximum document size: ~1MB
- Maximum field depth: ~100 levels

### Estimated Sizes per Section Type

| Section Type | Typical Size | Max Estimate |
|---|---|---|
| Hero | ~500 bytes | ~5KB (with image metadata) |
| Message | ~300 bytes | ~10KB (long text) |
| Gallery | ~1KB + ~200/image | ~100KB (50 images) |
| Timeline | ~500/event | ~50KB (50 events) |
| Quote | ~200 bytes | ~1KB |
| Countdown | ~200 bytes | ~1KB |
| Map | ~100 bytes | ~1KB |
| Divider | ~50 bytes | ~100 bytes |
| Stats | ~100/item | ~5KB |
| Footer | ~200 bytes | ~5KB |

### Total Site Estimate

- Average site: ~10 sections → ~10-50KB
- Heavy site (many images in gallery): ~100-200KB
- Well within 1MB limit

## Convex Functions Plan

### `convex/sites.ts` — Site CRUD

```typescript
// Queries
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    // Returns publishedData only (for public page)
  },
});

export const getById = query({
  args: { siteId: v.string() },
  handler: async (ctx, args) => {
    // Returns full site (draft + published) — auth required
  },
});

export const listByOwner = query({
  args: {},
  handler: async (ctx) => {
    // Returns all sites for current user
  },
});

// Mutations
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    occasionType: v.string(),
    templateId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Creates new site with default sections and theme
  },
});

export const update = mutation({
  args: {
    siteId: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    slug: v.optional(v.string()),
    occasionType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Updates site metadata (not draftData)
  },
});

export const publish = mutation({
  args: { siteId: v.string() },
  handler: async (ctx, args) => {
    // Copies draftData → publishedData
    // Updates status and publishedAt
  },
});

export const rollback = mutation({
  args: { siteId: v.string() },
  handler: async (ctx, args) => {
    // Copies publishedData → draftData
  },
});

export const remove = mutation({
  args: { siteId: v.string() },
  handler: async (ctx, args) => {
    // Soft-delete (set status to "archived")
  },
});
```

### `convex/sections.ts` — Section Management

```typescript
export const addSection = mutation({
  args: {
    siteId: v.string(),
    type: v.string(),
    insertAt: v.optional(v.number()),  // Index to insert at (default: end)
  },
  handler: async (ctx, args) => {
    // Adds new section to draftData.sections
    // Initializes with default content for the type
  },
});

export const updateSectionContent = mutation({
  args: {
    siteId: v.string(),
    sectionId: v.string(),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    // Updates specific section's content in draftData
  },
});

export const updateSectionSettings = mutation({
  args: {
    siteId: v.string(),
    sectionId: v.string(),
    settings: v.any(),
  },
  handler: async (ctx, args) => {
    // Updates specific section's settings in draftData
  },
});

export const toggleSectionVisibility = mutation({
  args: {
    siteId: v.string(),
    sectionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Toggles visible flag on specific section
  },
});

export const reorderSections = mutation({
  args: {
    siteId: v.string(),
    sectionIds: v.array(v.string()),  // New order as array of IDs
  },
  handler: async (ctx, args) => {
    // Reorders sections in draftData to match provided order
  },
});

export const removeSection = mutation({
  args: {
    siteId: v.string(),
    sectionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Removes section from draftData.sections
  },
});
```

### `convex/themes.ts` — Theme Management

```typescript
export const updateTheme = mutation({
  args: {
    siteId: v.string(),
    theme: v.any(),  // Partial or full theme update
  },
  handler: async (ctx, args) => {
    // Updates draftData.theme
    // Merges partial updates with existing theme
  },
});

export const applyPreset = mutation({
  args: {
    siteId: v.string(),
    presetId: v.string(),
  },
  handler: async (ctx, args) => {
    // Replaces draftData.theme with preset theme
  },
});
```

### `convex/files.ts` — File Upload

```typescript
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Returns upload URL for Convex file storage
  },
});

export const getFileUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    // Returns public URL for a stored file
  },
});
```

### `convex/auth.ts` — Authentication

```typescript
// Convex Auth configuration
// Uses Convex's built-in auth providers (GitHub, Google, etc.)
```

## Indexes

| Table | Index | Fields | Purpose |
|---|---|---|---|
| `sites` | `by_owner` | `ownerId` | Fetch all sites for a user |
| `sites` | `by_slug` | `slug` | Fetch site by URL slug (public page) |
| `sites` | `by_owner_status` | `ownerId, status` | Filter sites by status |

## Data Validation Strategy

### Schema Level (Convex validators)

- Field types enforced (string, number, boolean, etc.)
- Required vs optional fields
- Union types for enums (status, occasionType)

### Function Level (Convex handlers)

- Section content validated per type
- Theme token values validated (color format, number ranges)
- Slug format validated (lowercase, alphanumeric, hyphens)
- Authorization checks (user owns the site)

### Client Level (TypeScript + React)

- Form validation before submitting
- Color picker validates hex values
- Date picker validates date formats
- Image upload validates file type and size

## Migration Strategy

### Phase 1: Initial Schema

- Start with the schema as defined above
- Use `v.any()` for flexible sections and theme

### Phase 2: Tighten Validators

- As section types stabilize, replace `v.any()` with specific validators
- Add more indexes if query patterns demand it

### Phase 3: Advanced Features

- Add `versions` table for version history
- Add `collaborators` table for multi-user (future)
- Add `analytics` table for page views (future)

## Assumptions

1. **Single owner per site** — No shared editing in MVP
2. **No soft deletes needed** — Sites can be archived (status change)
3. **No data versioning** — Only current draft + last published
4. **Images stored in Convex** — Sufficient for MVP scale
5. **Slug uniqueness enforced** — At the application level (check before create)
6. **No real-time on public pages by default** — Public pages fetch data on load, don't maintain WebSocket connection (save resources)

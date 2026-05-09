# Multi-Tenant Database Security Architecture

## Overview

This document defines a **Row-Level Security (RLS)** approach for the Convex-based wedding website platform, ensuring strict data isolation between tenants (users).

## Current Architecture Analysis

### Existing Schema (with ownerId fields)
- `sites.ownerId` - Links site to user
- `quotes.createdBy` - Links quote to user
- `analytics.siteSlug` - Public-facing analytics (no owner link)

### Security Gaps Identified
1. Analytics table missing owner validation
2. No centralized authorization middleware
3. Missing automated tests for tenant boundaries
4. Some queries lack ownership checks

## Multi-Tenant Strategy: Row-Level Security with Discriminator Columns

### Chosen Approach: Normalized with Discriminator Columns

**Why RLS (Row-Level Security) over other patterns:**
- **Schema-per-Tenant**: Too complex for Convex, requires migration scripts
- **Database-per-Tenant**: Expensive, overkill for this scale
- **RLS with Discriminator**: Simple, performant, Convex-native

## Implementation Plan

### 1. Database Schema Updates

```typescript
// convex/schema.ts - Updated with explicit tenant fields and checks

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Before indexes, define a special "tenant_isolation" index
export default defineSchema({
  sites: defineTable({
    ownerId: v.string(),
    title: v.string(),
    slug: v.string(),
    // ... other fields
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_slug", ["ownerId", "slug"])
    .searchIndex("by_slug_search", { searchField: "slug" }),

  quotes: defineTable({
    createdBy: v.string(),
    content: v.string(),
    ownerId: v.optional(v.string()), // For future multi-user scenarios
    // ... other fields
  })
    .index("by_creator", ["createdBy"])
    .index("by_creator_status", ["createdBy", "status"]),

  analytics: defineTable({
    siteSlug: v.string(),
    ownerId: v.string(), // ADD THIS - Critical for isolation
    eventType: v.string(),
    // ... other fields
  })
    .index("by_owner_time", ["ownerId", "timestamp"])
    .index("by_site_slug_owner", ["siteSlug", "ownerId"]),

  files: defineTable({
    storageId: v.string(),
    ownerId: v.string(), // Track file ownership
    filename: v.string(),
    contentType: v.string(),
    uploadedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_storageId", ["storageId"]),
});
```

### 2. Authorization Middleware Pattern

```typescript
// convex/lib/authz.ts - Centralized authorization utilities

import { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Get the current authenticated user's ID
 * Returns null if not authenticated
 */
export async function getUserId(ctx: QueryCtx | MutationCtx): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject ?? null;
}

/**
 * Assert that the current user owns a site
 * Throws an error if not authorized
 */
export async function assertSiteOwner(
  ctx: QueryCtx | MutationCtx,
  siteId: string
): Promise<void> {
  const userId = await getUserId(ctx);
  if (!userId) throw new Error("Not authenticated");

  const site = await ctx.db.get(siteId as any);
  if (!site) throw new Error("Site not found");
  if (site.ownerId !== userId) throw new Error("Not authorized");
}

/**
 * Assert that the current user owns a quote
 */
export async function assertQuoteOwner(
  ctx: QueryCtx | MutationCtx,
  quoteId: string
): Promise<void> {
  const userId = await getUserId(ctx);
  if (!userId) throw new Error("Not authenticated");

  const quote = await ctx.db.get(quoteId as any);
  if (!quote) throw new Error("Quote not found");
  if (quote.createdBy !== userId) throw new Error("Not authorized");
}

/**
 * Filter query by owner (for list operations)
 */
export function withOwnerFilter<T extends { ownerId?: string }>(
  query: any,
  userId: string
) {
  return query.filter((q: any) => q.eq(q.field("ownerId"), userId));
}
```

### 3. Updated Secure Convex Functions

```typescript
// convex/sites.ts - Secure implementation

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserId, assertSiteOwner } from "./lib/authz";

// SECURE QUERY - Only returns sites owned by user
export const listByOwner = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("sites")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();
  },
});

// SECURE MUTATION - Validates ownership
export const update = mutation({
  args: {
    siteId: v.id("sites"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertSiteOwner(ctx, args.siteId);

    return await ctx.db.patch(args.siteId, {
      title: args.title,
      description: args.description,
      updatedAt: Date.now(),
    });
  },
});

// SECURE MUTATION - Publish with ownership check
export const publish = mutation({
  args: { siteId: v.id("sites") },
  handler: async (ctx, args) => {
    await assertSiteOwner(ctx, args.siteId);

    const site = await ctx.db.get(args.siteId);
    if (!site) throw new Error("Site not found");

    return await ctx.db.patch(args.siteId, {
      publishedData: site.draftData,
      publishedAt: Date.now(),
      status: "published",
    });
  },
});
```

### 4. Public Page Security (Read-Optimized)

```typescript
// convex/sites.ts - Public read with owner validation

// Public query uses slug but also verifies via siteSlug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    // Public pages SHOULD NOT expose draft data
    const site = await ctx.db
      .query("sites")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!site?.publishedData) return null;

    // Return ONLY published data for public consumption
    return {
      title: site.title,
      publishedData: site.publishedData,
    };
  },
});
```

### 5. Analytics Security Fix

```typescript
// convex/analytics.ts - Fixed with owner isolation

import { getUserId } from "./lib/authz";

// SECURE: Only returns analytics for sites owned by user
export const getSiteAnalytics = query({
  args: {
    siteSlug: v.string(),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    let query = ctx.db
      .query("analytics")
      .withIndex("by_site_slug_owner", (q) =>
        q.eq("siteSlug", args.siteSlug).eq("ownerId", userId)
      );

    // Apply date filters
    if (args.startDate) {
      query = query.filter((q) => q.gte(q.field("timestamp"), args.startDate!));
    }
    if (args.endDate) {
      query = query.filter((q) => q.lte(q.field("timestamp"), args.endDate!));
    }

    return await query.collect();
  },
});
```

## Data Isolation Rules

### Rule 1: Every Table Must Have Owner Field
```typescript
// Pattern: Every table that contains user data MUST have ownerId or createdBy
sites: { ownerId: string } ✓
quotes: { createdBy: string } ✓
analytics: { ownerId: string } ← ADD THIS
files: { ownerId: string } ← ADD THIS
```

### Rule 2: Every Query Must Filter by Owner
```typescript
// Pattern: Always use .withIndex("by_owner", ...) for user-specific queries
const userSites = await ctx.db
  .query("sites")
  .withIndex("by_owner", (q) => q.eq("ownerId", userId))
  .collect();
```

### Rule 3: Every Mutation Must Assert Ownership
```typescript
// Pattern: Validate ownership before any write operation
await assertSiteOwner(ctx, siteId);
// Then proceed with modification
```

## Automated Testing Protocol

### Test Suite Structure

```typescript
// vitest/multi-tenant.spec.ts

import { describe, it, expect, beforeAll } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";

describe("Multi-Tenant Data Isolation", () => {
  let t: ReturnType<typeof convexTest>;

  beforeAll(() => {
    t = convexTest(schema);
  });

  describe("Site Isolation", () => {
    it("prevents User A from accessing User B's sites", async () => {
      // Setup: Create users and sites
      const userA = await t.createUser();
      const userB = await t.createUser();

      const siteA = await t.run(
        api.sites.create,
        { title: "A's Site", slug: "a-site" },
        { user: userA }
      );

      // Test: User B cannot list User A's sites
      const sitesB = await t.run(api.sites.listByOwner, {}, { user: userB });

      expect(sitesB.some(s => s._id === siteA)).toBe(false);
    });

    it("prevents updating another user's site", async () => {
      const userA = await t.createUser();
      const userB = await t.createUser();

      const siteA = await t.run(
        api.sites.create,
        { title: "A's Site", slug: "a-site" },
        { user: userA }
      );

      // Test: User B cannot update
      await expect(
        t.run(
          api.sites.update,
          { siteId: siteA, title: "Hacked!" },
          { user: userB }
        )
      ).rejects.toThrow("Not authorized");
    });
  });

  describe("Quote Isolation", () => {
    it("ensures quotes are user-isolated", async () => {
      const userA = await t.createUser();
      const userB = await t.createUser();

      await t.run(
        api.quotes.create,
        { content: "Love quote", author: "Author" },
        { user: userA }
      );

      const quotesB = await t.run(api.quotes.list, {}, { user: userB });

      expect(quotesB).toHaveLength(0);
    });
  });

  describe("Analytics Isolation", () => {
    it("prevents cross-tenant analytics access", async () => {
      const userA = await t.createUser();
      const userB = await t.createUser();

      // Record analytics for user A's site
      await t.run(
        api.analytics.recordEvent,
        { siteSlug: "a-site", eventType: "page_view" },
        { user: userA }
      );

      // User B should not see user A's analytics
      const analyticsB = await t.run(
        api.analytics.getSiteAnalytics,
        { siteSlug: "a-site" },
        { user: userB }
      );

      expect(analyticsB).toHaveLength(0);
    });
  });
});
```

### Security Test Checklist

| Test | Description | Tool |
|------|-------------|------|
| Tenant A cannot list Tenant B's items | Basic isolation | vitest |
| Tenant A cannot read Tenant B's data | Read protection | vitest |
| Tenant A cannot update Tenant B's data | Write protection | vitest |
| Tenant A cannot delete Tenant B's data | Delete protection | vitest |
| Unauthenticated user cannot access private data | Auth check | vitest |
| Public endpoints only return published data | Data leakage | vitest |
| File uploads are user-isolated | Storage security | vitest |

## Deployment Checklist

### Phase 1: Schema Updates
- [ ] Add `ownerId` to analytics table
- [ ] Add `ownerId` to files table  
- [ ] Create new indexes for owner-based queries
- [ ] Run `npx convex deploy`

### Phase 2: Code Updates
- [ ] Update all queries to use user filtering
- [ ] Add authorization checks to all mutations
- [ ] Update analytics functions for owner validation
- [ ] Run `npx convex deploy`

### Phase 3: Testing
- [ ] Add multi-tenant test suite
- [ ] Run `npm run test` to verify isolation
- [ ] Manual testing with multiple accounts

### Phase 4: Monitoring
- [ ] Add logging for authorization failures
- [ ] Set up alerts for suspicious access patterns
- [ ] Document security procedures

## Security Best Practices

### 1. Principle of Least Privilege
```typescript
// Only query what's needed
const site = await ctx.db.get(siteId);
if (site?.ownerId !== userId) {
  // Return null, don't throw (avoid info leakage)
  return null;
}
```

### 2. No Information Leakage
```typescript
// Don't reveal if resource exists
if (site?.ownerId !== userId) return null; // Same error for both cases
```

### 3. Consistent Error Messages
```typescript
// Use generic messages
throw new Error("Not authorized"); // Not "Site not found" or "Not yours"
```

### 4. Validate at Every Layer
```typescript
// Client validation (UX) + Server validation (security)
// Never trust client-side checks alone
```
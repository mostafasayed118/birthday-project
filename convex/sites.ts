import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { DEFAULT_THEME } from "../lib/theme-tokens";
import { getDefaultSections } from "../lib/constants";

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const site = await ctx.db
      .query("sites")
      .withIndex("by_slug", (q: any) => q.eq("slug", args.slug))
      .unique();

    if (!site || site.status !== "published" || !site.publishedData) {
      return null;
    }

    return {
      _id: site._id,
      title: site.title,
      slug: site.slug,
      description: site.description,
      occasionType: site.occasionType,
      data: site.publishedData,
    };
  },
});

export const getById = query({
  args: { siteId: v.id("sites") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const site = await ctx.db.get(args.siteId);
    if (!site || site.ownerId !== identity.subject) return null;

    return site;
  },
});

export const listByOwner = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const sites = await ctx.db
      .query("sites")
      .withIndex("by_owner", (q: any) => q.eq("ownerId", identity.subject))
      .order("desc")
      .collect();

    return sites;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    occasionType: v.union(
      v.literal("anniversary"),
      v.literal("proposal"),
      v.literal("valentine"),
      v.literal("birthday"),
      v.literal("love-story"),
      v.literal("wedding"),
      v.literal("custom")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("sites")
      .withIndex("by_slug", (q: any) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new Error("A site with this slug already exists");
    }

    const now = Date.now();
    const sections = getDefaultSections(args.occasionType);

    const siteId = await ctx.db.insert("sites", {
      ownerId: identity.subject,
      title: args.title,
      slug: args.slug,
      occasionType: args.occasionType,
      status: "draft",
      createdAt: now,
      updatedAt: now,
      draftData: {
        sections,
        theme: DEFAULT_THEME,
        settings: {},
      },
    });

    return siteId;
  },
});

export const update = mutation({
  args: {
    siteId: v.id("sites"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    slug: v.optional(v.string()),
    occasionType: v.optional(
      v.union(
        v.literal("anniversary"),
        v.literal("proposal"),
        v.literal("valentine"),
        v.literal("birthday"),
        v.literal("love-story"),
        v.literal("wedding"),
        v.literal("custom")
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const site = await ctx.db.get(args.siteId);
    if (!site || site.ownerId !== identity.subject) {
      throw new Error("Site not found or not authorized");
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.slug !== undefined) updates.slug = args.slug;
    if (args.occasionType !== undefined) updates.occasionType = args.occasionType;

    await ctx.db.patch(args.siteId, updates);
  },
});

export const publish = mutation({
  args: { siteId: v.id("sites") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const site = await ctx.db.get(args.siteId);
    if (!site || site.ownerId !== identity.subject) {
      throw new Error("Site not found or not authorized");
    }

    await ctx.db.patch(args.siteId, {
      status: "published",
      publishedAt: Date.now(),
      publishedData: site.draftData,
      updatedAt: Date.now(),
    });
  },
});

export const rollback = mutation({
  args: { siteId: v.id("sites") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const site = await ctx.db.get(args.siteId);
    if (!site || site.ownerId !== identity.subject) {
      throw new Error("Site not found or not authorized");
    }

    if (!site.publishedData) {
      throw new Error("No published version to rollback to");
    }

    await ctx.db.patch(args.siteId, {
      draftData: site.publishedData,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { siteId: v.id("sites") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const site = await ctx.db.get(args.siteId);
    if (!site || site.ownerId !== identity.subject) {
      throw new Error("Site not found or not authorized");
    }

    await ctx.db.patch(args.siteId, {
      status: "archived",
      updatedAt: Date.now(),
    });
  },
});

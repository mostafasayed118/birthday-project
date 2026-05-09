import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const Translations = v.object({
  en: v.string(),
  ar: v.optional(v.string()),
  es: v.optional(v.string()),
  fr: v.optional(v.string()),
});

const ContentCategory = v.union(
  v.literal("ui"),
  v.literal("seo"),
  v.literal("error"),
  v.literal("page"),
  v.literal("email")
);

type ContentCategoryType = "ui" | "seo" | "error" | "page" | "email";

// Get content by key and locale
export const get = query({
  args: { key: v.string(), locale: v.optional(v.string()) },
  handler: async (ctx, { key, locale = "en" }) => {
    const item = await ctx.db
      .query("content")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    
    if (!item) return key;
    
    const translations = item.translations as Record<string, string | undefined>;
    return translations[locale] ?? translations.en ?? key;
  },
});

// Get multiple content items
export const getBulk = query({
  args: { keys: v.array(v.string()), locale: v.optional(v.string()) },
  handler: async (ctx, { keys, locale = "en" }) => {
    const items = await ctx.db
      .query("content")
      .withIndex("by_key")
      .filter((q) => q.or(...keys.map((k) => q.eq("key", k))))
      .collect();
    
    const result: Record<string, string> = {};
    for (const item of items) {
      const translations = item.translations as Record<string, string | undefined>;
      result[item.key] = translations[locale] ?? translations.en ?? item.key;
    }
    return result;
  },
});

// List all content (for admin dashboard)
export const list = query({
  args: { category: v.optional(ContentCategory) },
  handler: async (ctx, { category }) => {
    if (category) {
      return await ctx.db
        .query("content")
        .withIndex("by_category", (q) => q.eq("category", category))
        .collect();
    }
    return await ctx.db.query("content").collect();
  },
});

// Update content (admin only)
export const update = mutation({
  args: {
    key: v.string(),
    translations: Translations,
    category: v.optional(ContentCategory),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await ctx.db
      .query("content")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    const updateData: {
      translations: typeof args.translations;
      category: ContentCategoryType;
      version: number;
      updatedAt: number;
      updatedBy: string;
      description?: string;
    } = {
      translations: args.translations,
      category: (existing?.category as ContentCategoryType) ?? "ui",
      version: existing ? (existing.version ?? 1) + 1 : 1,
      updatedAt: Date.now(),
      updatedBy: identity.subject,
    };

    if (args.description !== undefined) {
      updateData.description = args.description;
    }

    if (existing) {
      return await ctx.db.patch(existing._id, updateData);
    }
    return await ctx.db.insert("content", {
      key: args.key,
      ...updateData,
    });
  },
});

// Create new content key
export const create = mutation({
  args: {
    key: v.string(),
    translations: Translations,
    category: ContentCategory,
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await ctx.db
      .query("content")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    
    if (existing) throw new Error("Key already exists");

    return await ctx.db.insert("content", {
      key: args.key,
      translations: args.translations,
      category: args.category,
      description: args.description,
      version: 1,
      updatedAt: Date.now(),
      updatedBy: identity.subject,
    });
  },
});

// Delete content key
export const remove = mutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const item = await ctx.db
      .query("content")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    
    if (item) return await ctx.db.delete(item._id);
  },
});
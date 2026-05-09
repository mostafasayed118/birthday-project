import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { SiteData } from "./validators";

export default defineSchema({
  sites: defineTable({
    ownerId: v.string(),
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    occasionType: v.union(
      v.literal("anniversary"),
      v.literal("proposal"),
      v.literal("valentine"),
      v.literal("birthday"),
      v.literal("love-story"),
      v.literal("wedding"),
      v.literal("custom")
    ),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    publishedAt: v.optional(v.number()),
    draftData: SiteData,
    publishedData: v.optional(SiteData),
  })
    .index("by_owner", ["ownerId"])
    .index("by_slug", ["slug"])
    .index("by_owner_status", ["ownerId", "status"]),

  quotes: defineTable({
    content: v.string(),
    author: v.string(),
    source: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.union(
      v.literal("published"),
      v.literal("draft")
    ),
    featured: v.optional(v.boolean()),
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creator", ["createdBy"])
    .index("by_status", ["status"])
    .index("by_featured", ["featured"])
    .index("by_created", ["createdAt"]),

  content: defineTable({
    key: v.string(),
    translations: v.object({
      en: v.string(),
      ar: v.optional(v.string()),
      es: v.optional(v.string()),
      fr: v.optional(v.string()),
    }),
    category: v.union(
      v.literal("ui"),
      v.literal("seo"),
      v.literal("error"),
      v.literal("page"),
      v.literal("email")
    ),
    description: v.optional(v.string()),
    version: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  })
    .index("by_key", ["key"])
    .index("by_category", ["category"]),

  analytics: defineTable({
    siteSlug: v.string(),
    eventType: v.union(
      v.literal("page_view"),
      v.literal("link_click"),
      v.literal("audio_play"),
      v.literal("quote_share")
    ),
    section: v.optional(v.string()),
    timestamp: v.number(),
    metadata: v.optional(
      v.object({
        userAgent: v.optional(v.string()),
        referrer: v.optional(v.string()),
        device: v.optional(v.string()),
        country: v.optional(v.string()),
      })
    ),
  })
    .index("by_site", ["siteSlug"])
    .index("by_site_time", ["siteSlug", "timestamp"]),
});

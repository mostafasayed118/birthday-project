import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
    draftData: v.object({
      sections: v.array(v.any()),
      theme: v.any(),
      settings: v.any(),
    }),
    publishedData: v.optional(
      v.object({
        sections: v.array(v.any()),
        theme: v.any(),
        settings: v.any(),
      })
    ),
  })
    .index("by_owner", ["ownerId"])
    .index("by_slug", ["slug"])
    .index("by_owner_status", ["ownerId", "status"]),
});

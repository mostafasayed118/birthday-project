import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// GET - List quotes with search, status, featured filters
export const list = query({
  args: {
    search: v.optional(v.string()),
    status: v.optional(v.union(v.literal("published"), v.literal("draft"))),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, { search, status, featured, limit = 20, cursor }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { page: [], isDone: true, continueCursor: null };

    // Start with index-based query (following your schema patterns)
    let dbQuery = ctx.db.query("quotes").withIndex("by_creator", (q) =>
      q.eq("createdBy", identity.subject)
    );

    // Build filter conditions using proper Convex filter builder
    if (status) {
      dbQuery = dbQuery.filter((q) => q.eq(q.field("status"), status));
    }
    if (featured !== undefined) {
      dbQuery = dbQuery.filter((q) => q.eq(q.field("featured"), featured));
    }

    // Get paginated results
    const result = await dbQuery
      .order("desc")
      .paginate({ cursor: cursor ?? null, numItems: limit });

    // Filter by search term in memory (Convex doesn't have ilike)
    if (search && search.trim().length > 0) {
      const searchLower = search.toLowerCase();
      result.page = result.page.filter(q =>
        q.content.toLowerCase().includes(searchLower) ||
        q.author.toLowerCase().includes(searchLower) ||
        (q.source && q.source.toLowerCase().includes(searchLower))
      );
    }

    return result;
  },
});

// POST - Create quote (following your mutation patterns)
export const create = mutation({
  args: {
    content: v.string(),
    author: v.string(),
    source: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.union(v.literal("published"), v.literal("draft")),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const id = await ctx.db.insert("quotes", {
      ...args,
      createdBy: identity.subject,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

// PATCH - Update quote (idempotent update)
export const update = mutation({
  args: {
    id: v.id("quotes"),
    content: v.optional(v.string()),
    author: v.optional(v.string()),
    source: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("published"), v.literal("draft"))),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const quote = await ctx.db.get(id);
    if (!quote) throw new Error("Quote not found");
    
    // Verify ownership
    if (quote.createdBy !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
    return await ctx.db.get(id);
  },
});

// DELETE - Delete quote (named "remove" to match your pattern)
export const remove = mutation({
  args: { id: v.id("quotes") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const quote = await ctx.db.get(id);
    if (!quote) throw new Error("Quote not found");
    
    // Verify ownership
    if (quote.createdBy !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(id);
    return { success: true };
  },
});
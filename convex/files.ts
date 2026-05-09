import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    const storageId = args.storageId;
    if (!storageId || typeof storageId !== "string") {
      return null;
    }
    try {
      return await ctx.storage.getUrl(storageId);
    } catch {
      return null;
    }
  },
});

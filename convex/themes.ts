import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { THEME_PRESETS } from "../lib/theme-tokens";
import { ThemeData } from "./validators";

export const updateTheme = mutation({
  args: {
    siteId: v.id("sites"),
    theme: ThemeData,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const site = await ctx.db.get(args.siteId);
    if (!site || site.ownerId !== identity.subject) {
      throw new Error("Site not found or not authorized");
    }

    await ctx.db.patch(args.siteId, {
      draftData: { ...site.draftData, theme: args.theme },
      updatedAt: Date.now(),
    });
  },
});

export const applyPreset = mutation({
  args: {
    siteId: v.id("sites"),
    presetId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const site = await ctx.db.get(args.siteId);
    if (!site || site.ownerId !== identity.subject) {
      throw new Error("Site not found or not authorized");
    }

    const preset = THEME_PRESETS[args.presetId as keyof typeof THEME_PRESETS];
    if (!preset) {
      throw new Error(`Unknown theme preset: ${args.presetId}`);
    }

    await ctx.db.patch(args.siteId, {
      draftData: { ...site.draftData, theme: preset },
      updatedAt: Date.now(),
    });
  },
});

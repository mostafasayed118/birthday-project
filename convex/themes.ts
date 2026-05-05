import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { THEME_PRESETS } from "../lib/theme-tokens";

export const updateTheme = mutation({
  args: {
    siteId: v.id("sites"),
    theme: v.any(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const site = await ctx.db.get(args.siteId);
    if (!site || site.ownerId !== identity.subject) {
      throw new Error("Site not found or not authorized");
    }

    const mergedTheme = {
      ...site.draftData.theme,
      ...args.theme,
      colors: { ...site.draftData.theme?.colors, ...args.theme?.colors },
      typography: { ...site.draftData.theme?.typography, ...args.theme?.typography },
      spacing: { ...site.draftData.theme?.spacing, ...args.theme?.spacing },
      borders: { ...site.draftData.theme?.borders, ...args.theme?.borders },
      effects: { ...site.draftData.theme?.effects, ...args.theme?.effects },
    };

    await ctx.db.patch(args.siteId, {
      draftData: { ...site.draftData, theme: mergedTheme },
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

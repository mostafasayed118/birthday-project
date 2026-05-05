import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { SECTION_DEFAULTS } from "../lib/constants";

async function getOwnedSite(ctx: any, siteId: string) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const site = await ctx.db.get(siteId);
  if (!site || site.ownerId !== identity.subject) {
    throw new Error("Site not found or not authorized");
  }

  return { site, identity };
}

export const addSection = mutation({
  args: {
    siteId: v.id("sites"),
    type: v.string(),
    insertAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { site } = await getOwnedSite(ctx, args.siteId);

    const defaults = SECTION_DEFAULTS[args.type as keyof typeof SECTION_DEFAULTS];
    if (!defaults) {
      throw new Error(`Unknown section type: ${args.type}`);
    }

    const sections = [...site.draftData.sections];
    const newSection = {
      id: crypto.randomUUID(),
      type: args.type,
      visible: true,
      order: sections.length,
      content: defaults.content,
      settings: defaults.settings,
    };

    const insertAt = args.insertAt ?? sections.length;
    sections.splice(insertAt, 0, newSection);

    const reordered = sections.map((s, i) => ({ ...s, order: i }));

    await ctx.db.patch(args.siteId, {
      draftData: { ...site.draftData, sections: reordered },
      updatedAt: Date.now(),
    });

    return newSection.id;
  },
});

export const updateSectionContent = mutation({
  args: {
    siteId: v.id("sites"),
    sectionId: v.string(),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    const { site } = await getOwnedSite(ctx, args.siteId);

    const sections = site.draftData.sections.map((s: any) =>
      s.id === args.sectionId ? { ...s, content: args.content } : s
    );

    await ctx.db.patch(args.siteId, {
      draftData: { ...site.draftData, sections },
      updatedAt: Date.now(),
    });
  },
});

export const updateSectionSettings = mutation({
  args: {
    siteId: v.id("sites"),
    sectionId: v.string(),
    settings: v.any(),
  },
  handler: async (ctx, args) => {
    const { site } = await getOwnedSite(ctx, args.siteId);

    const sections = site.draftData.sections.map((s: any) =>
      s.id === args.sectionId ? { ...s, settings: args.settings } : s
    );

    await ctx.db.patch(args.siteId, {
      draftData: { ...site.draftData, sections },
      updatedAt: Date.now(),
    });
  },
});

export const toggleSectionVisibility = mutation({
  args: {
    siteId: v.id("sites"),
    sectionId: v.string(),
  },
  handler: async (ctx, args) => {
    const { site } = await getOwnedSite(ctx, args.siteId);

    const sections = site.draftData.sections.map((s: any) =>
      s.id === args.sectionId ? { ...s, visible: !s.visible } : s
    );

    await ctx.db.patch(args.siteId, {
      draftData: { ...site.draftData, sections },
      updatedAt: Date.now(),
    });
  },
});

export const reorderSections = mutation({
  args: {
    siteId: v.id("sites"),
    sectionIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { site } = await getOwnedSite(ctx, args.siteId);

    const sectionMap = new Map(
      site.draftData.sections.map((s: any) => [s.id, s])
    );

    const sections = args.sectionIds
      .map((id, i) => {
        const section = sectionMap.get(id);
        if (!section) return null;
        return { ...section, order: i };
      })
      .filter(Boolean);

    await ctx.db.patch(args.siteId, {
      draftData: { ...site.draftData, sections },
      updatedAt: Date.now(),
    });
  },
});

export const removeSection = mutation({
  args: {
    siteId: v.id("sites"),
    sectionId: v.string(),
  },
  handler: async (ctx, args) => {
    const { site } = await getOwnedSite(ctx, args.siteId);

    const sections = site.draftData.sections
      .filter((s: any) => s.id !== args.sectionId)
      .map((s: any, i: any) => ({ ...s, order: i }));

    await ctx.db.patch(args.siteId, {
      draftData: { ...site.draftData, sections },
      updatedAt: Date.now(),
    });
  },
});

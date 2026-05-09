import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { SectionContent } from "./validators";

const SECTION_DEFAULTS: Record<string, { content: unknown; settings: unknown }> = {
  hero: { content: { title: "Happy Birthday,", subtitle: "Beautiful!", titleAlignment: "center", height: "full", backgroundOverlay: 30, overlayColor: "#874e58", ctaText: "Celebrate", ctaLink: "#our-story", sendLoveText: "", heartAnimationDuration: 1000, loveMessages: ["You are amazing!", "Sending you all my love!", "You make the world brighter!", "Thinking of you today!"] }, settings: {} },
  message: { content: { heading: "A Letter to You", body: "Celebrating another incredible year of you.", alignment: "center", fontStyle: "default" }, settings: {} },
  gallery: { content: { images: [], layout: "grid", columns: 3, showCaptions: true, gap: "16px" }, settings: {} },
  timeline: { content: { heading: "Our Journey", events: [], style: "alternating", showDates: true, showImages: true }, settings: {} },
  quote: { content: { text: "Life is a beautiful journey.", style: "inline", backgroundStyle: "solid" }, settings: {} },
  countdown: { content: { title: "We can't wait to celebrate you!", targetDate: new Date(Date.now() + 30 * 86400000).toISOString(), expiredMessage: "The moment has arrived!", style: "boxes", showLabels: true }, settings: {} },
  map: { content: { latitude: 48.8566, longitude: 2.3522, label: "Paris", zoom: 12, mapStyle: "standard", showLabel: true }, settings: {} },
  divider: { content: { style: "line" }, settings: {} },
  spacer: { content: { height: "80px" }, settings: {} },
  stats: { content: { heading: "Our Milestones", items: [{ id: "1", value: "365", label: "Days Together" }, { id: "2", value: "1000+", label: "Memories" }, { id: "3", value: "1", label: "Love Story" }], layout: "row", animateOnScroll: true }, settings: {} },
  footer: { content: { text: "Made with love", socialLinks: [], showAttribution: true }, settings: {} },
  video: { content: { url: "", autoplay: false, muted: true }, settings: {} },
  audio: { content: { tracks: [{ id: crypto.randomUUID(), title: "Our Song", artist: "", storageId: "", url: "", order: 0, enabled: true }], playlistTitle: "Our Playlist", autoplay: false, loop: false, showPlaylist: true, showCoverImage: true, showProgressBar: true, showPlayer: true }, settings: {} },
  memory_highlights: { content: { image: "", heading: "A Year of Beautiful Light", body: "This past year has been illuminated by your smile.", signoff: "Cheers to many more" }, settings: {} },
  love_notes: { content: { heading: "Love Notes", subtitle: "Messages from those who adore you.", notes: [], ctaText: "Leave a Note", ctaLink: "#" }, settings: {} },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
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
    content: SectionContent,
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

export const setVisibility = mutation({
  args: {
    siteId: v.id("sites"),
    sectionId: v.string(),
    visible: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { site } = await getOwnedSite(ctx, args.siteId);

    const sections = site.draftData.sections.map((s: any) =>
      s.id === args.sectionId ? { ...s, visible: args.visible } : s
    );

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
      .map((s: any, i: number) => ({ ...s, order: i }));

    await ctx.db.patch(args.siteId, {
      draftData: { ...site.draftData, sections },
      updatedAt: Date.now(),
    });
  },
});

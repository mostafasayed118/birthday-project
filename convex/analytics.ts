import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export type AnalyticsEventType = "page_view" | "link_click" | "audio_play" | "quote_share";

const Metadata = v.object({
  userAgent: v.optional(v.string()),
  referrer: v.optional(v.string()),
  device: v.optional(v.string()),
  country: v.optional(v.string()),
});

export const recordEvent = mutation({
  args: {
    siteSlug: v.string(),
    eventType: v.union(
      v.literal("page_view"),
      v.literal("link_click"),
      v.literal("audio_play"),
      v.literal("quote_share")
    ),
    section: v.optional(v.string()),
    metadata: v.optional(Metadata),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert("analytics", {
      siteSlug: args.siteSlug,
      eventType: args.eventType,
      section: args.section,
      timestamp: Date.now(),
      metadata: args.metadata,
    });
    return eventId;
  },
});

export const getBySite = query({
  args: { siteSlug: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { siteSlug, limit = 1000 }) => {
    const events = await ctx.db
      .query("analytics")
      .withIndex("by_site", (q) => q.eq("siteSlug", siteSlug))
      .order("desc")
      .take(limit);
    return events;
  },
});

export const getStats = query({
  args: {
    siteSlug: v.string(),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    category: v.optional(v.string()),
    region: v.optional(v.string()),
  },
  handler: async (ctx, { siteSlug, startDate, endDate, category, region }) => {
    let events = await ctx.db
      .query("analytics")
      .withIndex("by_site", (q) => q.eq("siteSlug", siteSlug))
      .collect();

    if (startDate) {
      events = events.filter(e => e.timestamp >= startDate);
    }
    if (endDate) {
      events = events.filter(e => e.timestamp <= endDate);
    }
    if (category && category !== "All") {
      events = events.filter(e => e.section === category.toLowerCase());
    }
    if (region && region !== "All Regions") {
      events = events.filter(e => e.metadata?.country === region);
    }

    if (events.length === 0) {
      return {
        totalViews: 0,
        uniqueVisitors: 0,
        engagementRate: 0,
        avgSession: 0,
        trendData: [],
        deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
        heatmapData: [],
      };
    }

    const pageViews = events.filter((e) => e.eventType === "page_view");
    const totalViews = pageViews.length;

    const uniqueVisitors = new Set(
      pageViews.map((e) => e.metadata?.userAgent ?? "unknown")
    ).size;

    const interactions = events.filter(
      (e) => e.eventType !== "page_view"
    ).length;
    const engagementRate =
      totalViews > 0 ? Math.round((interactions / totalViews) * 100) : 0;

    const now = Date.now();
    
    const trendData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const periodStart = now - i * 24 * 60 * 60 * 1000;
      const periodEnd = now - (i - 1) * 24 * 60 * 60 * 1000;
      const dayViews = pageViews.filter(
        (e) => e.timestamp >= periodStart && e.timestamp < periodEnd
      ).length;
      const dayVisitors = new Set(
        pageViews
          .filter((e) => e.timestamp >= periodStart && e.timestamp < periodEnd)
          .map((e) => e.metadata?.userAgent ?? "unknown")
      ).size;
      const dayInteractions = events.filter(
        (e) =>
          e.timestamp >= periodStart &&
          e.timestamp < periodEnd &&
          e.eventType !== "page_view"
      ).length;
      trendData.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        views: dayViews,
        visitors: dayVisitors,
        interactions: dayInteractions,
      });
    }

    const avgSession = totalViews > 0 ? Math.round(totalViews / Math.max(1, uniqueVisitors) * 0.5) : 0;

    const deviceBreakdown = {
      desktop: pageViews.filter((e) => e.metadata?.device === "desktop")
        .length,
      mobile: pageViews.filter((e) => e.metadata?.device === "mobile")
        .length,
      tablet: pageViews.filter((e) => e.metadata?.device === "tablet")
        .length,
    };

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const hours = ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM", "12AM"];
    // Maps JS getDay() (0=Sun..6=Sat) to our days array (0=Mon..6=Sun)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const heatmapData = [];

    for (const day of days) {
      for (const hour of hours) {
        const hourIndex = hours.indexOf(hour);
        const cellViews = pageViews.filter((e) => {
          const d = new Date(e.timestamp);
          const dayName = dayNames[d.getDay()];
          const hourVal = d.getHours();
          const hourMatch =
            (hourIndex === 0 && hourVal >= 6 && hourVal < 8) ||
            (hourIndex === 1 && hourVal >= 8 && hourVal < 10) ||
            (hourIndex === 2 && hourVal >= 10 && hourVal < 12) ||
            (hourIndex === 3 && hourVal >= 12 && hourVal < 14) ||
            (hourIndex === 4 && hourVal >= 14 && hourVal < 16) ||
            (hourIndex === 5 && hourVal >= 16 && hourVal < 18) ||
            (hourIndex === 6 && hourVal >= 18 && hourVal < 20) ||
            (hourIndex === 7 && hourVal >= 20 && hourVal < 22) ||
            (hourIndex === 8 && hourVal >= 22) ||
            (hourIndex === 9 && hourVal < 6);
          return dayName === day && hourMatch;
        }).length;
        heatmapData.push({
          hour,
          day,
          value: cellViews,
        });
      }
    }

    return {
      totalViews,
      uniqueVisitors,
      engagementRate,
      avgSession,
      trendData,
      deviceBreakdown,
      heatmapData,
    };
  },
});
// Seed data for content management
import { mutation } from "../_generated/server";
import { CONTENT_KEYS } from "../../lib/content-keys";

type ContentCategory = "ui" | "seo" | "error" | "page" | "email";

const initialContent: Array<{
  key: string;
  translations: { en: string; ar?: string; es?: string; fr?: string };
  category: ContentCategory;
}> = [
  // Dashboard
  {
    key: CONTENT_KEYS.DASHBOARD.HERO.TITLE,
    translations: { en: "Analytics", ar: "التحليلات" },
    category: "page",
  },
  {
    key: CONTENT_KEYS.DASHBOARD.HERO.SUBTITLE,
    translations: { en: "Track your microsites performance and visitor engagement.", ar: "تتبع أداء مواقعك الصغيرة وتفاعل الزوار." },
    category: "page",
  },
  {
    key: CONTENT_KEYS.DASHBOARD.BUTTON.CREATE_SITE,
    translations: { en: "New Site", ar: "موقع جديد" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.DASHBOARD.BUTTON.SAVE,
    translations: { en: "Save", ar: "حفظ" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.DASHBOARD.BUTTON.CANCEL,
    translations: { en: "Cancel", ar: "إلغاء" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.DASHBOARD.NAV.DASHBOARD,
    translations: { en: "Dashboard", ar: "لوحة التحكم" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.DASHBOARD.NAV.ANALYTICS,
    translations: { en: "Analytics", ar: "التحليلات" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.DASHBOARD.NAV.SITES,
    translations: { en: "My Sites", ar: "مواقعي" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.DASHBOARD.ACCOUNT,
    translations: { en: "Account", ar: "الحساب" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.DASHBOARD.BRAND,
    translations: { en: "Microsite Studio", ar: "ستوديو المواقع الصغيرة" },
    category: "ui",
  },

  // Analytics
  {
    key: CONTENT_KEYS.ANALYTICS.PAGE_TITLE,
    translations: { en: "Analytics", ar: "التحليلات" },
    category: "page",
  },
  {
    key: CONTENT_KEYS.ANALYTICS.PAGE_SUBTITLE,
    translations: { en: "Monitor your microsites performance and visitor engagement in real-time.", ar: "مراقبة أداء مواقعك الصغيرة وتفاعل الزوار في الوقت الحقيقي." },
    category: "page",
  },
  {
    key: CONTENT_KEYS.ANALYTICS.LIVE_BADGE,
    translations: { en: "Live data", ar: "بيانات مباشرة" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.ANALYTICS.FILTERS_TITLE,
    translations: { en: "Filters", ar: "التصفيات" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.ANALYTICS.FILTERS_CLEAR,
    translations: { en: "Clear all", ar: "مسح الكل" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.ANALYTICS.ACTIVE_INDICATOR,
    translations: { en: "Filters active — showing filtered results", ar: "التصفيات نشطة - عرض النتائج المفلترة" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.ANALYTICS.KPI_CHANGE,
    translations: { en: "vs last period", ar: "مقارنة بالفترة السابقة" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.ANALYTICS.TREND_TITLE,
    translations: { en: "Traffic Trends (30 Days)", ar: "اتجاهات حركة المرور (30 يوم)" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.ANALYTICS.BAR_TITLE,
    translations: { en: "Section Engagement by Device", ar: "تفاعل الأقسام حسب الجهاز" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.ANALYTICS.GAUGE_TITLE,
    translations: { en: "Performance Metrics", ar: "مقاييس الأداء" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.ANALYTICS.HEATMAP_TITLE,
    translations: { en: "Visitor Activity Heatmap", ar: "خريطة حرارية لنشاط الزوار" },
    category: "ui",
  },
  {
    key: CONTENT_KEYS.ANALYTICS.FOOTER,
    translations: { en: "Data refreshes every 60 seconds · Last updated: ", ar: "تحديث البيانات كل 60 ثانية · آخر تحديث: " },
    category: "ui",
  },

  // Accessibility
  {
    key: CONTENT_KEYS.ACCESSIBILITY.NAV_LABEL,
    translations: { en: "Main navigation", ar: "التنقل الرئيسي" },
    category: "ui",
  },];

export const seedContent = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const now = Date.now();

    for (const item of initialContent) {
      const existing = await ctx.db
        .query("content")
        .withIndex("by_key", (q) => q.eq("key", item.key))
        .first();

      if (!existing) {
        await ctx.db.insert("content", {
          key: item.key,
          translations: item.translations,
          category: item.category,
          version: 1,
          updatedAt: now,
          updatedBy: identity.subject,
        });
      }
    }

    return { seeded: initialContent.length };
  },
});
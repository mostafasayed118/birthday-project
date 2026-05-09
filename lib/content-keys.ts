// Centralized content key registry
export const CONTENT_KEYS = {
  // Dashboard
  DASHBOARD: {
    HERO: {
      TITLE: "dashboard.hero.title",
      SUBTITLE: "dashboard.hero.subtitle",
    },
    BUTTON: {
      CREATE_SITE: "dashboard.button.createSite",
      SAVE: "dashboard.button.save",
      CANCEL: "dashboard.button.cancel",
    },
    SECTION: {
      TITLE: "dashboard.section.title",
      SUBTITLE: "dashboard.section.subtitle",
    },
    NAV: {
      DASHBOARD: "dashboard.nav.dashboard",
      ANALYTICS: "dashboard.nav.analytics",
      SITES: "dashboard.nav.sites",
    },
    ACCOUNT: "dashboard.account",
    BRAND: "dashboard.brand",
  },

  // Analytics
  ANALYTICS: {
    PAGE_TITLE: "analytics.page.title",
    PAGE_SUBTITLE: "analytics.page.subtitle",
    LIVE_BADGE: "analytics.live.badge",
    FILTERS_TITLE: "analytics.filters.title",
    FILTERS_CLEAR: "analytics.filters.clear",
    ACTIVE_INDICATOR: "analytics.filters.active",
    KPI_CHANGE: "analytics.kpi.change",
    TREND_TITLE: "analytics.trend.title",
    BAR_TITLE: "analytics.bar.title",
    GAUGE_TITLE: "analytics.gauge.title",
    HEATMAP_TITLE: "analytics.heatmap.title",
    HEATMAP_LEGEND: "analytics.heatmap.legend",
    FOOTER: "analytics.footer.note",
  },

  // SEO
  SEO: {
    DASHBOARD_TITLE: "seo.dashboard.title",
    DASHBOARD_DESCRIPTION: "seo.dashboard.description",
    ANALYTICS_TITLE: "seo.analytics.title",
    ANALYTICS_DESCRIPTION: "seo.analytics.description",
  },

  // Errors
  ERRORS: {
    GENERIC: "errors.generic",
    NOT_FOUND: "errors.notFound",
    UNAUTHORIZED: "errors.unauthorized",
  },

  // Accessibility
  ACCESSIBILITY: {
    NAV_LABEL: "a11y.nav.label",
  },
} as const;

// Type helpers
export type ContentKeyPath = `${keyof typeof CONTENT_KEYS}.${string}`;
export type ContentKey = (typeof CONTENT_KEYS)[keyof typeof CONTENT_KEYS];

// Flatten all keys for type safety
export type AllContentKeys = 
  | typeof CONTENT_KEYS.DASHBOARD.HERO.TITLE
  | typeof CONTENT_KEYS.DASHBOARD.HERO.SUBTITLE
  | typeof CONTENT_KEYS.DASHBOARD.BUTTON.CREATE_SITE
  | typeof CONTENT_KEYS.DASHBOARD.BUTTON.SAVE
  | typeof CONTENT_KEYS.DASHBOARD.BUTTON.CANCEL
  | typeof CONTENT_KEYS.DASHBOARD.SECTION.TITLE
  | typeof CONTENT_KEYS.DASHBOARD.SECTION.SUBTITLE
  | typeof CONTENT_KEYS.DASHBOARD.NAV.DASHBOARD
  | typeof CONTENT_KEYS.DASHBOARD.NAV.ANALYTICS
  | typeof CONTENT_KEYS.DASHBOARD.NAV.SITES
  | typeof CONTENT_KEYS.DASHBOARD.ACCOUNT
  | typeof CONTENT_KEYS.DASHBOARD.BRAND
  | typeof CONTENT_KEYS.ANALYTICS.PAGE_TITLE
  | typeof CONTENT_KEYS.ANALYTICS.PAGE_SUBTITLE
  | typeof CONTENT_KEYS.ANALYTICS.LIVE_BADGE
  | typeof CONTENT_KEYS.ANALYTICS.FILTERS_TITLE
  | typeof CONTENT_KEYS.ANALYTICS.FILTERS_CLEAR
  | typeof CONTENT_KEYS.ANALYTICS.ACTIVE_INDICATOR
  | typeof CONTENT_KEYS.ANALYTICS.KPI_CHANGE
  | typeof CONTENT_KEYS.ANALYTICS.TREND_TITLE
  | typeof CONTENT_KEYS.ANALYTICS.BAR_TITLE
  | typeof CONTENT_KEYS.ANALYTICS.GAUGE_TITLE
  | typeof CONTENT_KEYS.ANALYTICS.HEATMAP_TITLE
  | typeof CONTENT_KEYS.ANALYTICS.HEATMAP_LEGEND
  | typeof CONTENT_KEYS.ANALYTICS.FOOTER
  | typeof CONTENT_KEYS.SEO.DASHBOARD_TITLE
  | typeof CONTENT_KEYS.SEO.DASHBOARD_DESCRIPTION
  | typeof CONTENT_KEYS.SEO.ANALYTICS_TITLE
  | typeof CONTENT_KEYS.SEO.ANALYTICS_DESCRIPTION
  | typeof CONTENT_KEYS.ERRORS.GENERIC
  | typeof CONTENT_KEYS.ERRORS.NOT_FOUND
  | typeof CONTENT_KEYS.ERRORS.UNAUTHORIZED
  | typeof CONTENT_KEYS.ACCESSIBILITY.NAV_LABEL;
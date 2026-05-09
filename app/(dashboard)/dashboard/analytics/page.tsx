"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { type FilterState, type AnalyticsStats, type TrendDataPoint, type HeatmapCell } from "@/lib/dashboard-data";
import { KpiCard } from "@/components/dashboard/analytics/kpi-card";
import { TrendChart } from "@/components/dashboard/analytics/trend-chart";
import { DeviceBarChart } from "@/components/dashboard/analytics/device-bar-chart";
import { Heatmap } from "@/components/dashboard/analytics/heatmap";
import { GaugeCard } from "@/components/dashboard/analytics/gauge-card";
import { FilterPanel } from "@/components/dashboard/analytics/filter-panel";
import { ExportButton } from "@/components/dashboard/analytics/export-button";
import { Activity } from "lucide-react";
import { Translatable } from "@/components/translatable";
import { CONTENT_KEYS } from "@/lib/content-keys";
import { containerVariants } from "@/lib/animations";

export default function AnalyticsPage() {
  const sites = useQuery(api.sites.listByOwner);
  const [selectedSiteSlug, setSelectedSiteSlug] = useState<string>("");

  // Derive effective slug: user selection takes priority, otherwise first site
  const effectiveSiteSlug = useMemo(() => {
    if (selectedSiteSlug) return selectedSiteSlug;
    return sites?.[0]?.slug ?? "";
  }, [selectedSiteSlug, sites]);

  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: "", end: "" },
    category: "All",
    region: "All Regions",
  });

  const { stats } = useAnalyticsStats(effectiveSiteSlug, filters);

  const kpiData = useMemo(() => [
    {
      id: "total-views",
      label: "Total Views",
      value: stats?.totalViews ?? 0,
      previousValue: 0,
      format: "number" as const,
      icon: "Eye",
      color: "info" as const,
    },
    {
      id: "unique-visitors",
      label: "Unique Visitors",
      value: stats?.uniqueVisitors ?? 0,
      previousValue: 0,
      format: "number" as const,
      icon: "Users",
      color: "success" as const,
    },
    {
      id: "engagement-rate",
      label: "Engagement Rate",
      value: stats?.engagementRate ?? 0,
      previousValue: 0,
      format: "percentage" as const,
      icon: "TrendingUp",
      color: "success" as const,
    },
    {
      id: "avg-session",
      label: "Avg. Session Duration",
      value: stats?.avgSession ?? 0,
      previousValue: 0,
      format: "number" as const,
      icon: "Clock",
      color: "warning" as const,
    },
  ], [stats]);

  const deviceBarData = useMemo(() => {
    const breakdown = stats?.deviceBreakdown;
    if (!breakdown || (breakdown.desktop === 0 && breakdown.mobile === 0 && breakdown.tablet === 0)) return [];
    // Build per-section breakdown from real data only
    return [
      { name: "All Sections", desktop: breakdown.desktop, mobile: breakdown.mobile, tablet: breakdown.tablet },
    ];
  }, [stats]);

  const trendData = useMemo((): TrendDataPoint[] => {
    return stats?.trendData ?? [];
  }, [stats]);

  const heatmapGridData = useMemo((): HeatmapCell[] => {
    return stats?.heatmapData ?? [];
  }, [stats]);

  const hasActiveFilters =
    filters.category !== "All" ||
    filters.region !== "All Regions" ||
    filters.dateRange.start !== "" ||
    filters.dateRange.end !== "";

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Page header */}
      <motion.div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between" variants={containerVariants}>
        <div>
          <motion.h2 className="text-2xl font-bold tracking-tight text-foreground" variants={containerVariants}>
            <Translatable id={CONTENT_KEYS.ANALYTICS.PAGE_TITLE} />
          </motion.h2>
          <motion.p className="text-sm text-muted-foreground" variants={containerVariants}>
            <Translatable id={CONTENT_KEYS.ANALYTICS.PAGE_SUBTITLE} />
          </motion.p>
        </div>
        <div className="flex items-center gap-2">
          {/* Site selector */}
          {sites && sites.length > 1 && (
            <select
              value={selectedSiteSlug}
              onChange={(e) => setSelectedSiteSlug(e.target.value)}
              className="h-8 rounded-lg border border-border/50 bg-background px-2.5 text-xs cursor-pointer"
              aria-label="Select site for analytics"
            >
              {sites.map((site) => (
                <option key={site._id} value={site.slug}>
                  {site.title}
                </option>
              ))}
            </select>
          )}
          <motion.div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Activity className="h-3 w-3 text-green-500" />
            <span><Translatable id={CONTENT_KEYS.ANALYTICS.LIVE_BADGE} /></span>
          </motion.div>
        </div>
      </motion.div>

      {/* Filter panel */}
      <FilterPanel filters={filters} onChange={setFilters} />

      {/* Active filter indicator */}
      {hasActiveFilters && (
        <motion.div className="flex items-center gap-2 text-xs text-muted-foreground"
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <motion.span className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
          <Translatable id={CONTENT_KEYS.ANALYTICS.ACTIVE_INDICATOR} />
        </motion.div>
      )}

      {/* KPI cards */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.id} data={kpi} />
        ))}
      </motion.div>

      {/* Trend chart */}
      <motion.div className="space-y-2">
        <div className="flex justify-end">
          <ExportButton data={trendData} filename="trend-data" />
        </div>
        <TrendChart data={trendData} />
      </motion.div>

      {/* Two-column layout */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DeviceBarChart data={deviceBarData} className="lg:col-span-2" />
        <GaugeCard data={[]} />
      </motion.div>

      {/* Heatmap */}
      <Heatmap data={heatmapGridData} />

      {/* Footer */}
      <motion.div className="flex items-center justify-center py-2" variants={containerVariants}>
        <p className="text-[11px] text-muted-foreground/60">
          <Translatable id={CONTENT_KEYS.ANALYTICS.FOOTER} />
          {new Date().toLocaleTimeString()}
        </p>
      </motion.div>
    </motion.div>
  );
}

function useAnalyticsStats(siteSlug: string, filters: FilterState) {
  const startDate = filters.dateRange.start ? new Date(filters.dateRange.start).getTime() : undefined;
  const endDate = filters.dateRange.end ? new Date(filters.dateRange.end).getTime() : undefined;

  const stats = useQuery(
    api.analytics.getStats,
    siteSlug ? { siteSlug, startDate, endDate, category: filters.category, region: filters.region } : "skip"
  ) as AnalyticsStats | undefined;

  return { stats };
}


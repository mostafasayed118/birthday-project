// Types

export interface KpiData {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  format: "number" | "currency" | "percentage";
  icon: string;
  color: "success" | "danger" | "warning" | "info";
}

export interface TrendDataPoint {
  date: string;
  views: number;
  visitors: number;
  interactions: number;
}

export interface BarDataPoint {
  name: string;
  desktop: number;
  mobile: number;
  tablet: number;
}

export interface HeatmapCell {
  hour: string;
  day: string;
  value: number;
}

export interface GaugeData {
  id: string;
  label: string;
  value: number;
  max: number;
  unit: string;
  color: "success" | "danger" | "warning" | "info";
}

export interface FilterState {
  dateRange: { start: string; end: string };
  category: string;
  region: string;
}

export interface AnalyticsStats {
  totalViews: number;
  uniqueVisitors: number;
  engagementRate: number;
  avgSession: number;
  trendData: TrendDataPoint[];
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
  heatmapData: HeatmapCell[];
}

// Color constants with high-contrast accessible alternatives

export const semanticColors = {
  success: { light: "#dcfce7", main: "#22c55e", dark: "#16a34a" },
  danger: { light: "#fee2e2", main: "#ef4444", dark: "#dc2626" },
  warning: { light: "#fef9c3", main: "#eab308", dark: "#ca8a04" },
  info: { light: "#dbeafe", main: "#3b82f6", dark: "#2563eb" },
} as const;

// High-contrast color palette for accessibility
export const highContrastColors = {
  primary: "#2563eb",    // Blue
  secondary: "#dc2626",  // Red
  tertiary: "#16a34a",   // Green
  quaternary: "#ca8a04", // Yellow
  quinary: "#7c3aed",    // Purple
};

// Mock data

export const kpiData: KpiData[] = [
  {
    id: "total-views",
    label: "Total Views",
    value: 284520,
    previousValue: 241300,
    format: "number",
    icon: "Eye",
    color: "info",
  },
  {
    id: "unique-visitors",
    label: "Unique Visitors",
    value: 68340,
    previousValue: 54210,
    format: "number",
    icon: "Users",
    color: "success",
  },
  {
    id: "engagement-rate",
    label: "Engagement Rate",
    value: 73.2,
    previousValue: 68.9,
    format: "percentage",
    icon: "TrendingUp",
    color: "success",
  },
  {
    id: "avg-session",
    label: "Avg. Session Duration",
    value: 4.7,
    previousValue: 5.1,
    format: "number",
    icon: "Clock",
    color: "warning",
  },
];

export function generateTrendData(): TrendDataPoint[] {
  const data: TrendDataPoint[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = isWeekend ? 8000 : 12000;
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: Math.floor(base + Math.random() * 5000 + (30 - i) * 200),
      visitors: Math.floor((base + Math.random() * 3000 + (30 - i) * 150) * 0.4),
      interactions: Math.floor((base + Math.random() * 2000 + (30 - i) * 100) * 0.25),
    });
  }
  return data;
}

export const barData: BarDataPoint[] = [
  { name: "Hero", desktop: 4200, mobile: 3800, tablet: 1200 },
  { name: "Gallery", desktop: 3100, mobile: 4500, tablet: 980 },
  { name: "Timeline", desktop: 2800, mobile: 2200, tablet: 870 },
  { name: "Message", desktop: 1900, mobile: 3100, tablet: 650 },
  { name: "Quote", desktop: 1500, mobile: 1800, tablet: 420 },
  { name: "Countdown", desktop: 980, mobile: 2400, tablet: 310 },
  { name: "Footer", desktop: 720, mobile: 1100, tablet: 210 },
];

export function generateHeatmapData(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = [
    "6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM", "12AM",
  ];
  for (const day of days) {
    for (const hour of hours) {
      const isWeekend = day === "Sat" || day === "Sun";
      const isPeakHour = ["10AM", "12PM", "2PM", "8PM"].includes(hour);
      let base = isWeekend ? 200 : 350;
      if (isPeakHour) base *= 1.8;
      cells.push({
        hour,
        day,
        value: Math.floor(base + Math.random() * 200),
      });
    }
  }
  return cells;
}

export const heatmapData: HeatmapCell[] = generateHeatmapData();

export const gaugeData: GaugeData[] = [
  { id: "page-speed", label: "Page Speed", value: 87, max: 100, unit: "score", color: "success" },
  { id: "seo-score", label: "SEO Score", value: 92, max: 100, unit: "score", color: "success" },
  { id: "bounce-rate", label: "Bounce Rate", value: 34, max: 100, unit: "%", color: "warning" },
  { id: "load-time", label: "Load Time", value: 1.8, max: 5, unit: "s", color: "info" },
];

export const categories = ["All", "Birthday", "Anniversary", "Valentine", "Proposal", "Love Story"];
export const regions = ["All Regions", "North America", "Europe", "Asia", "South America", "Africa", "Oceania"];

// Helpers

export function formatValue(value: number, format: KpiData["format"]): string {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
    case "percentage":
      return `${value.toFixed(1)}%`;
    default:
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toLocaleString();
  }
}

export function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

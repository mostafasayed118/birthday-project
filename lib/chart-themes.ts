// Centralized chart theme system
export const CHART_THEME = {
  colors: {
    primary: "hsl(var(--chart-1))",
    secondary: "hsl(var(--chart-2))",
    tertiary: "hsl(var(--chart-3))",
    success: "hsl(var(--chart-4))",
    warning: "hsl(var(--chart-5))",
    muted: "hsl(var(--muted-foreground))",
  },
  typography: {
    title: "text-sm font-medium text-muted-foreground",
    value: "text-2xl font-bold text-foreground",
    label: "text-xs text-muted-foreground",
    caption: "text-[10px] text-muted-foreground",
  },
  accessibility: {
    minContrast: 4.5,
    highContrast: {
      primary: "#2563eb",
      secondary: "#dc2626",
      tertiary: "#16a34a",
      success: "#ca8a04",
      warning: "#7c3aed",
    },
  },
} as const;

export type ChartColor = keyof typeof CHART_THEME.colors;

// Color utilities for accessibility
export function getAccessibleColors(isHighContrast: boolean = false) {
  return isHighContrast ? CHART_THEME.accessibility.highContrast : {
    primary: "#3b82f6",
    secondary: "#ef4444",
    tertiary: "#22c55e",
    success: "#eab308",
    warning: "#a855f7",
  };
}

// Get chart color by index with accessibility support
export function getChartColor(index: number, isHighContrast: boolean = false): string {
  const colors = getAccessibleColors(isHighContrast);
  const colorKeys = Object.keys(colors) as (keyof typeof colors)[];
  return colors[colorKeys[index % colorKeys.length]];
}

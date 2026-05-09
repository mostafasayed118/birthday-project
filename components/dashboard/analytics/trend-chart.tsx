"use client";

import { useState, useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Brush, ReferenceLine } from "recharts";
import { motion } from "framer-motion";
import { type TrendDataPoint, highContrastColors } from "@/lib/dashboard-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itemVariants } from "@/lib/animations";

type MetricKey = "views" | "visitors" | "interactions";
const METRICS = {
  views: { label: "Views", color: highContrastColors.primary },
  visitors: { label: "Visitors", color: highContrastColors.secondary },
  interactions: { label: "Interactions", color: highContrastColors.tertiary },
} as const;

export function TrendChart({ data, className }: TrendChartProps) {
  const [visibleMetrics, setVisibleMetrics] = useState<Set<MetricKey>>(() => new Set(["views", "visitors", "interactions"]));
  const chartData = useTrendData(data);
  const averageViews = useAverageValue(data, d => d.views);

  if (!data.length) return <EmptyChartCard title="Traffic Trends (30 Days)" className={className} />;

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <Card className={cardClasses(className)}>
        <ChartHeader metrics={METRICS} visible={visibleMetrics} onToggle={setVisibleMetrics} />
        <CardContent>
          <ResponsiveContainer height={350}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <ChartAxes />
              <Tooltip contentStyle={tooltipStyle} />
              <ReferenceLine y={averageViews} stroke={highContrastColors.primary} strokeDasharray="4 4" label={{ value: "Avg", position: "insideTopLeft", fontSize: 10 }} />
              {renderAreas(visibleMetrics)}
              <Brush dataKey="date" height={30} stroke={highContrastColors.primary} fill="hsl(var(--muted))" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function useTrendData(data: TrendDataPoint[]) {
  return useMemo(() => data.map((point, index) => ({ ...point, trend: calculateTrend(data, index) })), [data]);
}

function useAverageValue<T>(data: T[], selector: (item: T) => number) {
  return useMemo(() => data.reduce((sum, item) => sum + selector(item), 0) / data.length, [data, selector]);
}

function calculateTrend(data: TrendDataPoint[], index: number) {
  const n = data.length || 1;
  const sumX = (n - 1) * n / 2;
  const sumXY = data.reduce((sum, d, i) => sum + i * d.views, 0);
  const sumY = data.reduce((sum, d) => sum + d.views, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX - sumX * sumX);
  return sumY / n + slope * (index - n / 2);
}

const ChartHeader = ({ metrics, visible, onToggle }: ChartHeaderProps) => (
  <CardHeader className="pb-2">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <CardTitle className="text-sm font-medium text-muted-foreground">Traffic Trends (30 Days)</CardTitle>
      <div className="flex items-center gap-2">{Object.entries(metrics).map(([key, cfg]) => (
        <MetricButton key={key} metric={key as MetricKey} config={cfg} isActive={visible.has(key as MetricKey)} onToggle={onToggle} />
      ))}</div>
    </div>
  </CardHeader>
);

const MetricButton = ({ metric, config, isActive, onToggle }: MetricButtonProps) => (
  <motion.button onClick={() => toggleMetric(metric, isActive, onToggle)} className={metricButtonClasses(isActive)} aria-pressed={isActive} whileTap={{ scale: 0.95 }}>
    <motion.span className="h-2 w-2 rounded-full" style={{ backgroundColor: config.color }} whileHover={{ scale: 1.2 }} />
    {config.label}
  </motion.button>
);

const toggleMetric = (metric: MetricKey, isActive: boolean, onToggle: (value: Set<MetricKey> | ((prev: Set<MetricKey>) => Set<MetricKey>)) => void) => {
  onToggle((prev) => {
    const next = new Set(prev);
    if (next.size > 1 || !isActive) {
      if (isActive) next.delete(metric); else next.add(metric);
    }
    return next;
  });
};

const renderAreas = (visibleMetrics: Set<MetricKey>) => Object.entries(METRICS).map(([key, config]) => 
  visibleMetrics.has(key as MetricKey) && <Area key={key} type="monotone" dataKey={key} stroke={config.color} strokeWidth={2} fill={`url(#gradient-${key})`} dot={false} activeDot={{ r: 4 }} />
);

const cardClasses = (className?: string) => `border-border/50 shadow-sm ${className ?? ""}`;
const metricButtonClasses = (isActive: boolean) => `flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground opacity-50 hover:opacity-75"}`;
const tooltipStyle = { backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" };

const ChartAxes = () => (
  <>
    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : `${v}`} />
  </>
);

const EmptyChartCard = ({ title, className }: { title: string; className?: string }) => (
  <Card className={cardClasses(className)}>
    <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle></CardHeader>
    <CardContent><div className="flex items-center justify-center h-[350px] text-muted-foreground">No data available</div></CardContent>
  </Card>
);

interface TrendChartProps { data: TrendDataPoint[]; className?: string; }
interface ChartHeaderProps { metrics: typeof METRICS; visible: Set<MetricKey>; onToggle: (value: Set<MetricKey> | ((prev: Set<MetricKey>) => Set<MetricKey>)) => void; }
interface MetricButtonProps { metric: MetricKey; config: { label: string; color: string }; isActive: boolean; onToggle: (value: Set<MetricKey> | ((prev: Set<MetricKey>) => Set<MetricKey>)) => void; }

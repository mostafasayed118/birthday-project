"use client";

import { cn } from "@/lib/utils";
import { type GaugeData, semanticColors, highContrastColors } from "@/lib/dashboard-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GaugeCardProps {
  data: GaugeData[];
  className?: string;
}

function GaugeRing({ item }: { item: GaugeData }) {
  const colors = semanticColors[item.color] || { main: highContrastColors.primary, dark: highContrastColors.primary };
  const percentage = (item.value / item.max) * 100;
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75; // 270° arc

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[88px] h-[88px]">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-[135deg]">
          {/* Background arc */}
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />
          {/* Value arc */}
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={colors.main}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground">
            {item.unit === "s" ? item.value.toFixed(1) : Math.round(item.value)}
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-foreground">{item.label}</p>
        <p className="text-[10px] text-muted-foreground">{item.unit}</p>
      </div>
    </div>
  );
}

export function GaugeCard({ data, className }: GaugeCardProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={cn("border-border/50 shadow-sm", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[150px] text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-border/50 shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-around flex-wrap gap-4 py-2">
          {data.map((item) => (
            <GaugeRing key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

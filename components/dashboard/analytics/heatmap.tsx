"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { type HeatmapCell } from "@/lib/dashboard-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeatmapProps {
  data: HeatmapCell[];
  className?: string;
}

interface DrillDownData {
  day: string;
  hour: string;
  values: HeatmapCell[];
}

interface HeatmapHeaderProps {
  selectedCell: DrillDownData | null;
  onClear: () => void;
}

interface HeatmapGridProps {
  days: string[];
  hours: string[];
  grid: Map<string, number>;
  min: number;
  max: number;
  selected: DrillDownData | null;
  onClick: (day: string, hour: string) => void;
}

interface HourHeaderProps {
  hours: string[];
  onClick: (day: string, hour: string) => void;
}

interface DayRowProps {
  day: string;
  hours: string[];
  grid: Map<string, number>;
  min: number;
  max: number;
  selected: DrillDownData | null;
  onClick: (day: string, hour: string) => void;
}

const HEAT_COLORS = [
  { threshold: 0.2, bg: "bg-blue-100", text: "text-blue-800" },
  { threshold: 0.4, bg: "bg-blue-300", text: "text-blue-900" },
  { threshold: 0.6, bg: "bg-blue-500", text: "text-white" },
  { threshold: 0.8, bg: "bg-blue-700", text: "text-white" },
  { threshold: 1.0, bg: "bg-blue-900", text: "text-white" },
] as const;

export function Heatmap({ data, className }: HeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<DrillDownData | null>(null);
  const { grid, days, hours, min, max } = useHeatmapData(data);

  const handleCellClick = (day: string, hour: string) => {
    const cellData = data.filter(d => d.day === day && d.hour === hour);
    setSelectedCell(cellData.length ? { day, hour, values: cellData } : null);
  };

  if (!days.length || !hours.length) return <EmptyHeatmapCard className={className} />;

  return (
    <Card className={cn("border-border/50 shadow-sm", className)}>
      <HeatmapHeader selectedCell={selectedCell} onClear={() => setSelectedCell(null)} />
      <CardContent>
        <HeatmapGrid days={days} hours={hours} grid={grid} min={min} max={max} 
          selected={selectedCell} onClick={handleCellClick} />
      </CardContent>
    </Card>
  );
}

const useHeatmapData = (data: HeatmapCell[]) => useMemo(() => {
  if (!data.length) return { days: [], hours: [], min: 0, max: 0, grid: new Map() };
  const grid = new Map(data.map(c => [`${c.day}-${c.hour}`, c.value]));
  return {
    days: [...new Set(data.map(c => c.day))],
    hours: [...new Set(data.map(c => c.hour))],
    min: Math.min(...data.map(c => c.value)),
    max: Math.max(...data.map(c => c.value)),
    grid,
  };
}, [data]);

const getHeatColor = (value: number, min: number, max: number) => {
  const ratio = (value - min) / (max - min || 1);
  const color = HEAT_COLORS.find(c => ratio <= c.threshold)!;
  return `${color.bg} ${color.text}`;
};

const HeatmapHeader = ({ selectedCell, onClear }: HeatmapHeaderProps) => (
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">Visitor Activity Heatmap</CardTitle>
    <Legend />
    {selectedCell && (
      <div className="mt-2 p-2 bg-accent rounded-md">
        <span className="text-xs font-medium">Drill-down: {selectedCell.day} @ {selectedCell.hour}</span>
        <button onClick={onClear} className="ml-2 text-xs text-primary hover:underline">Clear</button>
      </div>
    )}
  </CardHeader>
);

const Legend = () => (
  <div className="flex items-center gap-2 mt-1">
    <span className="text-[10px] text-muted-foreground">Low</span>
    <div className="flex gap-0.5">{HEAT_COLORS.map((c, i) => (
      <div key={i} className={cn("h-3 w-3 rounded-sm", c.bg)} />
    ))}</div>
    <span className="text-[10px] text-muted-foreground">High</span>
  </div>
);

const EmptyHeatmapCard = ({ className }: { className?: string }) => (
  <Card className={cn("border-border/50 shadow-sm", className)}>
    <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Visitor Activity Heatmap</CardTitle></CardHeader>
    <CardContent><div className="flex items-center justify-center h-[250px] text-muted-foreground">No data available</div></CardContent>
  </Card>
);

const HeatmapGrid = ({ days, hours, grid, min, max, selected, onClick }: HeatmapGridProps) => (
  <div className="overflow-x-auto max-w-full">
    <div className="min-w-0">
      <HourHeader hours={hours} onClick={onClick} />
      {days.map((day: string) => (
        <DayRow key={day} day={day} hours={hours} grid={grid} min={min} max={max} 
          selected={selected} onClick={onClick} />
      ))}
    </div>
  </div>
);

const HourHeader = ({ hours, onClick }: HourHeaderProps) => (
  <div className="grid gap-0.5" style={{ gridTemplateColumns: `60px repeat(${hours.length}, minmax(0, 1fr))` }}>
    <div />
    {hours.map((h: string) => (
      <div key={h} className="text-center text-[10px] font-medium text-muted-foreground py-1 whitespace-nowrap cursor-pointer hover:bg-accent"
        onClick={() => onClick("All", h)}>{h}</div>
    ))}
  </div>
);

const DayRow = ({ day, hours, grid, min, max, selected, onClick }: DayRowProps) => (
  <div key={day} className="grid gap-0.5 mt-0.5" style={{ gridTemplateColumns: `60px repeat(${hours.length}, minmax(0, 1fr))` }}>
    <div className="text-[10px] font-medium text-muted-foreground flex items-center cursor-pointer hover:bg-accent"
      onClick={() => onClick(day, "All")}>{day}</div>
    {hours.map((hour: string) => {
      const value = grid.get(`${day}-${hour}`) ?? 0;
      const colors = getHeatColor(value, min, max);
      return (
        <div key={hour} className={cn("aspect-square rounded-sm flex items-center justify-center transition-transform hover:scale-110 cursor-pointer text-[9px] font-medium", 
          colors, selected?.day === day && selected?.hour === hour && "ring-2 ring-primary")}
          title={`${day} ${hour}: ${value} visitors`} aria-label={`${day} ${hour}: ${value} visitors`}
          onClick={() => onClick(day, hour)}>
          {value > 0 ? value : ""}
        </div>
      );
    })}
  </div>
);
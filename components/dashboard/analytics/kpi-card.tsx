"use client";

import { Eye, Users, TrendingUp, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { semanticColors, formatValue, calculateChange, type KpiData } from "@/lib/dashboard-data";
import { itemVariants, hoverScale } from "@/lib/animations";

type SemanticColorKey = keyof typeof semanticColors;
type SemanticColor = typeof semanticColors[SemanticColorKey];

const ICON_MAP = { Eye, Users, TrendingUp, Clock } as const;

export function KpiCard({ data, className }: KpiCardProps) {
  const { change, isPositive } = useKpiChange(data.value, data.previousValue);
  const Icon = ICON_MAP[data.icon as keyof typeof ICON_MAP] ?? Eye;
  const colors = semanticColors[data.color];

  return (
    <motion.div className={cardClasses(className)} variants={itemVariants} initial="hidden" animate="visible" whileHover={hoverScale}>
      <motion.div className="absolute inset-0 rounded-2xl opacity-5" style={gradientStyle(colors.main)} whileHover={{ opacity: 0.08 }} />
      <div className="relative">
        <KpiHeader label={data.label} Icon={Icon} colors={colors} />
        <motion.span className="text-3xl font-bold tracking-tight text-foreground" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {formatValue(data.value, data.format)}
        </motion.span>
        <KpiChange change={change} isPositive={isPositive} />
      </div>
    </motion.div>
  );
}

const useKpiChange = (current: number, previous: number) => {
  const change = calculateChange(current, previous);
  return { change: Math.abs(change), isPositive: change >= 0 };
};

const KpiHeader = ({ label, Icon, colors }: KpiHeaderProps) => (
  <div className="flex items-center justify-between mb-3">
    <motion.span className="text-xs font-medium uppercase tracking-wider text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      {label}
    </motion.span>
    <motion.div className="flex h-8 w-8 items-center justify-center rounded-lg" style={iconStyle(colors)} whileHover={{ rotate: 5 }}>
      <Icon className="h-4 w-4" />
    </motion.div>
  </div>
);

const KpiChange = ({ change, isPositive }: KpiChangeProps) => (
  <div className="mt-2 flex items-center gap-1">
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
      {isPositive ? <ArrowUpRight className="h-3.5 w-3.5 text-green-600" /> : <ArrowDownRight className="h-3.5 w-3.5 text-red-600" />}
    </motion.div>
    <motion.span className={changeTextClasses(isPositive)} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
      {change.toFixed(1)}%
    </motion.span>
    <span className="text-xs text-muted-foreground">vs last period</span>
  </div>
);

const cardClasses = (className?: string) => `relative rounded-2xl border border-border/50 bg-card p-5 shadow-sm ${className ?? ""}`;
const gradientStyle = (main: string) => ({ background: `linear-gradient(135deg, ${main}, transparent)` });
const iconStyle = (colors: SemanticColor) => ({ backgroundColor: colors.light, color: colors.dark });
const changeTextClasses = (isPositive: boolean) => `text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`;

interface KpiCardProps { data: KpiData; className?: string; }
interface KpiHeaderProps { label: string; Icon: React.ComponentType<{ className?: string }>; colors: SemanticColor; }
interface KpiChangeProps { change: number; isPositive: boolean; }
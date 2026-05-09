"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Tag, MapPin, X } from "lucide-react";
import { type FilterState, categories, regions } from "@/lib/dashboard-data";
import { Card, CardContent } from "@/components/ui/card";
import { itemVariants, hoverScale } from "@/lib/animations";

export function FilterPanel({ filters, onChange, className }: FilterPanelProps) {
  const hasActiveFilters = filters.category !== "All" || filters.region !== "All Regions" || filters.dateRange.start !== "" || filters.dateRange.end !== "";

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <Card className={className}>
        <CardContent className="p-4">
          <FilterHeader hasActiveFilters={hasActiveFilters} onClear={() => onChange({ dateRange: { start: "", end: "" }, category: "All", region: "All Regions" })} />
          <div className="flex flex-wrap items-center gap-3">{filterControls(filters, onChange)}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const filterControls = (filters: FilterState, onChange: (f: FilterState) => void) => (
  <>
    <DatePicker filters={filters} onChange={onChange} />
    <CategorySelect filters={filters} onChange={onChange} />
    <RegionSelect filters={filters} onChange={onChange} />
  </>
);

const FilterHeader = ({ hasActiveFilters, onClear }: FilterHeaderProps) => (
  <div className="flex items-center justify-between mb-3">
    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
      Filters
    </span>
    <AnimatePresence>
      {hasActiveFilters && (
        <motion.button onClick={onClear} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
          <X className="h-3 w-3" />Clear all
        </motion.button>
      )}
    </AnimatePresence>
  </div>
);

const DatePicker = ({ filters, onChange }: DatePickerProps) => (
  <div className="flex items-center gap-2">
    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
    <div className="flex items-center gap-1.5">{dateInputs(filters, onChange)}</div>
  </div>
);

const dateInputs = (filters: FilterState, onChange: (f: FilterState) => void) => (
  <>
    <motion.input type="date" value={filters.dateRange.start} onChange={e => onChange({ ...filters, dateRange: { ...filters.dateRange, start: e.target.value } })} className="h-8 rounded-lg border border-border/50 bg-background px-2.5 text-xs" whileFocus={{ scale: 1.02 }} />
    <span className="text-xs text-muted-foreground">→</span>
    <motion.input type="date" value={filters.dateRange.end} onChange={e => onChange({ ...filters, dateRange: { ...filters.dateRange, end: e.target.value } })} className="h-8 rounded-lg border border-border/50 bg-background px-2.5 text-xs" whileFocus={{ scale: 1.02 }} />
  </>
);

const CategorySelect = ({ filters, onChange }: SelectProps) => (
  <div className="flex items-center gap-2">
    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
    <motion.select value={filters.category} onChange={e => onChange({ ...filters, category: e.target.value })} className="h-8 rounded-lg border border-border/50 bg-background px-2.5 text-xs cursor-pointer" whileHover={hoverScale} whileFocus={{ scale: 1.02 }}>
      {categories.map(c => <option key={c} value={c}>{c}</option>)}
    </motion.select>
  </div>
);

const RegionSelect = ({ filters, onChange }: SelectProps) => (
  <div className="flex items-center gap-2">
    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
    <motion.select value={filters.region} onChange={e => onChange({ ...filters, region: e.target.value })} className="h-8 rounded-lg border border-border/50 bg-background px-2.5 text-xs cursor-pointer" whileHover={hoverScale} whileFocus={{ scale: 1.02 }}>
      {regions.map(r => <option key={r} value={r}>{r}</option>)}
    </motion.select>
  </div>
);

interface FilterPanelProps { filters: FilterState; onChange: (f: FilterState) => void; className?: string; }
interface FilterHeaderProps { hasActiveFilters: boolean; onClear: () => void; }
interface DatePickerProps { filters: FilterState; onChange: (f: FilterState) => void; }
interface SelectProps { filters: FilterState; onChange: (f: FilterState) => void; }

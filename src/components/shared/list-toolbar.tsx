"use client";

import {
  LayoutList,
  LayoutGrid,
  Grid3X3,
  ArrowUpDown,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ViewMode = "1" | "2" | "3";

export type SortOption =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "duration-asc"
  | "duration-desc";

export const sortLabels: Record<SortOption, string> = {
  popular: "Más popular",
  "price-asc": "Menor precio primero",
  "price-desc": "Mayor precio primero",
  "duration-asc": "Menor duración primero",
  "duration-desc": "Mayor duración primero",
};

/** Default sort options for plans (includes duration) */
export const planSortOptions: SortOption[] = [
  "popular",
  "price-asc",
  "price-desc",
  "duration-asc",
  "duration-desc",
];

/** Sort options for cabins (no duration — uses rating instead) */
export const cabinSortOptions: SortOption[] = [
  "popular",
  "price-asc",
  "price-desc",
];

interface ListToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortOption: SortOption;
  onSortOptionChange: (option: SortOption) => void;
  sortOptions?: SortOption[];
  resultCount: number;
  resultLabel: string;
}

export function ListToolbar({
  viewMode,
  onViewModeChange,
  sortOption,
  onSortOptionChange,
  sortOptions = planSortOptions,
  resultCount,
  resultLabel,
}: ListToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* Left: Result count */}
      <span className="text-xs text-muted-foreground">
        {resultCount} {resultLabel}
      </span>

      {/* Right: Sort + View toggle */}
      <div className="flex items-center gap-2">
        {/* Sort Dropdown */}
        <Select
          value={sortOption}
          onValueChange={(val) => onSortOptionChange(val as SortOption)}
        >
          <SelectTrigger size="sm" className="gap-1.5 text-xs h-8 w-auto min-w-[180px]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option} value={option} className="text-xs">
                {sortLabels[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View Toggle */}
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(val) => {
            if (val) onViewModeChange(val as ViewMode);
          }}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="1" aria-label="Vista de 1 columna">
            <LayoutList className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="3" aria-label="Vista de 3 columnas" className="hidden sm:inline-flex">
            <Grid3X3 className="w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

import { type SortOption } from "@/components/shared/list-toolbar";
import { type TourPlan } from "@/lib/data";

/**
 * Extracts a numeric duration value (in hours) from a Spanish duration string.
 * Examples: "Medio día (4 horas)" → 4, "Día completo (10 horas)" → 10,
 * "Noche completa (6 horas)" → 6, "Medio día (5 horas)" → 5
 */
function parseDurationHours(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function sortPlans(plans: TourPlan[], sortOption: SortOption): TourPlan[] {
  const sorted = [...plans];
  switch (sortOption) {
    case "popular":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "duration-asc":
      return sorted.sort(
        (a, b) => parseDurationHours(a.duration) - parseDurationHours(b.duration)
      );
    case "duration-desc":
      return sorted.sort(
        (a, b) => parseDurationHours(b.duration) - parseDurationHours(a.duration)
      );
    default:
      return sorted;
  }
}

export function sortCabins<T extends { pricePerNight: number; reviewCount: number }>(
  cabins: T[],
  sortOption: SortOption
): T[] {
  const sorted = [...cabins];
  switch (sortOption) {
    case "popular":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "price-asc":
      return sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
    case "price-desc":
      return sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
    case "duration-asc":
      // Cabins don't have duration — fallback to popular
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "duration-desc":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return sorted;
  }
}

/** Grid CSS classes based on view mode (Always 1 col on mobile) */
export function getGridCols(viewMode: string): string {
  switch (viewMode) {
    case "1":
      return "grid-cols-1";
    case "2":
      return "grid-cols-1 sm:grid-cols-2";
    case "3":
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    default:
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  }
}

export const ITEMS_PER_PAGE = 12;

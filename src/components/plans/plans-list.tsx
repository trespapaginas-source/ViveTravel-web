"use client";

import { useMemo, memo } from "react";
import { MapPin, Clock, Users, Compass, Heart, ArrowRight, Sun, Moon, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import {
  FilterSidebar,
  FilterMobileSheet,
  buildPlanFilters,
  filterPlans,
  useFilterState,
} from "@/components/shared/filter-panel";
import { ListToolbar, type ViewMode, type SortOption } from "@/components/shared/list-toolbar";
import { ListPagination } from "@/components/shared/list-pagination";
import { useNavigation } from "@/lib/store";
import { type TourPlan } from "@/lib/data";
import { fetchPlans } from "@/lib/api";
import {
  EXPERIENCE_SECTIONS,
  getExperienceSection,
  getPlanExperienceSection,
  type ExperienceSectionId,
} from "@/lib/experience-sections";
import { useQuery } from "@tanstack/react-query";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { sortPlans, getGridCols, ITEMS_PER_PAGE } from "@/lib/sorting";
import { formatShortDuration, formatShortLocation } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Naturaleza: "bg-ocean/80 text-white",
  Playa: "bg-ocean/80 text-white",
  Aventura: "bg-ocean/80 text-white",
  Ecoturismo: "bg-ocean/80 text-white",
  Experiencia: "bg-ocean/80 text-white",
  Cultural: "bg-ocean/80 text-white",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// ─── Horizontal Card (1-column list view) ─────────────────────────────────────
const PlanCardHorizontal = memo(function PlanCardHorizontal({
  plan,
  onNavigate,
}: {
  plan: TourPlan;
  onNavigate: (id: string) => void;
}) {
  const [isFav, setIsFav] = useState(() =>
    typeof window !== "undefined" ? isFavorite(plan.id) : false
  );

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const nowFav = toggleFavorite(plan.id);
      setIsFav(nowFav);
      toast.success(nowFav ? "Guardado en tu colección" : "Eliminado de tu colección", {
        description: nowFav ? "Encuéntralo en tu lista de favoritos" : undefined,
      });
    },
    [plan.id]
  );

  return (
    <Card
      className="overflow-hidden group border-border/50 hover:border-border hover:shadow-lg transition-all duration-200 py-0 gap-0 cursor-pointer flex flex-col sm:flex-row"
      onClick={() => onNavigate(plan.id)}
    >
      {/* Image */}
      <div className="relative w-full sm:w-[260px] md:w-[300px] shrink-0 overflow-hidden aspect-[3/2] sm:aspect-auto">
        <img           src={plan.images[0]}
          alt={plan.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
         onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />

        {/* Duration Badge (Only for National/International) */}
        {(() => {
          const section = getPlanExperienceSection(plan);
          if (section !== "nacionales" && section !== "internacionales") return null;

          const parts = plan.duration.split(/[,·-]/).map((p) => p.trim());
          const days = parts[0] || plan.duration;
          const nights = parts.length > 1 ? parts[1] : null;

          return (
            <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-2 py-1 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1.5 text-[11px] sm:text-[12px] font-medium text-slate-700 shadow-sm border border-black/5">
              <div className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-slate-600" />
                <span>{days}</span>
              </div>
              {nights && (
                <>
                  <span className="text-slate-300 font-bold">·</span>
                  <div className="flex items-center gap-1">
                    <Moon className="w-3 h-3 text-slate-600" />
                    <span>{nights}</span>
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {/* Date Badge for Grupales — top left */}
        {getPlanExperienceSection(plan) === "grupales" && plan.fecha_salida && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 shadow-sm border border-black/5">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-600" />
            <span>{plan.fecha_salida}</span>
          </div>
        )}

        {/* Cupos Limitados Badge */}
        {getPlanExperienceSection(plan) === "grupales" && plan.maxGuests && (
          <div className="absolute bottom-3 left-3 z-10 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-[pulse_2s_ease-in-out_infinite] shadow-sm">
            <Users className="w-2.5 h-2.5" />
            Solo {plan.maxGuests} cupos
          </div>
        )}

        {/* Favorite Button — top right */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            onClick={handleFavorite}
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 min-w-[40px] shrink-0 border border-black/5"
            aria-label={isFav ? "Eliminar de favoritos" : "Guardar en favoritos"}
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                isFav ? "fill-indigo text-indigo" : "text-muted-foreground"
              }`} />
          </button>
        </div>
      </div>

      {/* Content — right side */}
      <CardContent className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-bold text-lg sm:text-[20px] text-foreground leading-tight line-clamp-1 group-hover:text-ocean transition-colors duration-200">
            {plan.name}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-1.5">
            {plan.shortDescription}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatShortDuration(plan.duration)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{formatShortLocation(plan.location)}</span>
            </div>
            {getPlanExperienceSection(plan) === "grupales" && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Máx. {plan.maxGuests}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom row: Price */}
        <div className="flex items-center justify-end mt-4 pt-3 border-t border-border/30">
          <div className="text-right flex items-baseline gap-2 justify-end">
            {plan.priceRange && plan.priceRange.includes("-") && (
              <span className="text-xs text-muted-foreground line-through">
                {plan.priceRange.split("-")[1].trim()}
              </span>
            )}
            <p className="text-foreground font-bold text-lg leading-tight">
              {formatPrice(plan.price)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// ─── Vertical Card (2-3 column grid view) ─────────────────────────────────────
const PlanCardVertical = memo(function PlanCardVertical({
  plan,
  onNavigate,
}: {
  plan: TourPlan;
  onNavigate: (id: string) => void;
}) {
  const [isFav, setIsFav] = useState(() =>
    typeof window !== "undefined" ? isFavorite(plan.id) : false
  );

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const nowFav = toggleFavorite(plan.id);
      setIsFav(nowFav);
      toast.success(nowFav ? "Guardado en tu colección" : "Eliminado de tu colección", {
        description: nowFav ? "Encuéntralo en tu lista de favoritos" : undefined,
      });
    },
    [plan.id]
  );

  return (
    <Card
      className="overflow-hidden group border-border/50 hover:border-border hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 py-0 gap-0 cursor-pointer"
      onClick={() => onNavigate(plan.id)}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <img           src={plan.images[0]}
          alt={plan.name}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
         onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Duration Badge (Only for National/International) */}
        {(() => {
          const section = getPlanExperienceSection(plan);
          if (section !== "nacionales" && section !== "internacionales") return null;

          const parts = plan.duration.split(/[,·-]/).map((p) => p.trim());
          const days = parts[0] || plan.duration;
          const nights = parts.length > 1 ? parts[1] : null;

          return (
            <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-2 py-1 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1.5 text-[11px] sm:text-[12px] font-medium text-slate-700 shadow-sm border border-black/5">
              <div className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-slate-600" />
                <span>{days}</span>
              </div>
              {nights && (
                <>
                  <span className="text-slate-300 font-bold">·</span>
                  <div className="flex items-center gap-1">
                    <Moon className="w-3 h-3 text-slate-600" />
                    <span>{nights}</span>
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {/* Date Badge for Grupales — top left */}
        {getPlanExperienceSection(plan) === "grupales" && plan.fecha_salida && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 shadow-sm border border-black/5">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-600" />
            <span>{plan.fecha_salida}</span>
          </div>
        )}

        {/* Cupos Limitados Badge */}
        {getPlanExperienceSection(plan) === "grupales" && plan.maxGuests && (
          <div className="absolute bottom-3 left-3 z-10 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-[pulse_2s_ease-in-out_infinite] shadow-sm">
            <Users className="w-2.5 h-2.5" />
            Solo {plan.maxGuests} cupos
          </div>
        )}

        {/* Favorite Button — top right */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            onClick={handleFavorite}
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 min-w-[40px] shrink-0 border border-black/5"
            aria-label={isFav ? "Eliminar de favoritos" : "Guardar en favoritos"}
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                isFav ? "fill-indigo text-indigo" : "text-muted-foreground"
              }`} />
          </button>
        </div>


      </div>

      <CardContent className="p-3.5 sm:p-4 space-y-2.5">
        {/* Name */}
        <h3 className="font-bold text-[17px] text-foreground leading-tight line-clamp-1 group-hover:text-ocean transition-colors duration-200">
          {plan.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {plan.shortDescription}
        </p>

        {/* Meta Info — compact inline */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatShortDuration(plan.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{formatShortLocation(plan.location)}</span>
          </div>
          {getPlanExperienceSection(plan) === "grupales" && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Máx. {plan.maxGuests}</span>
            </div>
          )}
        </div>

        {/* Bottom: Price */}
        <div className="flex items-center justify-end pt-2 mt-2 border-t border-border/30">
          <div className="text-right flex items-baseline gap-2 justify-end">
            {plan.priceRange && plan.priceRange.includes("-") && (
              <span className="text-[11px] sm:text-[12px] text-muted-foreground line-through">
                {plan.priceRange.split("-")[1].trim()}
              </span>
            )}
            <p className="text-foreground font-bold text-[15px] sm:text-[17px] leading-tight">
              {formatPrice(plan.price)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// ─── Main Plans List ───────────────────────────────────────────────────────────
export function PlansList() {
  const { selectedItemId, navigate, searchDestination } = useNavigation();
  const activeSection = getExperienceSection(selectedItemId);

  const { data: tourPlans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>("1"); // Mobile default
  const [sortOption, setSortOption] = useState<SortOption>("popular");
  const [currentPage, setCurrentPage] = useState(1);

  // Set default viewmode based on screen size
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setTimeout(() => setViewMode("3"), 0);
    }
  }, []);

  const publishedPlans = useMemo(
    () => tourPlans.filter((p) => p.published !== false),
    [tourPlans]
  );

  const sectionPlans = useMemo(
    () => {
      let list = publishedPlans.filter(
        (plan) => getPlanExperienceSection(plan) === activeSection.id
      );
      if (searchDestination) {
        const query = searchDestination.toLowerCase().trim();
        list = list.filter(
          (plan) =>
            plan.location.toLowerCase().includes(query) ||
            plan.name.toLowerCase().includes(query) ||
            plan.shortDescription.toLowerCase().includes(query)
        );
      }
      return list;
    },
    [publishedPlans, activeSection.id, searchDestination]
  );

  const filterSections = useMemo(
    () => buildPlanFilters(sectionPlans),
    [sectionPlans]
  );

  const { filters, toggleCheckbox, changeRange, clearAll, activeCount } =
    useFilterState(filterSections);

  // Apply filters
  const filteredPlans = useMemo(
    () => filterPlans(sectionPlans, filters),
    [sectionPlans, filters]
  );

  // Apply sorting
  const sortedPlans = useMemo(
    () => sortPlans(filteredPlans, sortOption),
    [filteredPlans, sortOption]
  );

  // Pagination
  const totalPages = Math.ceil(sortedPlans.length / ITEMS_PER_PAGE);
  const paginatedPlans = useMemo(
    () => sortedPlans.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [sortedPlans, currentPage]
  );

  // Reset page when filters or sort change
  const handleSortChange = useCallback((option: SortOption) => {
    setSortOption(option);
    setCurrentPage(1);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleClearAll = useCallback(() => {
    clearAll();
    setCurrentPage(1);
  }, [clearAll]);

  const handleSectionChange = useCallback(
    (section: ExperienceSectionId) => {
      navigate("plans", section);
      clearAll();
      setCurrentPage(1);
    },
    [clearAll, navigate]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNavigate = useCallback((planId: string) => {
    navigate("plan-detail", planId);
  }, [navigate]);

  const gridCols = getGridCols(viewMode);
  const isHorizontal = viewMode === "1";

  if (isLoading) {
    return (
      <section className="py-4 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col">
          <SectionHeader
            title="Experiencias y viajes"
            subtitle="Explora nuestra selección de destinos diseñados para ti."
            className="order-2 lg:order-1 mb-6 sm:mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 mt-8 order-3 lg:order-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden py-0 gap-0">
                <Skeleton className="aspect-[4/3]" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Header - Order 2 in Mobile, 1 in Desktop */}
        <div className="order-2 lg:order-1">
          <SectionHeader
            title="Experiencias y viajes"
            subtitle="Explora nuestra selección de destinos diseñados para ti."
            className="mb-3 lg:mb-8" />
        </div>

        {/* Tabs - Order 1 in Mobile, 2 in Desktop */}
        <div className="order-1 lg:order-2 mb-5 lg:mb-6 w-full overflow-hidden mt-1 lg:mt-0 relative after:absolute after:right-0 after:top-0 after:bottom-0 after:w-8 after:bg-gradient-to-l after:from-white after:to-transparent after:pointer-events-none lg:after:hidden">
          <div className="flex overflow-x-auto items-center md:justify-center gap-2.5 pb-2 -mb-2 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {EXPERIENCE_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`whitespace-nowrap shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                  activeSection.id === section.id
                    ? "border-foreground bg-foreground text-background shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count - Order 3 */}
        <div className="order-3 mb-4 lg:mb-6 text-center text-sm font-medium text-muted-foreground">
          {filteredPlans.length} {filteredPlans.length === 1 ? 'experiencia disponible' : 'experiencias disponibles'}
        </div>

        {/* Content: Sidebar + Grid - Order 4 */}
        <div className="order-4 flex gap-8">
          {/* Desktop Sidebar */}
          <FilterSidebar
            sections={filterSections}
            filters={filters}
            onToggleCheckbox={toggleCheckbox}
            onChangeRange={changeRange}
            onClearAll={handleClearAll}
            activeCount={activeCount} />

          {/* Plans Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar: Mobile Filters + Sort + View toggle */}
            <div className="mb-4 lg:mb-5 flex flex-wrap items-center justify-between gap-3">
              {/* Mobile Filters */}
              <div className="lg:hidden shrink-0">
                <FilterMobileSheet
                  sections={filterSections}
                  filters={filters}
                  onToggleCheckbox={toggleCheckbox}
                  onChangeRange={changeRange}
                  onClearAll={handleClearAll}
                  activeCount={activeCount}
                  resultCount={filteredPlans.length} />
              </div>

              {/* ListToolbar */}
              <div className="flex-1 w-full sm:w-auto [&>div]:w-full [&>div]:justify-end lg:[&>div]:justify-between [&>div>span:first-child]:hidden lg:[&>div>span:first-child]:block">
                <ListToolbar
                  viewMode={viewMode}
                  onViewModeChange={handleViewModeChange}
                  sortOption={sortOption}
                  onSortOptionChange={handleSortChange}
                  resultCount={filteredPlans.length}
                  resultLabel={`experiencia${filteredPlans.length !== 1 ? "s" : ""}`} />
              </div>
            </div>

            <div className={`grid ${gridCols} gap-5 sm:gap-6`}>
              {paginatedPlans.map((plan) =>
                isHorizontal ? (
                  <PlanCardHorizontal
                    key={plan.id}
                    plan={plan}
                    onNavigate={handleNavigate} />
                ) : (
                  <PlanCardVertical
                    key={plan.id}
                    plan={plan}
                    onNavigate={handleNavigate} />
                )
              )}
            </div>

            {/* Empty State */}
            {filteredPlans.length === 0 && (
              <div className="text-center py-16">
                <Compass className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">
                  No hay experiencias con estos filtros
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  Intenta ajustar los filtros para encontrar más opciones
                </p>
                <button
                  onClick={handleClearAll}
                  className="text-sm text-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Pagination */}
            <ListPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange} />
          </div>
        </div>
      </div>
    </section>
  );
}

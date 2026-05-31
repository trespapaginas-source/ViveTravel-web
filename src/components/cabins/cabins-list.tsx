"use client";

import { useMemo, memo } from "react";
import { Cabin } from "@/lib/data";
import { fetchCabins } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@/lib/store";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { SectionHeader } from "@/components/shared/section-header";
import {
  FilterSidebar,
  FilterMobileSheet,
  buildCabinFilters,
  filterCabins,
  useFilterState,
} from "@/components/shared/filter-panel";
import { ListToolbar, type ViewMode, type SortOption, cabinSortOptions } from "@/components/shared/list-toolbar";
import { ListPagination } from "@/components/shared/list-pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  BedDouble,
  Bath,
  MapPin,
  ArrowRight,
  Heart,
} from "lucide-react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { sortCabins, getGridCols, ITEMS_PER_PAGE } from "@/lib/sorting";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// ─── Horizontal Cabin Card (1-column list view) ────────────────────────────────
const CabinCardHorizontal = memo(function CabinCardHorizontal({
  cabin,
  onSelect,
}: {
  cabin: Cabin;
  onSelect: () => void;
}) {
  const [isFav, setIsFav] = useState(() =>
    typeof window !== "undefined" ? isFavorite(cabin.id) : false
  );

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const nowFav = toggleFavorite(cabin.id);
      setIsFav(nowFav);
      toast.success(nowFav ? "Guardado en tu colección" : "Eliminado de tu colección", {
        description: nowFav ? "Encuéntralo en tu lista de favoritos" : undefined,
      });
    },
    [cabin.id]
  );

  return (
    <Card
      className="overflow-hidden cursor-pointer group border-border/50 hover:border-ocean/20 hover:shadow-lg transition-all duration-200 py-0 gap-0 flex flex-col sm:flex-row"
      onClick={onSelect}
    >
      {/* Image */}
      <div className="relative w-full sm:w-[260px] md:w-[300px] shrink-0 overflow-hidden aspect-[3/2] sm:aspect-auto">
        <img           src={cabin.images[0]}
          alt={cabin.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
         onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 min-w-[40px] shrink-0 border border-black/5"
          aria-label={isFav ? "Eliminar de favoritos" : "Guardar en favoritos"}
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              isFav ? "fill-indigo text-indigo" : "text-muted-foreground"
            }`} />
        </button>
      </div>

      {/* Content — right side */}
      <CardContent className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-bold text-lg sm:text-[20px] text-foreground leading-tight line-clamp-1 group-hover:text-ocean transition-colors duration-200">
            {cabin.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            <span className="line-clamp-1">{cabin.location}</span>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-2">
            {cabin.shortDescription}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{cabin.capacity} huéspedes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5" />
              <span>{cabin.bedrooms} hab.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5" />
              <span>{cabin.bathrooms} baño{cabin.bathrooms > 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* Bottom row: Price */}
        <div className="flex items-center justify-end mt-4 pt-3 border-t border-border/30">
          <div className="text-right">
            <p className="text-foreground font-bold text-lg leading-tight">
              <span className="text-sm font-normal text-muted-foreground mr-1">Desde</span>
              {formatPrice(cabin.pricePerNight)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// ─── Vertical Cabin Card (2-3 column grid view) ───────────────────────────────
const CabinCardVertical = memo(function CabinCardVertical({
  cabin,
  onSelect,
}: {
  cabin: Cabin;
  onSelect: () => void;
}) {
  const [isFav, setIsFav] = useState(() =>
    typeof window !== "undefined" ? isFavorite(cabin.id) : false
  );

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const nowFav = toggleFavorite(cabin.id);
      setIsFav(nowFav);
      toast.success(nowFav ? "Guardado en tu colección" : "Eliminado de tu colección", {
        description: nowFav ? "Encuéntralo en tu lista de favoritos" : undefined,
      });
    },
    [cabin.id]
  );

  return (
    <Card
      className="overflow-hidden cursor-pointer group border-border/50 hover:border-ocean/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 py-0 gap-0"
      onClick={onSelect}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <img           src={cabin.images[0]}
          alt={cabin.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
         onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 min-w-[40px] shrink-0 border border-black/5"
          aria-label={isFav ? "Eliminar de favoritos" : "Guardar en favoritos"}
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              isFav ? "fill-indigo text-indigo" : "text-muted-foreground"
            }`} />
        </button>
      </div>

      <CardContent className="p-3.5 sm:p-4 space-y-2">
        {/* Name and Location */}
        <div>
          <h3 className="font-bold text-[17px] text-foreground group-hover:text-ocean transition-colors duration-200 line-clamp-1 leading-snug">
            {cabin.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin className="w-3 h-3 shrink-0 text-muted-foreground" />
            <span className="line-clamp-1">{cabin.location}</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {cabin.shortDescription}
        </p>

        {/* Compact Stats Row */}
        <div className="flex items-center gap-0 text-[10px] sm:text-xs text-muted-foreground pt-1 flex-wrap">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{cabin.capacity}</span>
          </div>
          <span className="mx-1.5 text-muted-foreground">·</span>
          <div className="flex items-center gap-1">
            <BedDouble className="w-3 h-3" />
            <span>{cabin.bedrooms} hab.</span>
          </div>
          <span className="mx-1.5 text-muted-foreground">·</span>
          <div className="flex items-center gap-1">
            <Bath className="w-3 h-3" />
            <span>{cabin.bathrooms} baño{cabin.bathrooms > 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Bottom: Price */}
        <div className="flex items-center justify-end pt-2 mt-2 border-t border-border/30">
          <div className="text-right">
            <p className="text-foreground font-bold text-[15px] sm:text-[17px] leading-tight">
              <span className="text-[11px] sm:text-[13px] font-normal text-muted-foreground mr-1">Desde</span>
              {formatPrice(cabin.pricePerNight)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// ─── Main Cabins List ──────────────────────────────────────────────────────────
export function CabinsList() {
  const { navigate, searchDestination } = useNavigation();
  const { data: cabins = [], isLoading } = useQuery({
    queryKey: ["cabins"],
    queryFn: fetchCabins,
  });

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>("1"); // Mobile default
  const [sortOption, setSortOption] = useState<SortOption>("popular");
  const [currentPage, setCurrentPage] = useState(1);

  // Set default viewmode based on screen size
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setTimeout(() => setViewMode("2"), 0);
    }
  }, []);

  const publishedCabins = useMemo(
    () => cabins.filter((c) => c.published !== false),
    [cabins]
  );

  const searchedCabins = useMemo(() => {
    let list = publishedCabins;
    if (searchDestination) {
      const query = searchDestination.toLowerCase().trim();
      list = list.filter(
        (cabin) =>
          cabin.location.toLowerCase().includes(query) ||
          cabin.name.toLowerCase().includes(query) ||
          cabin.shortDescription.toLowerCase().includes(query)
      );
    }
    return list;
  }, [publishedCabins, searchDestination]);

  const filterSections = useMemo(
    () => buildCabinFilters(searchedCabins),
    [searchedCabins]
  );

  const { filters, toggleCheckbox, changeRange, clearAll, activeCount } =
    useFilterState(filterSections);

  // Apply filters
  const filteredCabins = useMemo(
    () => filterCabins(searchedCabins, filters),
    [searchedCabins, filters]
  );

  // Apply sorting
  const sortedCabins = useMemo(
    () => sortCabins(filteredCabins, sortOption),
    [filteredCabins, sortOption]
  );

  // Pagination
  const totalPages = Math.ceil(sortedCabins.length / ITEMS_PER_PAGE);
  const paginatedCabins = useMemo(
    () => sortedCabins.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [sortedCabins, currentPage]
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

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelect = useCallback(
    (cabinId: string) => navigate("cabin-detail", cabinId),
    [navigate]
  );

  const gridCols = getGridCols(viewMode);
  const isHorizontal = viewMode === "1";

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Nuestras Cabañas"
            subtitle="Descubre el alojamiento perfecto para tu escapada al Caribe colombiano." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden py-0 gap-0">
                <Skeleton className="aspect-video" />
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
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <SectionHeader
          title="Nuestras Cabañas"
          subtitle="Descubre el alojamiento perfecto para tu escapada al Caribe colombiano. Desde refugios románticos hasta espacios familiares frente al mar." />

        {/* Mobile filter button */}
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <div className="flex items-center gap-2">
            <FilterMobileSheet
              sections={filterSections}
              filters={filters}
              onToggleCheckbox={toggleCheckbox}
              onChangeRange={changeRange}
              onClearAll={handleClearAll}
              activeCount={activeCount}
              resultCount={filteredCabins.length} />
          </div>
        </div>

        {/* Content: Sidebar + Grid */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <FilterSidebar
            sections={filterSections}
            filters={filters}
            onToggleCheckbox={toggleCheckbox}
            onChangeRange={changeRange}
            onClearAll={handleClearAll}
            activeCount={activeCount} />

          {/* Cabins Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar: Sort + View toggle */}
            <div className="mb-5">
              <ListToolbar
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                sortOption={sortOption}
                onSortOptionChange={handleSortChange}
                sortOptions={cabinSortOptions}
                resultCount={filteredCabins.length}
                resultLabel={`cabaña${filteredCabins.length !== 1 ? "s" : ""}`} />
            </div>

            <div className={`grid ${gridCols} gap-5 sm:gap-6`}>
              {paginatedCabins.map((cabin) =>
                isHorizontal ? (
                  <CabinCardHorizontal
                    key={cabin.id}
                    cabin={cabin}
                    onSelect={() => handleSelect(cabin.id)} />
                ) : (
                  <CabinCardVertical
                    key={cabin.id}
                    cabin={cabin}
                    onSelect={() => handleSelect(cabin.id)} />
                )
              )}
            </div>

            {/* Empty State */}
            {filteredCabins.length === 0 && (
              <div className="text-center py-16">
                <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">
                  No hay cabañas con estos filtros
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

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            ¿No encuentras lo que buscas? Escríbenos y te ayudamos a encontrar la cabaña ideal.
          </p>
          <Button
            onClick={() => navigate("contact")}
            className="bg-ocean hover:bg-ocean-dark text-white rounded-full px-8"
          >
            Contáctanos
          </Button>
        </div>
      </div>
    </section>
  );
}

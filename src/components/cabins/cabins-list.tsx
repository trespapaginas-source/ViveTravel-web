"use client";

import { useMemo, memo } from "react";
import { Cabin } from "@/lib/data";
import { fetchCabins } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@/lib/store";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { SectionHeader } from "@/components/shared/section-header";
import { PageBanner } from "@/components/shared/page-banner";
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
  Compass,
  Calendar,
} from "lucide-react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { sortCabins, getGridCols, ITEMS_PER_PAGE } from "@/lib/sorting";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

const getCabinWhatsAppUrl = (
  cabin: Cabin,
  searchParams?: {
    destination?: string | null;
    date?: string | null;
    dateEnd?: string | null;
    adults?: string | null;
    children?: string | null;
  }
) => {
  const destination = searchParams?.destination || cabin.location;
  let dateText = "fechas a convenir";
  if (searchParams?.date) {
    try {
      const start = new Date(searchParams.date + "T12:00:00");
      const startStr = format(start, "d MMM", { locale: es });
      if (searchParams.dateEnd) {
        const end = new Date(searchParams.dateEnd + "T12:00:00");
        const endStr = format(end, "d MMM yyyy", { locale: es });
        dateText = `${startStr} al ${endStr}`;
      } else {
        dateText = `${startStr} (mes aproximado: ${format(start, "MMMM", { locale: es })})`;
      }
    } catch (_) {}
  }
  
  const adultsStr = searchParams?.adults || "2";
  const childrenStr = searchParams?.children || "0";
  const totalTravelers = parseInt(adultsStr, 10) + parseInt(childrenStr, 10);
  const travelersText = `${totalTravelers} persona${totalTravelers !== 1 ? "s" : ""}`;
  
  const text = `Hola Vive Travel Atlántico, me interesa cotizar la cabaña *${cabin.name}* en *${destination}* para la fecha *${dateText}*, para *${travelersText}*. ¿Me podrían confirmar disponibilidad y tarifas?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};



// ─── Horizontal Cabin Card (1-column list view) ────────────────────────────────
const CabinCardHorizontal = memo(function CabinCardHorizontal({
  cabin,
  onSelect,
  searchParams,
}: {
  cabin: Cabin;
  onSelect: () => void;
  searchParams?: {
    destination?: string | null;
    date?: string | null;
    dateEnd?: string | null;
    adults?: string | null;
    children?: string | null;
  };
}) {
  const [isFav, setIsFav] = useState(() =>
    typeof window !== "undefined" ? isFavorite(cabin.id) : false
  );

  const { setFavoritesPulseActive } = useNavigation();

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const nowFav = toggleFavorite(cabin.id);
      setIsFav(nowFav);
      const isMobile = window.innerWidth < 768;
      if (isMobile && nowFav) {
        setFavoritesPulseActive(true);
      } else {
        toast.success(nowFav ? "Guardado en tu colección" : "Eliminado de tu colección", {
          description: nowFav ? "Encuéntralo en tu lista de favoritos" : undefined,
        });
      }
    },
    [cabin.id, setFavoritesPulseActive]
  );

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getCabinWhatsAppUrl(cabin, searchParams), "_blank");
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer group border-border/50 hover:border-ocean/20 hover:shadow-lg transition-all duration-200 py-0 gap-0 flex flex-col sm:flex-row"
      onClick={onSelect}
    >
      {/* Image */}
      <div className="relative w-full sm:w-[260px] md:w-[300px] shrink-0 overflow-hidden aspect-[3/2] sm:aspect-auto">
        <img
          src={cabin.images[0]}
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

        {/* Bottom row: Price and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-3 border-t border-border/30 gap-3">
          <div className="text-left">
            <p className="text-foreground font-bold text-lg leading-tight">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mr-1">Desde</span>
              {formatPrice(cabin.pricePerNight)}
              <span className="text-xs text-muted-foreground font-normal ml-0.5"> / noche</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              className="rounded-xl text-xs font-bold flex-1 sm:flex-initial h-9 bg-ocean hover:bg-ocean-dark text-white border-none shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              Ver disponibilidad
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl text-xs font-bold flex-1 sm:flex-initial h-9 border-zinc-200 hover:bg-zinc-50"
              onClick={handleWhatsAppClick}
            >
              Cotizar
            </Button>
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
  searchParams,
}: {
  cabin: Cabin;
  onSelect: () => void;
  searchParams?: {
    destination?: string | null;
    date?: string | null;
    dateEnd?: string | null;
    adults?: string | null;
    children?: string | null;
  };
}) {
  const [isFav, setIsFav] = useState(() =>
    typeof window !== "undefined" ? isFavorite(cabin.id) : false
  );

  const { setFavoritesPulseActive } = useNavigation();

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const nowFav = toggleFavorite(cabin.id);
      setIsFav(nowFav);
      const isMobile = window.innerWidth < 768;
      if (isMobile && nowFav) {
        setFavoritesPulseActive(true);
      } else {
        toast.success(nowFav ? "Guardado en tu colección" : "Eliminado de tu colección", {
          description: nowFav ? "Encuéntralo en tu lista de favoritos" : undefined,
        });
      }
    },
    [cabin.id, setFavoritesPulseActive]
  );

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getCabinWhatsAppUrl(cabin, searchParams), "_blank");
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer group border-border/50 hover:border-ocean/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 py-0 gap-0 flex flex-col justify-between"
      onClick={onSelect}
    >
      <div>
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <img
            src={cabin.images[0]}
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

        <CardContent className="p-3.5 sm:p-4 pb-0 space-y-2">
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
              <span>{cabin.capacity} guests</span>
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
        </CardContent>
      </div>

      {/* Bottom: Price and Actions */}
      <CardContent className="p-3.5 sm:p-4 pt-0">
        <div className="pt-2.5 mt-2.5 border-t border-border/30 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Desde</span>
            <p className="text-foreground font-bold text-[15px] sm:text-[17px] leading-tight">
              {formatPrice(cabin.pricePerNight)}
              <span className="text-xs text-muted-foreground font-normal ml-0.5"> / noche</span>
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              className="rounded-xl text-[11px] font-bold h-8.5 bg-ocean hover:bg-ocean-dark text-white border-none shadow-sm py-1"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              Ver disponibilidad
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl text-[11px] font-bold h-8.5 border-zinc-200 hover:bg-zinc-50 py-1"
              onClick={handleWhatsAppClick}
            >
              Cotizar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// ─── Main Cabins List ──────────────────────────────────────────────────────────
export function CabinsList() {
  const {
    navigate,
    searchDestination,
    searchDate,
    searchDateEnd,
    searchAdults,
    searchChildren,
    setSearchIsSticky,
    clearSearch,
  } = useNavigation();

  const { data: cabins = [], isLoading } = useQuery({
    queryKey: ["cabins"],
    queryFn: fetchCabins,
  });

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>("1"); // Default: 1 column
  const [sortOption, setSortOption] = useState<SortOption>("popular");
  const [currentPage, setCurrentPage] = useState(1);

  const publishedCabins = useMemo(
    () => cabins.filter((c) => c.published !== false),
    [cabins]
  );

  // Normalize the destination coming from the hero search so it matches a real
  // cabin location value (the hero uses labels like "Santa Verónica, Atlántico"
  // while cabins store "Santa Verónica, Atlántico" too — we normalize to the
  // city/subzone used by the filter options).
  const normalizedSearchDestination = useMemo(() => {
    if (!searchDestination) return null;
    const trimmed = searchDestination.trim();
    // Match against actual cabin locations to find the value used in filters
    const exact = publishedCabins.find(
      (c) => c.location.toLowerCase() === trimmed.toLowerCase()
    );
    if (exact) return exact.location;
    // Fallback: match by inclusion
    const partial = publishedCabins.find((c) =>
      c.location.toLowerCase().includes(trimmed.toLowerCase())
    );
    return partial ? partial.location : trimmed;
  }, [searchDestination, publishedCabins]);

  // Filter sections are always built from the FULL pool so that all options
  // (locations, amenities, etc.) remain visible regardless of the search.
  const filterSections = useMemo(
    () => buildCabinFilters(publishedCabins),
    [publishedCabins]
  );

  const { filters, toggleCheckbox, changeRange, clearAll, activeCount } =
    useFilterState(filterSections, { initialLocation: normalizedSearchDestination });

  // Apply filters (location checkbox now carries the hero search destination)
  const filteredCabins = useMemo(
    () => filterCabins(publishedCabins, filters),
    [publishedCabins, filters]
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

  const handleClearFilters = useCallback(() => {
    clearAll();
    setCurrentPage(1);
  }, [clearAll]);

  const handleClearAll = useCallback(() => {
    clearAll();
    clearSearch();
    setCurrentPage(1);
  }, [clearAll, clearSearch]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelect = useCallback(
    (cabinId: string) => navigate("cabin-detail", cabinId),
    [navigate]
  );

  const handleModifySearch = useCallback(() => {
    navigate("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSearchIsSticky(false);
  }, [navigate, setSearchIsSticky]);

  const gridCols = getGridCols(viewMode);
  const isHorizontal = viewMode === "1";

  // Identify best matched cabin overall for summary display
  const bestMatchCabin = useMemo(() => {
    if (sortedCabins.length > 0) return sortedCabins[0];
    return undefined;
  }, [sortedCabins]);

  const searchParams = useMemo(() => ({
    destination: searchDestination,
    date: searchDate,
    dateEnd: searchDateEnd,
    adults: searchAdults,
    children: searchChildren
  }), [searchDestination, searchDate, searchDateEnd, searchAdults, searchChildren]);

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
    <div className="bg-white animate-in fade-in duration-300">
      <PageBanner
        eyebrow="Alojamientos"
        title="Nuestras Cabañas"
        subtitle="Descubre el alojamiento perfecto para tu escapada al Caribe colombiano. Desde refugios románticos hasta espacios familiares frente al mar."
        image="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&h=600&fit=crop"
        fallbackImage="https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1600&h=600&fit=crop"
      />
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
                    onSelect={() => handleSelect(cabin.id)}
                    searchParams={searchParams} />
                ) : (
                  <CabinCardVertical
                    key={cabin.id}
                    cabin={cabin}
                    onSelect={() => handleSelect(cabin.id)}
                    searchParams={searchParams} />
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
    </div>
  );
}

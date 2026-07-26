"use client";

import { useMemo, memo } from "react";
import { MapPin, Clock, Users, Compass, Heart, ArrowRight, Sun, Moon, Calendar, Hotel, Tag, Plane, CheckCircle2, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { PageBanner } from "@/components/shared/page-banner";
import {
  FilterSidebar,
  FilterMobileSheet,
  buildPlanFilters,
  filterPlans,
  useFilterState,
} from "@/components/shared/filter-panel";
import { ListToolbar, type ViewMode, type SortOption } from "@/components/shared/list-toolbar";
import { ListPagination } from "@/components/shared/list-pagination";
import { CardImageCarousel } from "@/components/shared/card-image-carousel";
import { useDragScroll } from "@/lib/use-drag-scroll";
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
import { formatShortDuration, cn } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const categoryColors: Record<string, string> = {
  Naturaleza: "bg-ocean/85 text-white",
  Playa: "bg-ocean/85 text-white",
  Aventura: "bg-ocean/85 text-white",
  Ecoturismo: "bg-ocean/85 text-white",
  Experiencia: "bg-ocean/85 text-white",
  Cultural: "bg-ocean/85 text-white",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// ─── Commercial metadata extraction helpers ───────────────────────────────────

const getKeyLabels = (plan: TourPlan) => {
  const labels: string[] = [];
  const searchStr = [
    plan.name,
    plan.category,
    plan.shortDescription,
    ...plan.includes,
    ...plan.highlights
  ].join(" ").toLowerCase();
  
  if (searchStr.includes("todo incluido") || searchStr.includes("alimentación completa")) {
    labels.push("Todo Incluido");
  }
  if (searchStr.includes("vuelo") || searchStr.includes("tiquete aéreo") || searchStr.includes("tiquetes aéreos")) {
    labels.push("Vuelos Incluidos");
  }
  if (
    searchStr.includes("pasadía") ||
    searchStr.includes("pasadia") ||
    plan.duration.toLowerCase().includes("día completo") ||
    plan.duration.toLowerCase().includes("medio día")
  ) {
    labels.push("Pasadía");
  }
  if (searchStr.includes("grupal") || plan.category.toLowerCase().includes("grupal")) {
    labels.push("Salida Grupal");
  }
  if (
    searchStr.includes("alojamiento") ||
    searchStr.includes("hotel") ||
    searchStr.includes("hospedaje") ||
    searchStr.includes("eco-habs") ||
    searchStr.includes("ryokan")
  ) {
    labels.push("Alojamiento Incluido");
  }
  
  // fallback if none matched
  if (labels.length === 0) {
    if (plan.includes.length > 0) labels.push(plan.includes[0]);
    if (plan.includes.length > 1) labels.push(plan.includes[1]);
  }
  
  return labels.slice(0, 3);
};

// Icons differentiate inclusion types; color stays neutral for every label so
// the ocean accent is reserved for the card's truly primary actions (price, CTA).
const NEUTRAL_LABEL_STYLE = "bg-zinc-50 text-zinc-600 border-zinc-200";

const KEY_LABEL_STYLES: Record<string, { icon: typeof CheckCircle2; className: string }> = {
  "Todo Incluido": { icon: CheckCircle2, className: NEUTRAL_LABEL_STYLE },
  "Vuelos Incluidos": { icon: Plane, className: NEUTRAL_LABEL_STYLE },
  "Pasadía": { icon: Sun, className: NEUTRAL_LABEL_STYLE },
  "Salida Grupal": { icon: Users, className: NEUTRAL_LABEL_STYLE },
  "Alojamiento Incluido": { icon: Hotel, className: NEUTRAL_LABEL_STYLE },
};

const DEFAULT_KEY_LABEL_STYLE = { icon: Tag, className: NEUTRAL_LABEL_STYLE };

const getKeyLabelStyle = (label: string) => KEY_LABEL_STYLES[label] || DEFAULT_KEY_LABEL_STYLE;

// Splits a location string like "Madrid, París y Roma" into ordered stops
// ["Madrid", "París", "Roma"] so multi-city routes can render as a breadcrumb.
// Only "City, City y City" lists qualify (signaled by " y ") — a plain
// "City, Country" value (e.g. "Cancún, México") is a single destination,
// not a route, and must be returned whole rather than split on the comma.
const getLocationStops = (location: string): string[] => {
  if (!/\sy\s/i.test(location)) return [location.trim()];
  return location
    .split(",")
    .flatMap((part) => part.split(/\s+y\s+/i))
    .map((s) => s.trim())
    .filter(Boolean);
};

// The upper bound of a "$X - $Y" priceRange, used as informational context
// (season/room variance) — never as a struck-through fake "before" price.
const getPriceRangeUpper = (plan: TourPlan): string | null => {
  if (!plan.priceRange || !plan.priceRange.includes("-")) return null;
  return plan.priceRange.split("-")[1]?.trim() || null;
};

// "Salidas ..." schedules describe departure cadence for circuitos/viajes;
// other plans reuse the same field for daily time windows ("7:00 AM - 11:00 AM"),
// which isn't relevant to show as a departure chip.
const getDepartureCadence = (plan: TourPlan): string | null =>
  plan.schedule?.toLowerCase().startsWith("salidas") ? plan.schedule : null;

const getPrincipalHotel = (plan: TourPlan) => {
  const searchStr = [
    plan.name,
    plan.category,
    plan.shortDescription,
    plan.fullDescription,
    ...plan.includes,
    ...plan.highlights
  ].join(" ").toLowerCase();
  
  if (searchStr.includes("resort 5 estrellas") || searchStr.includes("resort 5★")) return "Resort 5★";
  if (searchStr.includes("hacienda típica")) return "Hacienda Típica";
  if (searchStr.includes("eco-habs")) return "Eco-Habs Tayrona";
  if (searchStr.includes("ryokan")) return "Ryokan Tradicional";
  if (searchStr.includes("hotel 4★") || searchStr.includes("hoteles 4★")) return "Hotel 4★";
  
  const hotelMatch = plan.includes.find(item =>
    item.toLowerCase().includes("hotel") ||
    item.toLowerCase().includes("alojamiento") ||
    item.toLowerCase().includes("hospedaje") ||
    item.toLowerCase().includes("resort")
  );
  
  if (hotelMatch) {
    // clean up generic description
    if (hotelMatch.toLowerCase().includes("hotel 3 noches") || hotelMatch.toLowerCase().includes("alojamiento 3 noches")) {
      return "Hotel Turista Superior";
    }
    return hotelMatch;
  }
  
  const section = getPlanExperienceSection(plan);
  if (section === "internacionales") return "Resort / Hotel Premium";
  if (section === "nacionales") return "Hotel Turista Superior";
  if (section === "circuitos") return "Hotel Categoría Superior";
  return null;
};

const getWhatsAppUrl = (
  plan: TourPlan,
  searchParams?: {
    destination?: string | null;
    date?: string | null;
    adults?: string | null;
    children?: string | null;
  }
) => {
  const destination = searchParams?.destination || plan.location;
  let dateText = "fecha a convenir";
  if (searchParams?.date) {
    try {
      dateText = format(new Date(searchParams.date + "T12:00:00"), "d MMM yyyy", { locale: es });
    } catch (_) {}
  } else if (plan.fecha_salida) {
    dateText = plan.fecha_salida;
  }
  
  const adultsStr = searchParams?.adults || "2";
  const childrenStr = searchParams?.children || "0";
  const totalTravelers = parseInt(adultsStr, 10) + parseInt(childrenStr, 10);
  const travelersText = `${totalTravelers} viajero${totalTravelers !== 1 ? "s" : ""}`;
  
  const text = `Hola Vive Travel Atlántico, me interesa cotizar el plan *${plan.name}* para *${destination}*, aproximado para el mes/fecha de *${dateText}*, para *${travelersText}*. ¿Me podrían dar más información?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

// Intelligent pre-selection scoring engine
const scorePlans = (
  plans: TourPlan[],
  queryDest: string | null,
  queryDate: string | null,
  adultsStr: string | null,
  childrenStr: string | null,
  categoryStr: string | null,
  activityStr: string | null
): TourPlan[] => {
  if (!queryDest) return plans;

  const destLower = queryDest.toLowerCase().trim();
  const dateObj = queryDate ? new Date(queryDate + "T12:00:00") : null;
  const searchMonthIndex = dateObj ? dateObj.getMonth() : null; 
  
  const totalTravelers = parseInt(adultsStr || "2", 10) + parseInt(childrenStr || "0", 10);

  const scored = plans.map((plan) => {
    let score = 0;
    
    const planLoc = plan.location.toLowerCase();
    const planName = plan.name.toLowerCase();
    const planDesc = plan.shortDescription.toLowerCase();
    
    // 1. Destination match
    if (planLoc.includes(destLower)) {
      score += 1000;
      if (planLoc === destLower) {
        score += 200;
      }
    } else {
      const queryWords = destLower.split(/\s+/);
      const matchedWords = queryWords.filter(w => planLoc.includes(w) || planName.includes(w));
      score += matchedWords.length * 150;
    }
    
    if (planName.includes(destLower)) {
      score += 300;
    }
    
    if (planDesc.includes(destLower)) {
      score += 100;
    }

    // 2. Date match
    if (plan.fecha_salida && searchMonthIndex !== null) {
      const monthsEsAbbr = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
      const monthsEsFull = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
      const exitLower = plan.fecha_salida.toLowerCase();
      
      let planMonthIndex = -1;
      monthsEsAbbr.forEach((m, idx) => {
        if (exitLower.includes(m)) planMonthIndex = idx;
      });
      monthsEsFull.forEach((m, idx) => {
        if (exitLower.includes(m)) planMonthIndex = idx;
      });
      
      if (planMonthIndex === searchMonthIndex) {
        score += 400; 
      } else {
        score -= 100; 
      }
    } else if (searchMonthIndex !== null) {
      score += 100;
    }

    // 3. Travelers capacity match
    if (plan.maxGuests) {
      if (totalTravelers <= plan.maxGuests) {
        score += 100;
      } else {
        score -= 200; 
      }
    } else {
      score += 50;
    }

    // 4. Category relevance
    const planSection = getPlanExperienceSection(plan);
    if (categoryStr && planSection === categoryStr) {
      score += 300;
    }

    // 5. Commercial priority (1. Nacionales, 2. Internacionales, 3. Pasadías, 4. Tours, 5. Grupales)
    if (planSection === "nacionales") score += 60;
    else if (planSection === "internacionales") score += 50;
    else if (planSection === "pasadias") score += 40;
    else if (planSection === "tours") score += 30;
    else if (planSection === "grupales") score += 20;

    return { plan, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .map(item => item.plan);
};



// ─── Horizontal Card (1-column list view) ─────────────────────────────────────
const PlanCardHorizontal = memo(function PlanCardHorizontal({
  plan,
  onNavigate,
  searchParams,
}: {
  plan: TourPlan;
  onNavigate: (id: string) => void;
  searchParams?: {
    destination?: string | null;
    date?: string | null;
    adults?: string | null;
    children?: string | null;
  };
}) {
  const [isFav, setIsFav] = useState(() =>
    typeof window !== "undefined" ? isFavorite(plan.id) : false
  );

  const { setFavoritesPulseActive } = useNavigation();

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const nowFav = toggleFavorite(plan.id);
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
    [plan.id, setFavoritesPulseActive]
  );

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getWhatsAppUrl(plan, searchParams), "_blank");
  };

  const planHotel = getPrincipalHotel(plan);
  const keyLabels = getKeyLabels(plan);
  const section = getPlanExperienceSection(plan);

  return (
    <Card
      className="overflow-hidden group border-border/50 hover:border-border hover:shadow-lg transition-all duration-200 py-0 gap-0 cursor-pointer flex flex-col sm:flex-row"
      onClick={() => onNavigate(plan.id)}
    >
      {/* Image */}
      <div className="relative w-full sm:w-[260px] md:w-[300px] shrink-0 overflow-hidden aspect-[3/2] sm:aspect-auto">
        <CardImageCarousel images={plan.images} alt={plan.name} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 pointer-events-none" />

        {/* Duration Badge (Only for National/International) */}
        {(() => {
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
        {section === "grupales" && plan.fecha_salida && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 shadow-sm border border-black/5">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-600" />
            <span>{plan.fecha_salida}</span>
          </div>
        )}

        {/* Cupos Limitados Badge */}
        {section === "grupales" && plan.maxGuests && (
          <div className="absolute bottom-3 left-3 z-10 bg-zinc-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-[pulse_2s_ease-in-out_infinite] shadow-sm">
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
          {/* Category & Hotel */}
          {(() => {
            const isLongTrip = section === "internacionales" || section === "nacionales" || section === "circuitos";
            if (isLongTrip) return null;

            const isShortTrip = section === "pasadias" || section === "grupales" || section === "tours";
            const showCategory = !isShortTrip;
            const showHotel = !!planHotel;

            if (!showCategory && !showHotel) return null;

            return (
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {showCategory && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-md">
                    {plan.category}
                  </span>
                )}
                {showHotel && (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[200px]">
                    🏨 {planHotel}
                  </span>
                )}
              </div>
            );
          })()}

          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg sm:text-[20px] text-foreground leading-tight line-clamp-1 group-hover:text-ocean transition-colors duration-200">
              {plan.name}
            </h3>
            {plan.rating > 0 && (
              <div className="flex items-center gap-1 text-xs font-bold text-foreground shrink-0 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
                <span>{plan.rating.toFixed(1)}</span>
                <span className="text-muted-foreground font-normal">({plan.reviewCount})</span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-1.5">
            {plan.shortDescription}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3">
            {section !== "nacionales" && section !== "internacionales" && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatShortDuration(plan.duration)}</span>
              </div>
            )}
            {(() => {
              const stops = getLocationStops(plan.location);
              return (
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="line-clamp-1">
                    {stops.length > 1 ? stops.join(" → ") : stops[0]}
                  </span>
                </div>
              );
            })()}
            {section === "grupales" && plan.maxGuests && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Máx. {plan.maxGuests}</span>
              </div>
            )}
          </div>

          {/* Departure cadence */}
          {getDepartureCadence(plan) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-1">{getDepartureCadence(plan)}</span>
            </div>
          )}

          {/* Key tags */}
          {keyLabels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {keyLabels.map((lbl, idx) => {
                const { icon: Icon, className } = getKeyLabelStyle(lbl);
                return (
                  <Badge key={idx} variant="outline" className={cn("text-[10px] py-0 px-1.5 font-semibold", className)}>
                    <Icon className="w-2.5 h-2.5" />
                    {lbl}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom row: Price and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-3 border-t border-border/30 gap-3">
          <div className="text-left flex flex-col items-start sm:items-end">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Desde</span>
              <p className="text-foreground font-black text-lg leading-tight">
                {formatPrice(plan.price)}
              </p>
            </div>
            {getPriceRangeUpper(plan) && (
              <span className="text-[10px] text-muted-foreground">
                hasta {getPriceRangeUpper(plan)} según temporada
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              className="rounded-xl text-xs font-semibold px-5 h-9 bg-zinc-900 hover:bg-black text-white border-none shadow-xs cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(plan.id);
              }}
            >
              Ver detalle
            </Button>
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
  searchParams,
}: {
  plan: TourPlan;
  onNavigate: (id: string) => void;
  searchParams?: {
    destination?: string | null;
    date?: string | null;
    adults?: string | null;
    children?: string | null;
  };
}) {
  const [isFav, setIsFav] = useState(() =>
    typeof window !== "undefined" ? isFavorite(plan.id) : false
  );

  const { setFavoritesPulseActive } = useNavigation();

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const nowFav = toggleFavorite(plan.id);
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
    [plan.id, setFavoritesPulseActive]
  );

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getWhatsAppUrl(plan, searchParams), "_blank");
  };

  const planHotel = getPrincipalHotel(plan);
  const keyLabels = getKeyLabels(plan);
  const section = getPlanExperienceSection(plan);

  return (
    <Card
      className="overflow-hidden group border-border/50 hover:border-border hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 py-0 gap-0 cursor-pointer flex flex-col justify-between"
      onClick={() => onNavigate(plan.id)}
    >
      {/* Top half content */}
      <div>
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <CardImageCarousel images={plan.images} alt={plan.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Duration Badge (Only for National/International) */}
          {(() => {
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
          {section === "grupales" && plan.fecha_salida && (
            <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 shadow-sm border border-black/5">
              <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-600" />
              <span>{plan.fecha_salida}</span>
            </div>
          )}

          {/* Cupos Limitados Badge */}
          {section === "grupales" && plan.maxGuests && (
            <div className="absolute bottom-3 left-3 z-10 bg-zinc-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-[pulse_2s_ease-in-out_infinite] shadow-sm">
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

        <CardContent className="p-3.5 sm:p-4 pb-0 space-y-2">
          {/* Category & Hotel */}
          {(() => {
            const isLongTrip = section === "internacionales" || section === "nacionales" || section === "circuitos";
            if (isLongTrip) return null;

            const isShortTrip = section === "pasadias" || section === "grupales" || section === "tours";
            const showCategory = !isShortTrip;
            const showHotel = !!planHotel;

            if (!showCategory && !showHotel) return null;

            return (
              <div className="flex items-center gap-1.5 flex-wrap">
                {showCategory && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-md">
                    {plan.category}
                  </span>
                )}
                {showHotel && (
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                    🏨 {planHotel}
                  </span>
                )}
              </div>
            );
          })()}

          {/* Name */}
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="font-bold text-[17px] text-foreground leading-tight line-clamp-1 group-hover:text-ocean transition-colors duration-200">
              {plan.name}
            </h3>
            {plan.rating > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-foreground shrink-0 mt-0.5">
                <Star className="w-3 h-3 fill-foreground text-foreground" />
                <span>{plan.rating.toFixed(1)}</span>
                <span className="text-muted-foreground font-normal">({plan.reviewCount})</span>
              </div>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {plan.shortDescription}
          </p>

          {/* Meta Info — compact inline */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-xs text-muted-foreground pt-1">
            {section !== "nacionales" && section !== "internacionales" && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatShortDuration(plan.duration)}</span>
              </div>
            )}
            {(() => {
              const stops = getLocationStops(plan.location);
              return (
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="line-clamp-1">
                    {stops.length > 1 ? stops.join(" → ") : stops[0]}
                  </span>
                </div>
              );
            })()}
            {section === "grupales" && plan.maxGuests && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Máx. {plan.maxGuests}</span>
              </div>
            )}
          </div>

          {/* Departure cadence */}
          {getDepartureCadence(plan) && (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 shrink-0" />
              <span className="line-clamp-1">{getDepartureCadence(plan)}</span>
            </div>
          )}

          {/* Key tags */}
          {keyLabels.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1.5">
              {keyLabels.map((lbl, idx) => {
                const { icon: Icon, className } = getKeyLabelStyle(lbl);
                return (
                  <Badge key={idx} variant="outline" className={cn("text-[9px] py-0 px-1 font-semibold", className)}>
                    <Icon className="w-2.5 h-2.5" />
                    {lbl}
                  </Badge>
                );
              })}
            </div>
          )}
        </CardContent>
      </div>

      {/* Bottom: Price and Actions */}
      <CardContent className="p-3.5 sm:p-4 pt-0">
        <div className="pt-2.5 mt-2.5 border-t border-border/30 space-y-2.5">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Desde</span>
            <div className="flex flex-col items-end">
              <p className="text-foreground font-black text-base sm:text-[17px] leading-tight">
                {formatPrice(plan.price)}
              </p>
              {getPriceRangeUpper(plan) && (
                <span className="text-[9px] text-muted-foreground">
                  hasta {getPriceRangeUpper(plan)} según temporada
                </span>
              )}
            </div>
          </div>

          <div>
            <Button
              size="sm"
              className="w-full rounded-xl text-xs font-semibold h-9 bg-zinc-900 hover:bg-black text-white border-none shadow-xs cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(plan.id);
              }}
            >
              Ver detalle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// ─── Main Plans List ───────────────────────────────────────────────────────────
export function PlansList() {
  const {
    selectedItemId,
    navigate,
    plansViewMode,
    setPlansViewMode,
    searchDestination,
    searchOrigin,
    searchDate,
    searchDateEnd,
    searchAdults,
    searchChildren,
    searchCategory,
    searchActivity,
    setSearchIsSticky,
    clearSearch,
  } = useNavigation();
  
  const activeSection = getExperienceSection(selectedItemId);
  const tabsDragScroll = useDragScroll<HTMLDivElement>();

  const { data: tourPlans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  // View mode state — defaults to plansViewMode from store (which is "1" from Home, or "3" from Navbar)
  const [viewMode, setViewMode] = useState<ViewMode>(() => plansViewMode || "3");
  const [sortOption, setSortOption] = useState<SortOption>("popular");
  const [currentPage, setCurrentPage] = useState(1);

  // Sync viewMode when plansViewMode changes via navigation
  useEffect(() => {
    if (plansViewMode) {
      setViewMode(plansViewMode);
    }
  }, [plansViewMode]);

  const publishedPlans = useMemo(
    () => tourPlans.filter((p) => p.published !== false),
    [tourPlans]
  );

  // Score and sort plans if search is active
  const scoredAllPlans = useMemo(() => {
    if (!searchDestination) return [];

    const query = searchDestination.toLowerCase().trim();
    const queryWords = query.split(/\s+/).filter(Boolean);

    const filtered = publishedPlans.filter((plan) => {
      const planLoc = plan.location.toLowerCase();
      const planName = plan.name.toLowerCase();
      const planDesc = plan.shortDescription.toLowerCase();

      const hasDirectMatch = planLoc.includes(query) || planName.includes(query) || planDesc.includes(query);
      const hasWordMatch = queryWords.length > 0 && queryWords.some((w) => planLoc.includes(w) || planName.includes(w));

      return hasDirectMatch || hasWordMatch;
    });

    return scorePlans(
      filtered,
      searchDestination,
      searchDate,
      searchAdults,
      searchChildren,
      searchCategory,
      searchActivity
    );
  }, [publishedPlans, searchDestination, searchDate, searchAdults, searchChildren, searchCategory, searchActivity]);

  const sectionPlans = useMemo(
    () => {
      if (searchDestination) {
        // If searching, we show plans from the active tab filtered from the scored list
        return scoredAllPlans.filter(
          (plan) => getPlanExperienceSection(plan) === activeSection.id
        );
      } else {
        // Normal category filter
        return publishedPlans.filter(
          (plan) => getPlanExperienceSection(plan) === activeSection.id
        );
      }
    },
    [publishedPlans, scoredAllPlans, activeSection.id, searchDestination]
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
    setPlansViewMode(mode);
  }, [setPlansViewMode]);

  const handleClearFilters = useCallback(() => {
    clearAll();
    setCurrentPage(1);
  }, [clearAll]);

  const handleClearAll = useCallback(() => {
    clearAll();
    clearSearch();
    setCurrentPage(1);
  }, [clearAll, clearSearch]);

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

  const handleModifySearch = useCallback(() => {
    navigate("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSearchIsSticky(false);
  }, [navigate, setSearchIsSticky]);

  const gridCols = getGridCols(viewMode);
  const isHorizontal = viewMode === "1";

  // Identify best matched plan overall for summary display
  const bestMatchOverall = useMemo(() => {
    if (scoredAllPlans.length > 0) return scoredAllPlans[0];
    if (sectionPlans.length > 0) return sectionPlans[0];
    return undefined;
  }, [scoredAllPlans, sectionPlans]);

  const searchParams = useMemo(() => ({
    destination: searchDestination,
    date: searchDate,
    adults: searchAdults,
    children: searchChildren
  }), [searchDestination, searchDate, searchAdults, searchChildren]);

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
    <div className="bg-white">
      <PageBanner
        eyebrow="Descubre"
        title="Experiencias y viajes"
        subtitle="Explora nuestra selección de destinos diseñados para ti."
        image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=600&fit=crop"
        fallbackImage="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1600&h=600&fit=crop"
      />
    <section className="py-4 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Tabs - Order 1 in Mobile, 2 in Desktop */}
        <div className="order-1 lg:order-2 mb-5 lg:mb-6 w-full overflow-hidden mt-1 lg:mt-0 relative after:absolute after:right-0 after:top-0 after:bottom-0 after:w-8 after:bg-gradient-to-l after:from-white after:to-transparent after:pointer-events-none lg:after:hidden">
          <div
            ref={tabsDragScroll.ref}
            onMouseDown={tabsDragScroll.onMouseDown}
            onMouseMove={tabsDragScroll.onMouseMove}
            onMouseUp={tabsDragScroll.onMouseUp}
            onMouseLeave={tabsDragScroll.onMouseLeave}
            onClickCapture={tabsDragScroll.onClickCapture}
            className="flex overflow-x-auto items-center md:justify-center gap-2.5 pb-2 -mb-2 px-1 cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
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
            onClearAll={handleClearFilters}
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
                  onClearAll={handleClearFilters}
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
                    onNavigate={handleNavigate}
                    searchParams={searchParams} />
                ) : (
                  <PlanCardVertical
                    key={plan.id}
                    plan={plan}
                    onNavigate={handleNavigate}
                    searchParams={searchParams} />
                )
              )}
            </div>

            {/* Empty State */}
            {filteredPlans.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 max-w-md mx-auto my-8">
                <Compass className="w-12 h-12 text-zinc-400 mb-4 stroke-[1.5]" />
                <h3 className="text-zinc-900 font-bold text-[18px] mb-1.5">
                  No hay experiencias con estos filtros
                </h3>
                <p className="text-zinc-500 text-sm mb-6 max-w-xs leading-relaxed">
                  Intenta ajustar los filtros en la barra lateral o limpiar la búsqueda para encontrar más opciones disponibles.
                </p>
                <Button
                  onClick={handleClearAll}
                  className="bg-zinc-950 hover:bg-zinc-900 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-200 h-11"
                >
                  Limpiar filtros
                </Button>
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
    </div>
  );
}


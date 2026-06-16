"use client";

import { useMemo, memo } from "react";
import { MapPin, Clock, Users, Compass, Heart, ArrowRight, Sun, Moon, Calendar, Hotel, Tag } from "lucide-react";
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

// ─── Search Summary Header Component ──────────────────────────────────────────

function SearchSummaryHeader({
  destination,
  origin,
  date,
  dateEnd,
  adults,
  childrenCount,
  category,
  resultCount,
  bestMatchPlan,
  onModify,
}: {
  destination: string;
  origin: string | null;
  date: string | null;
  dateEnd: string | null;
  adults: string | null;
  childrenCount: string | null;
  category: string | null;
  resultCount: number;
  bestMatchPlan?: TourPlan;
  onModify: () => void;
}) {
  const totalTravelers = parseInt(adults || "2", 10) + parseInt(childrenCount || "0", 10);
  const travelersText = `${totalTravelers} persona${totalTravelers !== 1 ? "s" : ""}`;
  
  const getDatesLabel = () => {
    if (!date) return "Fechas por definir";
    try {
      const start = new Date(date + "T12:00:00");
      const startStr = format(start, "d MMM", { locale: es });
      if (!dateEnd) return `${startStr} (${format(start, "MMMM", { locale: es })})`;
      const end = new Date(dateEnd + "T12:00:00");
      const endStr = format(end, "d MMM yyyy", { locale: es });
      return `${startStr} - ${endStr}`;
    } catch (_) {
      return "Fechas por definir";
    }
  };

  const bestHotel = bestMatchPlan ? getPrincipalHotel(bestMatchPlan) : null;
  const bestLabels = bestMatchPlan ? getKeyLabels(bestMatchPlan) : [];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-zinc-200/70 rounded-2xl p-4 md:p-5 mb-5 md:mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 mb-4 border-b border-zinc-150">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-ocean uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Resultado de la búsqueda inteligente</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-800 leading-tight">
            Coincidencias para {destination}
          </h2>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onModify}
          className="rounded-xl text-xs font-bold border-zinc-250 text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900 shrink-0 h-9"
        >
          Modificar búsqueda
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Side: Summary info columns */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Destination */}
          <div className="bg-white border border-zinc-150 p-3 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Destino</span>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-ocean shrink-0" />
              <span className="text-xs sm:text-sm font-extrabold text-zinc-800 truncate">{destination}</span>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white border border-zinc-150 p-3 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Fechas</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5 text-ocean shrink-0" />
              <span className="text-xs sm:text-sm font-extrabold text-zinc-800 truncate">{getDatesLabel()}</span>
            </div>
          </div>

          {/* Travelers */}
          <div className="bg-white border border-zinc-150 p-3 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Viajeros</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Users className="w-3.5 h-3.5 text-ocean shrink-0" />
              <span className="text-xs sm:text-sm font-extrabold text-zinc-800 truncate">{travelersText}</span>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white border border-zinc-150 p-3 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Categoría</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Compass className="w-3.5 h-3.5 text-ocean shrink-0" />
              <span className="text-xs sm:text-sm font-extrabold text-zinc-800 truncate capitalize">
                {category || "Cualquiera"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Commercial highlight box */}
        <div className="lg:col-span-5 bg-ocean/5 border border-ocean/10 p-4 rounded-xl flex flex-col justify-between gap-2">
          {bestMatchPlan ? (
            <>
              <div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[9px] font-black text-ocean uppercase tracking-wider bg-ocean/10 px-2 py-0.5 rounded-full">
                    RECOMENDACIÓN DESTACADA
                  </span>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    {resultCount} {resultCount === 1 ? "opción" : "opciones"}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-zinc-800 mt-1.5 line-clamp-1">
                  {bestMatchPlan.name}
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {bestHotel && (
                    <span className="text-[9px] font-semibold text-zinc-650 bg-white border border-zinc-200 px-2 py-0.5 rounded-md truncate max-w-[160px]">
                      🏨 {bestHotel}
                    </span>
                  )}
                  {bestLabels.map((lbl, i) => (
                    <span key={i} className="text-[9px] font-semibold text-ocean bg-white border border-ocean/10 px-2 py-0.5 rounded-md">
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-ocean/10">
                <div className="flex items-baseline gap-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Desde</span>
                  <span className="text-sm font-black text-ocean-dark">{formatPrice(bestMatchPlan.price)}</span>
                </div>
                <span className="text-[9px] font-bold text-ocean flex items-center gap-1">
                  Ver planes abajo <ArrowRight className="w-3 h-3 animate-[bounce_1.5s_infinite]" />
                </span>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-2 text-zinc-500">
              <Compass className="w-6 h-6 text-zinc-400 mb-1" />
              <p className="text-xs font-semibold">Sin planes coincidentes</p>
              <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">Modifica los filtros para ver otras alternativas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getWhatsAppUrl(plan, searchParams), "_blank");
  };

  const planHotel = getPrincipalHotel(plan);
  const keyLabels = getKeyLabels(plan);

  return (
    <Card
      className="overflow-hidden group border-border/50 hover:border-border hover:shadow-lg transition-all duration-200 py-0 gap-0 cursor-pointer flex flex-col sm:flex-row"
      onClick={() => onNavigate(plan.id)}
    >
      {/* Image */}
      <div className="relative w-full sm:w-[260px] md:w-[300px] shrink-0 overflow-hidden aspect-[3/2] sm:aspect-auto">
        <img
          src={plan.images[0]}
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
          {/* Category & Hotel */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-ocean bg-ocean/10 px-2 py-0.5 rounded-md">
              {plan.category}
            </span>
            {planHotel && (
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[200px]">
                🏨 {planHotel}
              </span>
            )}
          </div>

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
            {getPlanExperienceSection(plan) === "grupales" && plan.maxGuests && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Máx. {plan.maxGuests}</span>
              </div>
            )}
          </div>

          {/* Key tags */}
          {keyLabels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {keyLabels.map((lbl, idx) => (
                <Badge key={idx} variant="outline" className="text-[10px] py-0 px-1.5 text-zinc-650 bg-zinc-50 border-zinc-200 font-semibold">
                  {lbl}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Bottom row: Price and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-3 border-t border-border/30 gap-3">
          <div className="text-left flex items-baseline gap-1.5 justify-start sm:justify-end">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Desde</span>
            {plan.priceRange && plan.priceRange.includes("-") && (
              <span className="text-xs text-muted-foreground line-through">
                {plan.priceRange.split("-")[1].trim()}
              </span>
            )}
            <p className="text-foreground font-black text-lg leading-tight">
              {formatPrice(plan.price)}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl text-xs font-bold flex-1 sm:flex-initial h-9 border-zinc-200 hover:bg-zinc-50"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(plan.id);
              }}
            >
              Ver detalle
            </Button>
            <Button
              size="sm"
              className="rounded-xl text-xs font-bold flex-1 sm:flex-initial h-9 bg-yellow-400 hover:bg-yellow-500 text-zinc-950 border-none shadow-sm shadow-yellow-400/10"
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

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getWhatsAppUrl(plan, searchParams), "_blank");
  };

  const planHotel = getPrincipalHotel(plan);
  const keyLabels = getKeyLabels(plan);

  return (
    <Card
      className="overflow-hidden group border-border/50 hover:border-border hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 py-0 gap-0 cursor-pointer flex flex-col justify-between"
      onClick={() => onNavigate(plan.id)}
    >
      {/* Top half content */}
      <div>
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <img
            src={plan.images[0]}
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

        <CardContent className="p-3.5 sm:p-4 pb-0 space-y-2">
          {/* Category & Hotel */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-ocean bg-ocean/10 px-2 py-0.5 rounded-md">
              {plan.category}
            </span>
            {planHotel && (
              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                🏨 {planHotel}
              </span>
            )}
          </div>

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
            {getPlanExperienceSection(plan) === "grupales" && plan.maxGuests && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Máx. {plan.maxGuests}</span>
              </div>
            )}
          </div>

          {/* Key tags */}
          {keyLabels.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1.5">
              {keyLabels.map((lbl, idx) => (
                <Badge key={idx} variant="outline" className="text-[9px] py-0 px-1 text-zinc-650 bg-zinc-50 border-zinc-200 font-semibold">
                  {lbl}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </div>

      {/* Bottom: Price and Actions */}
      <CardContent className="p-3.5 sm:p-4 pt-0">
        <div className="pt-2.5 mt-2.5 border-t border-border/30 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Desde</span>
            <div className="flex items-baseline gap-1.5">
              {plan.priceRange && plan.priceRange.includes("-") && (
                <span className="text-[11px] text-muted-foreground line-through">
                  {plan.priceRange.split("-")[1].trim()}
                </span>
              )}
              <p className="text-foreground font-black text-base sm:text-[17px] leading-tight">
                {formatPrice(plan.price)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl text-[11px] font-bold h-8.5 border-zinc-200 hover:bg-zinc-50 py-1"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(plan.id);
              }}
            >
              Ver detalle
            </Button>
            <Button
              size="sm"
              className="rounded-xl text-[11px] font-bold h-8.5 bg-yellow-400 hover:bg-yellow-500 text-zinc-950 border-none shadow-sm shadow-yellow-400/10 py-1"
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

// ─── Main Plans List ───────────────────────────────────────────────────────────
export function PlansList() {
  const {
    selectedItemId,
    navigate,
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

  // Score and sort plans if search is active
  const scoredAllPlans = useMemo(() => {
    if (!searchDestination) return [];
    return scorePlans(
      publishedPlans,
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
    <section className="py-4 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Header - Order 2 in Mobile, 1 in Desktop */}
        <div className="order-2 lg:order-1">
          {searchDestination ? (
            <SearchSummaryHeader
              destination={searchDestination}
              origin={searchOrigin}
              date={searchDate}
              dateEnd={searchDateEnd}
              adults={searchAdults}
              childrenCount={searchChildren}
              category={searchCategory}
              resultCount={sortedPlans.length}
              bestMatchPlan={bestMatchOverall}
              onModify={handleModifySearch}
            />
          ) : (
            <SectionHeader
              title="Experiencias y viajes"
              subtitle="Explora nuestra selección de destinos diseñados para ti."
              className="mb-3 lg:mb-8" />
          )}
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


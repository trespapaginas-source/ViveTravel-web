"use client";

import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Mountain,
  Calendar,
  Navigation,
  MessageCircle,
  Phone,
  Check,
  X,
  Sparkles,
  Heart,
  Share2,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PropertyGallery } from "@/components/shared/property-gallery";
import { useNavigation } from "@/lib/store";
import { fetchPlan } from "@/lib/api";
import { getPlanExperienceSection } from "@/lib/experience-sections";
import { useQuery } from "@tanstack/react-query";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { ShareDialog } from "@/components/shared/share-dialog";
import { ExpandableSection } from "@/components/shared/expandable-section";
import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Minus } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { detectUserCity } from "@/lib/geolocation";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.507.003 10.024-4.512 10.026-10.022.002-2.67-1.038-5.18-2.93-7.076-1.893-1.897-4.405-2.937-7.079-2.939-5.51 0-10.024 4.52-10.027 10.029-.001 1.835.507 3.572 1.47 5.114l-.993 3.626 3.908-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.174.2-.298.3-.496.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.011c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);


const getNextWeekend = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay();
  if (day === 6) return today;
  if (day === 0) return today;
  const daysUntilSaturday = 6 - day;
  return addDays(today, daysUntilSaturday);
};
import { toast } from "sonner";

const categoryColors: Record<string, string> = {
  Naturaleza: "bg-ocean/80 text-white",
  Playa: "bg-ocean/80 text-white",
  Aventura: "bg-ocean/80 text-white",
  Ecoturismo: "bg-ocean/80 text-white",
  Experiencia: "bg-ocean/80 text-white",
  Cultural: "bg-ocean/80 text-white",
};


function getShortDuration(duration: string): string {
  const match = duration.match(/(\d+)\s*horas?/i);
  return match ? `${match[1]} HORAS` : duration;
}

import { TourPlan } from "@/lib/data";

export function PlanDetail() {
  const {
    selectedItemId,
    navigate,
    searchAdults,
    searchChildren,
    searchDate,
    searchOrigin,
    searchRoomsDetail,
    setSearchPriceFrom,
    setFavoritesPulseActive,
  } = useNavigation();
  const { data: plan, isLoading } = useQuery({
    queryKey: ["plan", selectedItemId],
    queryFn: () => fetchPlan(selectedItemId!),
    enabled: !!selectedItemId,
  });

  const [roomType, setRoomType] = useState<"individual" | "doble" | "triple" | "cuadruple">("doble");
  const [originCity, setOriginCity] = useState<string>(() => searchOrigin || "Barranquilla");

  useEffect(() => {
    if (typeof window !== "undefined" && !searchOrigin) {
      const detectCity = async () => {
        try {
          const city = await detectUserCity();
          if (city) setOriginCity(city);
        } catch (error) {
          console.warn("[Geolocation] Error auto-detecting city:", error);
        }
      };
      detectCity();
    }
  }, [searchOrigin]);

  const roomTypeLabels: Record<string, string> = {
    individual: "Individual",
    doble: "Doble",
    triple: "Triple",
    cuadruple: "Cuádruple",
  };

  const [isFav, setIsFav] = useState(() =>
    typeof window !== "undefined" && selectedItemId
      ? isFavorite(selectedItemId)
      : false
  );

  const [shareOpen, setShareOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (searchDate) {
      // Adding a time component avoids timezone offset parsing issues
      const parsed = new Date(searchDate + "T12:00:00");
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return getNextWeekend();
  });
  const [guests, setGuests] = useState(() => {
    const adults = parseInt(searchAdults || "1", 10);
    const children = parseInt(searchChildren || "0", 10);
    return Math.max(1, adults + children);
  });
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);
  const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  
  const isBookingStyle = plan?.category === "Nacional" || plan?.category === "Internacional";
  const isGrupal = plan ? getPlanExperienceSection(plan) === "grupales" : false;
  const sectionId = plan ? getPlanExperienceSection(plan) : "";
  const isBookingGallery = sectionId === "internacionales" || sectionId === "nacionales" || sectionId === "circuitos";

  const currentPrice = plan ? plan.price : 0;
  const totalPlanPrice = guests * currentPrice;

  useEffect(() => {
    if (plan) {
      setSearchPriceFrom(plan.price);
    }
  }, [plan, setSearchPriceFrom]);


  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isGrupal) return;
    
    let target = new Date();
    if (plan?.fecha_salida) {
      const parseMonthAbbr = (str: string) => {
        const [day, monthAbbr] = str.split(" ");
        const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
        const monthIndex = months.findIndex(m => m === monthAbbr);
        const now = new Date();
        const date = new Date(now.getFullYear(), monthIndex, parseInt(day), 7, 0, 0);
        if (date < now) date.setFullYear(date.getFullYear() + 1);
        return date;
      };
      target = parseMonthAbbr(plan.fecha_salida);
    } else {
      target = getNextWeekend();
      target.setHours(7, 0, 0, 0);
      if (target.getTime() < new Date().getTime()) {
        target.setDate(target.getDate() + 7);
      }
    }

    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isGrupal]);
  
  const today = new Date();
  today.setHours(0,0,0,0);

  const handleWhatsAppRedirect = useCallback(() => {
    if (!plan) return;
    const total = formatPrice(guests * currentPrice);

    const message = [
      `🌴 *CONSULTA VIVE TRAVEL*`,
      ``,
      `📋 *Plan:* ${plan.name}`,
      `📍 *Destino:* ${plan.location}`,
      originCity ? `🛫 *Origen:* ${originCity}` : "",
      `👥 *Viajeros:* ${guests} persona${guests > 1 ? "s" : ""}`,
      `🛏️ *Habitación:* ${roomTypeLabels[roomType]}`,
      `📅 *Fecha de viaje:* ${
        plan.fecha_salida ||
        (plan.fixedDeparture
          ? selectedDeparture
            ? `${formatDepartureFull(selectedDeparture.start, selectedDeparture.end)} de ${new Date(selectedDeparture.start + "T12:00:00").getFullYear()}`
            : "Por confirmar — salida programada"
          : selectedDate
          ? format(selectedDate, "d MMM yyyy", { locale: es })
          : "Por definir")
      }`,
      `💵 *Total estimado:* ${total}`,
      ``,
      `Hola, acabo de cotizar esta experiencia en su sitio web. ¿Podrían confirmarme disponibilidad de cupos y opciones de pago?`
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  }, [plan, guests, selectedDate, originCity, roomType, currentPrice]);

  const handleToggleFavorite = useCallback(() => {
    if (!selectedItemId) return;
    const nowFav = toggleFavorite(selectedItemId);
    setIsFav(nowFav);
    const isMobile = window.innerWidth < 768;
    if (isMobile && nowFav) {
      setFavoritesPulseActive(true);
    } else {
      toast.success(nowFav ? "Guardado en tu colección" : "Eliminado de tu colección", {
        description: nowFav ? "Encuéntralo en tu lista de favoritos" : undefined,
      });
    }
  }, [selectedItemId, setFavoritesPulseActive]);

  const handleWhatsAppShare = useCallback(() => {
    if (!plan) return;
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const text = `Mira este increíble plan en Vive Travel: ${plan.name}\n${currentUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  }, [plan]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-foreground border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <Mountain className="w-10 h-10 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">
          Plan no encontrado
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("plans", "pasadias")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a experiencias
        </Button>
      </div>
    );
  }

  const formatDepartureChip = (start: string, end: string) => {
    const s = new Date(start + "T12:00:00");
    const e = new Date(end + "T12:00:00");
    const sameMonth = s.getMonth() === e.getMonth();
    return sameMonth
      ? `${format(s, "d")}–${format(e, "d MMM", { locale: es })}`
      : `${format(s, "d MMM", { locale: es })} – ${format(e, "d MMM", { locale: es })}`;
  };

  const formatDepartureFull = (start: string, end: string) => {
    const s = new Date(start + "T12:00:00");
    const e = new Date(end + "T12:00:00");
    const sameMonth = s.getMonth() === e.getMonth();
    return sameMonth
      ? `${format(s, "d")} al ${format(e, "d 'de' MMMM", { locale: es })}`
      : `${format(s, "d 'de' MMMM", { locale: es })} al ${format(e, "d 'de' MMMM", { locale: es })}`;
  };

  const upcomingDepartures = (plan.departureDates ?? []).filter(
    (d) => new Date(d.end + "T23:59:59") >= today
  );
  const hasDepartureDates = !!plan.fixedDeparture && upcomingDepartures.length > 0;
  const selectedDeparture = selectedDate
    ? upcomingDepartures.find((d) => d.start === format(selectedDate, "yyyy-MM-dd"))
    : undefined;
  const selectedIsValidDeparture = hasDepartureDates && !!selectedDeparture;

  const closeDatePicker = (d: Date) => {
    setSelectedDate(d);
    setDatePopoverOpen(false);
    setMobileCalendarOpen(false);
  };

  const departureDatePicker = (
    <div className="p-4 w-72 sm:w-80">
      {hasDepartureDates ? (
        <>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Fechas disponibles
          </p>
          <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1">
            {upcomingDepartures.map(({ start, end }) => {
              const d = new Date(start + "T12:00:00");
              const isSelected = selectedDate && format(selectedDate, "yyyy-MM-dd") === start;
              return (
                <button
                  key={start}
                  onClick={() => closeDatePicker(d)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm font-semibold transition-colors",
                    isSelected
                      ? "border-foreground bg-foreground text-white"
                      : "border-border text-foreground hover:border-foreground/40"
                  )}
                >
                  {formatDepartureChip(start, end)}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center">
          <Calendar className="w-6 h-6 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold text-foreground mt-2">
            Salidas programadas todo el año
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Aún no tenemos las fechas exactas cargadas. Escríbenos y te confirmamos la próxima salida disponible.
          </p>
          <Button
            size="sm"
            className="mt-3 w-full bg-[#1DA851] hover:bg-[#199346] text-white"
            onClick={() => {
              setDatePopoverOpen(false);
              setMobileCalendarOpen(false);
              handleWhatsAppRedirect();
            }}
          >
            Consultar fechas por WhatsApp
          </Button>
        </div>
      )}
    </div>
  );

  const cotizadorCard = (
    <aside className="w-full lg:w-[380px] shrink-0">
      <div className="lg:sticky lg:top-24">
        <Card className="border-border/50 shadow-xl py-0 gap-0 bg-white">
          <CardContent className="p-6 space-y-5">
            {/* Fechas, Personas y Ciudad de salida */}
            <div className="space-y-4">
              {!isGrupal && (
                <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                  <PopoverTrigger asChild>
                    <button className="w-full rounded-xl border border-border p-3 text-left hover:border-ocean/50 focus:outline-none focus:ring-2 focus:ring-ocean/30 bg-white">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Fecha del plan</label>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {plan.fixedDeparture
                          ? hasDepartureDates
                            ? selectedDeparture
                              ? formatDepartureFull(selectedDeparture.start, selectedDeparture.end)
                              : "Elige una fecha disponible"
                            : "Consultar fechas disponibles"
                          : selectedDate
                          ? format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })
                          : "Seleccionar fecha"}
                      </p>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    {plan.fixedDeparture ? (
                      departureDatePicker
                    ) : (
                      <CalendarUI
                        mode="single"
                        selected={selectedDate}
                        onSelect={(d) => { if(d) { setSelectedDate(d); setDatePopoverOpen(false); } }}
                        disabled={{ before: today }}
                        locale={es}
                        defaultMonth={selectedDate || today} />
                    )}
                  </PopoverContent>
                </Popover>
              )}

              <Popover open={guestPopoverOpen} onOpenChange={setGuestPopoverOpen}>
                <PopoverTrigger asChild>
                  <button className="w-full rounded-xl border border-border p-3 text-left hover:border-ocean/50 focus:outline-none focus:ring-2 focus:ring-ocean/30 bg-white">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Personas</label>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {guests} persona{guests > 1 ? "s" : ""}{isGrupal ? ` (máx. ${plan.maxGuests})` : ""}
                    </p>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4" align="start">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Personas</p>
                      {isGrupal && <p className="text-xs text-muted-foreground">Máximo {plan.maxGuests}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setGuests(g => Math.max(1, g - 1))} disabled={guests <= 1}><Minus className="w-4 h-4" /></Button>
                      <span className="w-6 text-center text-sm font-semibold">{guests}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setGuests(g => isGrupal ? Math.min(plan.maxGuests, g + 1) : g + 1)} disabled={isGrupal ? guests >= plan.maxGuests : false}><Plus className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Separator />

              {/* Ciudad de salida */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ciudad de salida</label>
                <select
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full rounded-xl border border-border p-3 text-sm font-semibold text-foreground bg-white hover:border-border/80 focus:outline-none focus:ring-2 focus:ring-foreground/10 cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px'
                  }}
                >
                  {!["Barranquilla", "Bogotá", "Medellín", "Cali"].includes(originCity) && (
                    <option value={originCity}>{originCity}</option>
                  )}
                  <option value="Barranquilla">Barranquilla</option>
                  <option value="Bogotá">Bogotá</option>
                  <option value="Medellín">Medellín</option>
                  <option value="Cali">Cali</option>
                </select>
              </div>

              <Separator />

              {/* Botón Reservar */}
              <div className="pt-2">
                {isGrupal ? (
                  <Button
                    className="relative flex items-center justify-center gap-2 h-14 px-4 rounded-xl bg-[#1DA851] hover:bg-[#199346] text-white shadow-sm transition-all duration-300 hover:shadow-md w-full font-bold text-[15px]"
                    onClick={handleWhatsAppRedirect}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    <span>Reservar por WhatsApp</span>
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-[#1DA851] hover:bg-[#199346] text-white rounded-xl h-14 text-base font-bold shadow-sm transition-all"
                    onClick={() => setSummaryModalOpen(true)}
                  >
                    Reservar
                  </Button>
                )}
              </div>

              <Separator />

              {/* Precio final (El cierre) */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {guests > 1 ? `Total (${guests} personas)` : "Desde"}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl sm:text-3xl font-bold text-foreground leading-none mt-1">
                      {formatPrice(totalPlanPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-28 lg:pb-10">
      <div className={cn("mx-auto", isBookingGallery ? "max-w-6xl" : "max-w-7xl")}>
        {/* Back Button (Desktop) */}
        <Button
          variant="ghost"
          onClick={() => navigate("plans", getPlanExperienceSection(plan))}
          className="hidden md:flex gap-2 mb-6 -ml-2 text-muted-foreground hover:text-foreground w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a experiencias
        </Button>

        {/* Image Gallery with Mobile Floating Actions */}
        <div className="relative mb-8">
          {/* Mobile Floating Actions */}
          <div className="md:hidden absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            {/* Back */}
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-border/20 shadow-md pointer-events-auto hover:bg-white"
              onClick={() => navigate("plans", getPlanExperienceSection(plan))}
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
            
            {/* Right actions: Share & Fav */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <Button
                variant="outline"
                size="icon"
                className={`h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-border/20 shadow-md hover:bg-white transition-colors ${
                  isFav ? "text-indigo" : "text-foreground"
                }`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`w-5 h-5 transition-colors ${isFav ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-border/20 shadow-md hover:bg-white text-[#25D366] hover:text-[#20ba5a]"
                onClick={handleWhatsAppShare}
                aria-label="Compartir por WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {isBookingGallery ? (
            <div className="flex flex-col lg:flex-row gap-6 items-stretch">
              <div className="flex-1 min-w-0">
                <PropertyGallery
                  images={plan.images}
                  title={plan.name}
                  variant="booking"
                  className="mb-0" />
              </div>
              <div className="hidden lg:block">
                {cotizadorCard}
              </div>
            </div>
          ) : (
            <PropertyGallery
              images={plan.images}
              title={plan.name}
              variant="default"
              className="mb-0" />
          )}
        </div>

        {/* Main Content + Sticky Price Card */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Title Section */}
            <div>
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  {plan.name}
                </h1>
                <Badge
                  className={`${categoryColors[plan.category] || "bg-ocean/80 text-white"} border-0 text-xs font-medium shrink-0 mt-1`}
                >
                  {plan.category}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{plan.location}</span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-9 w-9 border-border/50 hover:border-border text-[#25D366] hover:text-[#20ba5a] hover:bg-emerald-50/50"
                    onClick={handleWhatsAppShare}
                    aria-label="Compartir por WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full h-9 w-9 border-border/50 hover:border-border transition-colors ${
                      isFav ? "border-indigo/30 bg-indigo/5" : ""
                    }`}
                    onClick={handleToggleFavorite}
                    aria-label={isFav ? "Eliminar de favoritos" : "Guardar en favoritos"}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? "fill-indigo text-indigo" : ""
                      }`} />
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="my-5" />

            {/* Info Section */}
            {isBookingStyle ? (
              <div className="sticky top-16 sm:top-20 z-30 bg-background border-b border-border/50 mb-6 relative after:absolute after:right-0 after:top-0 after:bottom-0 after:w-8 after:bg-gradient-to-l after:from-white after:to-transparent after:pointer-events-none lg:after:hidden">
                <div className="flex overflow-x-auto gap-6 hide-scrollbar pt-2 pb-0">
                  {[
                    { id: "general", label: "General" },
                    { id: "incluye", label: "Incluye" },
                    { id: "itinerario", label: "Itinerario" },
                    { id: "condiciones", label: "Condiciones" },
                  ].map((tab) => (
                    <a
                      key={tab.id}
                      href={`#${tab.id}`}
                      className="text-[13px] sm:text-sm font-semibold text-muted-foreground hover:text-foreground whitespace-nowrap py-3 border-b-2 border-transparent hover:border-foreground transition-all"
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(tab.id);
                        if (element) {
                          const isMobile = window.innerWidth < 768;
                          const offset = isMobile ? 128 : 100;
                          const bodyRect = document.body.getBoundingClientRect().top;
                          const elementRect = element.getBoundingClientRect().top;
                          const elementPosition = elementRect - bodyRect;
                          const offsetPosition = elementPosition - offset;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                          });
                        }
                      }}
                    >
                      {tab.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Key Stats Row */}
                <div className="grid grid-cols-2 md:flex md:items-center gap-y-3 gap-x-6 md:gap-8 flex-wrap py-2">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-foreground shrink-0" strokeWidth={1.5} />
                    <span className="text-base text-foreground font-normal hidden md:inline">{plan.duration}</span>
                    <span className="text-sm text-foreground font-normal md:hidden">{getShortDuration(plan.duration)}</span>
                  </div>
                  {isGrupal && (
                    <>
                      <div className="hidden md:block w-px h-5 bg-border/40" />
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-foreground shrink-0" strokeWidth={1.5} />
                        <span className="text-base text-foreground font-normal hidden md:inline">Máx. {plan.maxGuests} personas</span>
                        <span className="text-sm text-foreground font-normal md:hidden">{plan.maxGuests} PAX</span>
                      </div>
                    </>
                  )}
                </div>
                <Separator className="my-5" />
              </>
            )}

            {/* Full Description */}
            <div id="general" className="scroll-mt-24">
              <h2 className="text-2xl md:text-[28px] font-bold tracking-tight text-foreground mb-4">
                {isBookingStyle ? "General" : "Acerca de este plan"}
              </h2>
              <ExpandableSection>
                <p className="text-foreground leading-relaxed text-base font-normal">
                  {plan.fullDescription}
                </p>
              </ExpandableSection>
            </div>

            <Separator className="my-5" />

            {/* Qué incluye */}
            <div id="incluye" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3.5">
                {isBookingStyle ? "Incluye" : "Qué incluye"}
              </h2>
              <ExpandableSection itemCount={plan.includes.length} maxHeight={210}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {plan.includes.map((item, i) => {
                    const text = (item as any).text || item;
                    return (
                      <div key={i} className="flex items-start gap-2 py-1">
                        <Check className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{text}</span>
                      </div>
                    );
                  })}
                </div>
              </ExpandableSection>
            </div>

            {!isBookingStyle && (
              <>
                <Separator className="my-5" />

                {/* Qué no incluye */}
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3.5">
                    Qué no incluye
                  </h2>
                  <ExpandableSection itemCount={plan.excludes.length} maxHeight={210}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {plan.excludes.map((item, i) => {
                        const text = (item as any).text || item;
                        return (
                          <div key={i} className="flex items-start gap-2 py-1">
                            <X className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </ExpandableSection>
                </div>

                <Separator className="my-5" />

                {/* Puntos destacados */}
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3.5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-foreground" />
                    Puntos destacados
                  </h2>
                  <ExpandableSection itemCount={plan.highlights.length} maxHeight={210}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {plan.highlights.map((item, i) => {
                        const text = (item as any).text || item;
                        return (
                          <div key={i} className="flex items-start gap-2 py-1">
                            <Sparkles className="w-3.5 h-3.5 text-foreground shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground font-medium">
                              {text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </ExpandableSection>
                </div>

                {(plan.schedule || plan.meeting) && (
                  <>
                    <Separator className="my-5" />
                    {/* Schedule & Meeting */}
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3.5">
                        Horario y punto de encuentro
                      </h2>
                      <ExpandableSection itemCount={2}>
                        <div className="space-y-3">
                          {plan.schedule && (
                            <InfoItem
                              icon={Calendar}
                              label="Horario"
                              value={plan.schedule} />
                          )}
                          {plan.meeting && (
                            <InfoItem
                              icon={Navigation}
                              label="Punto de encuentro"
                              value={plan.meeting} />
                          )}
                        </div>
                      </ExpandableSection>
                    </div>
                  </>
                )}
              </>
            )}

            {isBookingStyle && (
              <>
                <Separator className="my-5" />
                
                {/* Itinerario */}
                <div id="itinerario" className="scroll-mt-24">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    Itinerario
                  </h2>
                  <div className="space-y-6">
                    {(plan as any).itinerary ? (
                      ((plan as any).itinerary as any[]).map((day: any, i: number) => (
                        <div key={i} className="pl-4 border-l-2 border-ocean/20">
                          <h3 className="font-bold text-base text-foreground">Día {i + 1}: {day.title || ""}</h3>
                          <p className="text-muted-foreground text-sm mt-1">{day.description || day.activities?.join(", ")}</p>
                        </div>
                      ))
                    ) : (
                      <div className="pl-4 border-l-2 border-ocean/20">
                        <p className="text-foreground text-sm font-medium">Itinerario detallado bajo solicitud</p>
                        <p className="text-muted-foreground text-sm mt-1">
                          El itinerario específico para este viaje está disponible y se entregará al momento de la reserva o previa solicitud con nuestros asesores.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-5" />

                {/* Condiciones */}
                <div id="condiciones" className="scroll-mt-24">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    Condiciones Generales
                  </h2>
                  <div className="space-y-3 pl-4 border-l-2 border-border/50">
                    <p className="text-sm text-muted-foreground">
                      • Tarifas sujetas a cambios y disponibilidad sin previo aviso.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      • Los precios y cupos se confirman únicamente al realizar el pago del anticipo correspondiente.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      • Aplican penalidades por cancelación según políticas de los operadores turísticos y aerolíneas.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      • Se requiere documentación de identidad vigente y válida para cada destino.
                    </p>
                  </div>
                </div>

                {/* Reservar por WhatsApp CTA (Booking Style) */}
                <div className="mt-12 mb-4 max-w-sm mx-auto">
                  <Button 
                    className="relative inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-white border border-[#1DA851]/20 shadow-[0_4px_20px_0_rgba(29,168,81,0.15)] transition-all duration-300 hover:shadow-[0_8px_25px_rgba(29,168,81,0.25)] hover:-translate-y-1 group overflow-hidden w-full" 
                    onClick={handleWhatsAppRedirect}
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#1DA851]/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#1DA851] relative z-10"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    <span className="relative z-10 font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-ocean-dark to-[#1DA851]">
                      Reservar por WhatsApp
                    </span>
                  </Button>
                </div>
              </>
            )}

            {/* Mobile Price Card Spacer */}
            <div className="h-4 lg:hidden" />
          </div>

          {/* Right Sticky Reservation Flow */}
          {isBookingGallery ? (
            <div className="lg:hidden w-full">
              {cotizadorCard}
            </div>
          ) : (
            cotizadorCard
          )}
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border/50 px-5 py-3 safe-area-bottom">
          <div className="flex items-center justify-between gap-3">
            <div onClick={() => !isGrupal && setSummaryModalOpen(true)} className={!isGrupal ? "cursor-pointer" : ""}>
              <p className="text-lg font-bold text-foreground underline decoration-foreground/30 underline-offset-4 mb-0.5">
                {formatPrice(totalPlanPrice)}
              </p>
              <p className="text-[13px] text-muted-foreground underline decoration-muted-foreground/30 underline-offset-4">
                 {isGrupal ? "Viaje grupal" : (selectedDate ? format(selectedDate, "d MMM", { locale: es }) : "")} · {guests} pax
              </p>
            </div>
            {isGrupal ? (
              <Button
                size="sm"
                className="bg-white border border-[#1DA851]/30 hover:bg-gray-50 text-[#1DA851] rounded-lg h-11 px-6 text-sm font-bold shadow-sm flex items-center gap-1.5"
                onClick={handleWhatsAppRedirect}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                WhatsApp
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-ocean hover:bg-ocean-dark text-white rounded-lg h-11 px-8 text-base font-semibold"
                onClick={() => setSummaryModalOpen(true)}
              >
                Reservar
              </Button>
            )}
          </div>
        </div>

      {/* Share Dialog */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        title={plan.name}
        text={`Mira este plan: ${plan.name} en ${plan.location}`} />

      {/* Summary Modal (Desktop & Mobile) */}
      <Dialog open={summaryModalOpen} onOpenChange={(open) => { setSummaryModalOpen(open); if(!open) setShowWhatsApp(false); }}>
        <DialogContent className="w-full max-w-full sm:max-w-md h-auto p-0 gap-0 flex flex-col bg-background z-[100] bottom-0 sm:top-[50%] sm:bottom-auto sm:-translate-y-[50%] top-auto translate-y-0 border-t sm:border border-border/50 rounded-t-2xl sm:rounded-2xl lg:rounded-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-full sm:data-[state=closed]:slide-out-to-top-0 data-[state=open]:slide-in-from-bottom-full sm:data-[state=open]:slide-in-from-top-[48%]">
          <DialogHeader className="px-5 py-4 border-b border-border/50 bg-background/95 backdrop-blur-sm z-10 text-left flex flex-row items-center justify-between rounded-t-2xl">
            <DialogTitle className="text-xl font-bold">Resumen de tu plan</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-6 flex-1 bg-background pb-10 sm:pb-6 rounded-b-2xl">
             
             <div>
               <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
               <p className="text-sm text-muted-foreground mt-1">{plan.location}</p>
             </div>

             <Separator />

             <div className="flex justify-between items-center">
               <div>
                 <h4 className="font-semibold text-foreground text-sm">Fecha</h4>
                 <p className="text-sm text-muted-foreground">
                   {plan.fixedDeparture
                     ? selectedDeparture
                       ? formatDepartureFull(selectedDeparture.start, selectedDeparture.end)
                       : "Elige una fecha disponible"
                     : selectedDate
                     ? format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })
                     : "Selecciona una fecha"}
                 </p>
               </div>
               <div className="flex gap-2">
                 <Button variant="secondary" size="sm" className="hidden lg:flex rounded-full px-4 h-8 bg-muted text-foreground" onClick={() => {
                   setSummaryModalOpen(false);
                   setTimeout(() => setDatePopoverOpen(true), 150);
                 }}>Cambiar</Button>
                 <Button variant="secondary" size="sm" className="lg:hidden rounded-full px-4 h-8 bg-muted text-foreground" onClick={() => {
                   setSummaryModalOpen(false);
                   setTimeout(() => setMobileCalendarOpen(true), 150);
                 }}>Cambiar</Button>
               </div>
             </div>

             <div className="flex justify-between items-center text-base">
               <span className="font-normal">{formatPrice(currentPrice)} x {guests} persona{guests > 1 ? "s" : ""}</span>
               <span className="font-medium">{formatPrice(totalPlanPrice)}</span>
             </div>
             
             <Separator />

             <div className="flex justify-between items-center font-bold text-lg">
               <span>Total</span>
               <span>{formatPrice(totalPlanPrice)}</span>
             </div>
             
             <div className="flex justify-center mt-6">
               <Button className="relative inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-white border border-[#1DA851]/20 shadow-[0_4px_14px_0_rgba(29,168,81,0.12)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(29,168,81,0.2)] hover:-translate-y-0.5 group overflow-hidden w-full" onClick={() => {
                 setSummaryModalOpen(false);
                 handleWhatsAppRedirect();
               }}>
                 <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#1DA851]/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#1DA851] relative z-10"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                 <span className="relative z-10 font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-ocean-dark to-[#1DA851]">
                   Confirmar y Reservar por WhatsApp
                 </span>
               </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Calendar Modal */}
      <Dialog open={mobileCalendarOpen} onOpenChange={setMobileCalendarOpen}>
        <DialogContent className="w-full max-w-full h-[100dvh] p-0 gap-0 overflow-hidden flex flex-col bg-background z-[100] top-0 translate-y-0 border-0 lg:hidden">
          <DialogHeader className="px-5 py-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-sm z-10 text-left flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold">Selecciona una fecha</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setMobileCalendarOpen(false)}><X className="w-5 h-5"/></Button>
          </DialogHeader>
          <div className="overflow-y-auto p-4 flex-1 pb-32 flex flex-col items-center">
             {plan.fixedDeparture ? (
               <div className="w-full">{departureDatePicker}</div>
             ) : (
               <CalendarUI
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => { if(d) setSelectedDate(d); }}
                  disabled={{ before: today }}
                  locale={es}
                  defaultMonth={selectedDate || today}
                  className="mx-auto" />
             )}
          </div>
          {(!plan.fixedDeparture || hasDepartureDates) && (
            <div className="fixed bottom-0 left-0 right-0 p-4 px-6 border-t border-border/50 bg-background z-20 flex justify-end items-center">
               <Button className="h-11 px-8 font-semibold rounded-xl bg-ocean text-white hover:bg-ocean-dark" onClick={() => {
                 setMobileCalendarOpen(false);
                 setTimeout(() => setSummaryModalOpen(true), 150);
               }}>
                 Continuar
               </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex gap-3 bg-muted/30 rounded-xl p-3 border border-border/40">
      <div className="bg-background rounded-lg p-2 shadow-sm border border-border/20 shrink-0">
        <Icon className="w-5 h-5 text-ocean" />
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}

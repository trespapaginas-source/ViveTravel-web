"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Cabin } from "@/lib/data";
import { fetchCabin } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AvailabilityCalendar } from "@/components/cabins/availability-calendar";
import { useCabinAvailability, expandBookedRanges, buildRangeDisabledAfterFrom, rangeCrossesBooked } from "@/hooks/use-cabin-availability";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@/lib/store";
import { PropertyGallery } from "@/components/shared/property-gallery";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Users,
  BedDouble,
  Bath,
  Check,
  ShieldCheck,
  Clock,
  MessageCircle,
  Sparkles,
  AlertCircle,
  Heart,
  Share2,
  Home,
  Wind,
  Wifi,
  Car,
  Tv,
  UtensilsCrossed,
  Flame,
  Waves,
  TreePalm,
  Eye,
  ShowerHead,
  Sun,
  Coffee,
  Wine,
  Tent,
  Binoculars,
  Sailboat,
  Music,
  Lock,
  Baby,
  PawPrint,
  Cigarette,
  Volume2,
  Shield,
  TreeDeciduous,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { type DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale/es";
import { toast } from "sonner";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { ShareDialog } from "@/components/shared/share-dialog";
import { ExpandableSection } from "@/components/shared/expandable-section";
import { WHATSAPP_NUMBER } from "@/lib/config";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.507.003 10.024-4.512 10.026-10.022.002-2.67-1.038-5.18-2.93-7.076-1.893-1.897-4.405-2.937-7.079-2.939-5.51 0-10.024 4.52-10.027 10.029-.001 1.835.507 3.572 1.47 5.114l-.993 3.626 3.908-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.174.2-.298.3-.496.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.011c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Map amenity keywords to icons
function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  if (lower.includes("piscina") || lower.includes("alberca") || lower.includes("charco") || lower.includes("jacuzzi") || lower.includes("tina")) return Waves;
  if (lower.includes("aire") || lower.includes("ventilador") || lower.includes("clima") || lower.includes("ac")) return Wind;
  if (lower.includes("wifi") || lower.includes("internet") || lower.includes("satelital") || lower.includes("conexi") || lower.includes("red")) return Wifi;
  if (lower.includes("estacionamiento") || lower.includes("parqueo") || lower.includes("parqueadero") || lower.includes("garaje") || lower.includes("carro") || lower.includes("vehículo")) return Car;
  if (lower.includes("tv") || lower.includes("smart") || lower.includes("televis") || lower.includes("pantalla") || lower.includes("netflix") || lower.includes("cable")) return Tv;
  if (lower.includes("cocina") || lower.includes("estufa") || lower.includes("nevera") || lower.includes("licuadora") || lower.includes("vajilla") || lower.includes("horno") || lower.includes("microondas")) return UtensilsCrossed;
  if (lower.includes("parrilla") || lower.includes("bbq") || lower.includes("barbacoa") || lower.includes("asador") || lower.includes("fogata") || lower.includes("chimenea") || lower.includes("fuego") || lower.includes("leña")) return Flame;
  if (lower.includes("hamaca") || lower.includes("chinchorro")) return Tent;
  if (lower.includes("desayuno") || lower.includes("café") || lower.includes("coffee") || lower.includes("cafetera") || lower.includes("té")) return Coffee;
  if (lower.includes("vino") || lower.includes("copa") || lower.includes("cerveza") || lower.includes("trago") || lower.includes("cóctel") || lower.includes("bar")) return Wine;
  if (lower.includes("binoculares") || lower.includes("telescopio") || lower.includes("avistamiento") || lower.includes("aves") || lower.includes("pájaro")) return Binoculars;
  if (lower.includes("kayak") || lower.includes("canoa") || lower.includes("tabla") || lower.includes("bote")) return Sailboat;
  if (lower.includes("ducha") || lower.includes("agua caliente") || lower.includes("terma") || lower.includes("lavamanos") || lower.includes("baño")) return ShowerHead;
  if (lower.includes("solar") || lower.includes("energía") || lower.includes("sol") || lower.includes("fotovoltaico")) return Sun;
  if (lower.includes("seguridad") || lower.includes("cámara") || lower.includes("vigilancia") || lower.includes("alarma")) return Shield;
  if (lower.includes("muelle") || lower.includes("embarcadero") || lower.includes("mar") || lower.includes("playa") || lower.includes("palmera") || lower.includes("orilla")) return TreePalm;
  if (lower.includes("terraza") || lower.includes("balcón") || lower.includes("mirador") || lower.includes("vista") || lower.includes("panorá")) return Eye;
  if (lower.includes("jardín") || lower.includes("bosque") || lower.includes("senderos") || lower.includes("árboles") || lower.includes("naturaleza") || lower.includes("vegetación")) return TreeDeciduous;
  if (lower.includes("toalla") || lower.includes("sábana") || lower.includes("lavadora") || lower.includes("secadora") || lower.includes("ropa")) return ShowerHead;
  if (lower.includes("vela") || lower.includes("romántic") || lower.includes("pareja")) return Heart;
  if (lower.includes("mosquitero") || lower.includes("malla") || lower.includes("toldo") || lower.includes("mosquitos")) return Home;
  if (lower.includes("silla") || lower.includes("sillas") || lower.includes("tumbona") || lower.includes("asiento")) return Sun;
  if (lower.includes("cama") || lower.includes("habitación") || lower.includes("dormitorio") || lower.includes("almohada")) return BedDouble;
  if (lower.includes("música") || lower.includes("parlante") || lower.includes("sonido") || lower.includes("altavoz") || lower.includes("bluetooth")) return Music;
  if (lower.includes("candado") || lower.includes("cerradura") || lower.includes("clave") || lower.includes("caja fuerte")) return Lock;
  return Check;
}

// Map rule keywords to icons
function getRuleIcon(rule: string) {
  const lower = rule.toLowerCase();
  if (lower.includes("fiesta") || lower.includes("evento") || lower.includes("celebración") || lower.includes("reunión")) return Music;
  if (lower.includes("fumar") || lower.includes("cigarrillo") || lower.includes("tabaco") || lower.includes("vape") || lower.includes("humo")) return Cigarette;
  if (lower.includes("mascota") || lower.includes("perro") || lower.includes("gato") || lower.includes("animal")) return PawPrint;
  if (lower.includes("niño") || lower.includes("adulto") || lower.includes("18") || lower.includes("edad") || lower.includes("bebé") || lower.includes("menor")) return Baby;
  if (lower.includes("silencio") || lower.includes("ruido") || lower.includes("música alta") || lower.includes("volumen") || lower.includes("horas de descanso") || lower.includes("parlantes")) return Volume2;
  if (lower.includes("huésped") || lower.includes("máximo") || lower.includes("capacidad") || lower.includes("personas")) return Users;
  if (lower.includes("check-in") || lower.includes("check-out") || lower.includes("llegada") || lower.includes("salida") || lower.includes("horario") || lower.includes("hora")) return Clock;
  if (lower.includes("fauna") || lower.includes("naturaleza") || lower.includes("flora") || lower.includes("plantas") || lower.includes("animales") || lower.includes("medio ambiente") || lower.includes("basura") || lower.includes("reciclar")) return TreeDeciduous;
  if (lower.includes("norma") || lower.includes("complejo") || lower.includes("reglamento") || lower.includes("ley")) return Shield;
  if (lower.includes("material") || lower.includes("cuidar") || lower.includes("instalaciones") || lower.includes("dañar") || lower.includes("propiedad")) return Home;
  return AlertCircle;
}

// Map highlight keywords to icons
function getHighlightIcon(highlight: string) {
  const lower = highlight.toLowerCase();
  if (lower.includes("mar") || lower.includes("frente") || lower.includes("playa") || lower.includes("acceso") || lower.includes("costa")) return Waves;
  if (lower.includes("piscina") || lower.includes("alberca") || lower.includes("jacuzzi") || lower.includes("charco")) return Waves;
  if (lower.includes("sostenible") || lower.includes("eco") || lower.includes("ecológico") || lower.includes("huella") || lower.includes("jardín") || lower.includes("bosque")) return TreeDeciduous;
  if (lower.includes("manglar") || lower.includes("palma") || lower.includes("techo") || lower.includes("auténtic") || lower.includes("costeñ")) return TreePalm;
  if (lower.includes("muelle") || lower.includes("embarcadero") || lower.includes("puerto")) return Sailboat;
  if (lower.includes("ave") || lower.includes("observación") || lower.includes("avistamiento") || lower.includes("pájaro") || lower.includes("fauna")) return Binoculars;
  if (lower.includes("familia") || lower.includes("familiar") || lower.includes("niños") || lower.includes("amigos") || lower.includes("grupo")) return Users;
  if (lower.includes("habitación") || lower.includes("cama") || lower.includes("dormitorio") || lower.includes("alojamiento")) return BedDouble;
  if (lower.includes("juego") || lower.includes("parque") || lower.includes("infantil")) return Baby;
  if (lower.includes("seguridad") || lower.includes("vigilancia") || lower.includes("tranquil") || lower.includes("privad")) return Shield;
  if (lower.includes("jacuzzi") || lower.includes("tina") || lower.includes("spa")) return ShowerHead;
  if (lower.includes("romántic") || lower.includes("bohem") || lower.includes("pareja") || lower.includes("amor")) return Heart;
  if (lower.includes("desayuno") || lower.includes("cena") || lower.includes("comida") || lower.includes("café")) return Coffee;
  if (lower.includes("atardecer") || lower.includes("amanecer") || lower.includes("sol") || lower.includes("vista")) return Sun;
  if (lower.includes("económica") || lower.includes("barato") || lower.includes("precio") || lower.includes("oferta")) return Badge;
  if (lower.includes("caribe") || lower.includes("diseño") || lower.includes("lujo") || lower.includes("premium") || lower.includes("exclusivo")) return Sparkles;
  return Sparkles;
}

function getLocationData(locationStr: string) {
  const lower = locationStr.toLowerCase();

  if (lower.includes("sabana grande")) {
    return {
      text: "Sabana Grande, Atlántico, Colombia",
      query: "Sabana Grande, Atlántico, Colombia",
      description: "Tranquilo corregimiento del Atlántico rodeado de naturaleza, ideal para descansar lejos del ruido de la ciudad y disfrutar de la calidez rural del Caribe colombiano."
    };
  }
  if (lower.includes("santa verónica") || lower.includes("santa veronica")) {
    return {
      text: "Santa Verónica, Atlántico, Colombia",
      query: "Santa Verónica, Atlántico, Colombia",
      description: "Barrio costero tranquilo con hermosas playas, ideal para practicar deportes acuáticos como el kitesurf y disfrutar de la gastronomía local frente al mar."
    };
  }
  if (lower.includes("juan de acosta")) {
    return {
      text: "Juan de Acosta, Atlántico, Colombia",
      query: "Juan de Acosta, Atlántico, Colombia",
      description: "Zona tranquila y acogedora cerca del mar, perfecta para desconectar de la ciudad y conectar con la naturaleza y la brisa del Caribe."
    };
  }
  if (lower.includes("tubará") || lower.includes("tubara")) {
    return {
      text: "Tubará, Atlántico, Colombia",
      query: "Tubará, Atlántico, Colombia",
      description: "Lugar privilegiado rodeado de naturaleza y playas semi-privadas. Disfruta de un ambiente relajante con espectaculares atardeceres."
    };
  }
  if (lower.includes("cartagena")) {
    return {
      text: "Cartagena, Bolívar, Colombia",
      query: "Cartagena, Bolívar, Colombia",
      description: "A pocos minutos del centro histórico, disfruta de la magia caribeña, playas vibrantes y una exquisita oferta cultural y gastronómica."
    };
  }
  if (lower.includes("barú") || lower.includes("baru")) {
    return {
      text: "Isla Barú, Bolívar, Colombia",
      query: "Playa Blanca, Barú, Bolívar, Colombia",
      description: "Un paraíso tropical de arenas blancas y aguas cristalinas. Ideal para una escapada romántica o vacaciones en familia lejos del ruido."
    };
  }
  if (lower.includes("puerto colombia")) {
    return {
      text: "Puerto Colombia, Atlántico, Colombia",
      query: "Puerto Colombia, Atlántico, Colombia",
      description: "Municipio histórico con su emblemático muelle, hermosas playas y un ambiente bohemio que te invita a relajarte frente al mar Caribe."
    };
  }
  
  // Fallback
  return {
    text: `${locationStr}, Colombia`,
    query: `${locationStr}, Colombia`,
    description: "Zona tranquila y bien ubicada, ideal para disfrutar de tus vacaciones con acceso fácil a puntos de interés y atracciones locales."
  };
}

export function CabinDetail({ cabinId }: { cabinId?: string } = {}) {
  const { selectedItemId: storeSelectedItemId, navigate, searchDate, searchDateEnd, searchRoomsDetail, setFavoritesPulseActive } = useNavigation();
  const selectedItemId = cabinId || storeSelectedItemId;

  const { data: cabin, isLoading, isFetching } = useQuery({
    queryKey: ["cabin", selectedItemId],
    queryFn: () => fetchCabin(selectedItemId!),
    enabled: !!selectedItemId,
  });

  const { data: availabilityData } = useCabinAvailability(selectedItemId);
  const bookedDates = useMemo(
    () => (availabilityData?.booked ? expandBookedRanges(availabilityData.booked) : []),
    [availabilityData?.booked]
  );

  const [isFav, setIsFav] = useState(() =>
    typeof window !== "undefined" && selectedItemId
      ? isFavorite(selectedItemId)
      : false
  );

  const isMobile = useIsMobile();
  const [shareOpen, setShareOpen] = useState(false);
  const [roomsModalOpen, setRoomsModalOpen] = useState(false);

  // Mobile reservation flow states
  const [mobileBottomSheetOpen, setMobileBottomSheetOpen] = useState(false);
  const [mobileCalendarModalOpen, setMobileCalendarModalOpen] = useState(false);
  const [mobileGuests, setMobileGuests] = useState(1);
  const [pulseReserveButton, setPulseReserveButton] = useState(false);
  const [mobileDateRange, setMobileDateRange] = useState<DateRange | undefined>(() => {
    if (searchDate && searchDateEnd) {
      const from = new Date(searchDate + "T12:00:00");
      const to = new Date(searchDateEnd + "T12:00:00");
      if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
        return { from, to };
      }
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7 || 7));
    const nextSunday = new Date(nextSaturday);
    nextSunday.setDate(nextSaturday.getDate() + 1);
    return { from: nextSaturday, to: nextSunday };
  });

  const mobileNightCount = mobileDateRange?.from && mobileDateRange?.to
    ? differenceInDays(mobileDateRange.to, mobileDateRange.from)
    : 0;
  const mobileSubtotal = mobileNightCount * (cabin?.pricePerNight || 0);
  const mobileTotal = mobileSubtotal; // Simplified according to request

  let mobileDateSummaryText = "Selecciona fechas";
  if (mobileDateRange?.from && mobileDateRange?.to) {
    const from = mobileDateRange.from;
    const to = mobileDateRange.to;
    if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
      mobileDateSummaryText = `Por ${mobileNightCount} noches · ${from.getDate()} – ${format(to, "d 'de' MMMM", { locale: es })}`;
    } else {
      mobileDateSummaryText = `Por ${mobileNightCount} noches · ${format(from, "d 'de' MMM", { locale: es })} – ${format(to, "d 'de' MMM", { locale: es })}`;
    }
  }

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
    if (!cabin) return;
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const text = `Mira esta hermosa cabaña en Vive Travel: ${cabin.name}\n${currentUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  }, [cabin]);

  // Tracks whether the previous selection was a half-range (only `from`),
  // so we can detect the moment a range is completed in the inline calendar
  // and pulse the sticky "Reservar" button to draw the user's attention.
  const prevRangeCompleteRef = useRef(true);

  const triggerReservePulse = useCallback(() => {
    setPulseReserveButton(true);
    const t = setTimeout(() => setPulseReserveButton(false), 1600);
    return () => clearTimeout(t);
  }, []);

  const handleInlineCalendarSelect = useCallback(
    (range: DateRange | undefined) => {
      const nowComplete = !!(range?.from && range?.to);
      setMobileDateRange(range);
      // Pulse only on the transition from incomplete → complete.
      if (nowComplete && !prevRangeCompleteRef.current) {
        triggerReservePulse();
        // Subtle nudge: scroll the sticky CTA into view so the pulse is visible.
        const sticky = document.querySelector('[data-mobile-reserve-cta]');
        if (sticky) (sticky as HTMLElement).scrollIntoView({ behavior: "smooth", block: "end" });
      }
      prevRangeCompleteRef.current = nowComplete;
    },
    [triggerReservePulse]
  );

  // Deterministic, defensive selection for the modal calendar — mirrors the
  // inline calendar's handler. The contiguity rule is absolute: a range is only
  // accepted when no booked day lies strictly between from and to. We ignore
  // react-day-picker's computed `next` and decide from the clicked day.
  const handleModalCalendarSelect = useCallback(
    (_next: DateRange | undefined, selectedDay?: Date) => {
      if (!selectedDay) {
        setMobileDateRange(_next);
        return;
      }
      const clicked = new Date(selectedDay);
      clicked.setHours(0, 0, 0, 0);

      const current = mobileDateRange;
      const hasFrom = !!current?.from;
      const hasTo = !!current?.to;

      // No selection yet, or a complete range exists → start fresh.
      if (!hasFrom || (hasFrom && hasTo)) {
        setMobileDateRange({ from: clicked, to: undefined });
        return;
      }

      const from = new Date(current!.from!);
      from.setHours(0, 0, 0, 0);

      if (clicked.getTime() === from.getTime()) {
        setMobileDateRange(undefined);
        return;
      }
      if (clicked.getTime() < from.getTime()) {
        setMobileDateRange({ from: clicked, to: undefined });
        return;
      }
      // Would-be checkout: reject if it crosses any booked night.
      if (rangeCrossesBooked(from, clicked, bookedDates)) {
        setMobileDateRange({ from, to: undefined });
        return;
      }
      setMobileDateRange({ from, to: clicked });
    },
    [mobileDateRange, bookedDates]
  );

  const handleWhatsAppReservation = useCallback(() => {
    if (!cabin || !mobileDateRange?.from || !mobileDateRange?.to) return;
    const checkInStr = format(mobileDateRange.from, "d 'de' MMMM yyyy", { locale: es });
    const checkOutStr = format(mobileDateRange.to, "d 'de' MMMM yyyy", { locale: es });
    const totalStr = formatPrice(mobileTotal);
    
    let roomsBreakdown = "";
    if (searchRoomsDetail) {
      try {
        const roomsObj = JSON.parse(searchRoomsDetail);
        if (Array.isArray(roomsObj)) {
          roomsBreakdown = roomsObj.map((r, i) => `Hab ${i+1}: ${r.adults} ad, ${r.children} ch`).join(" | ");
        }
      } catch (e) {
        console.error(e);
      }
    }

    const message = [
      `🏡 *COTIZACIÓN DE CABAÑA - VIVE TRAVEL*`,
      ``,
      `🏡 *Alojamiento:* ${cabin.name}`,
      `📍 *Ubicación:* ${cabin.location}`,
      `📅 *Check-in:* ${checkInStr}`,
      `📅 *Check-out:* ${checkOutStr}`,
      `👥 *Huéspedes:* ${mobileGuests} persona${mobileGuests > 1 ? "s" : ""} (máx. ${cabin.capacity})`,
      roomsBreakdown ? `🏨 *Habitaciones:* ${roomsBreakdown}` : "",
      `🌙 *Estadía:* ${mobileNightCount} noche${mobileNightCount > 1 ? "s" : ""}`,
      `💵 *Total estimado:* ${totalStr}`,
      ``,
      `Hola, me interesa reservar esta cabaña en las fechas indicadas. ¿Podrían confirmarme la disponibilidad y pasos a seguir?`
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  }, [cabin, mobileDateRange, mobileNightCount, mobileTotal, mobileGuests, searchRoomsDetail]);

  if (isLoading || isFetching || !selectedItemId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-ocean border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!cabin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-lg">
            Cabaña no encontrada
          </p>
          <Button
            onClick={() => navigate("cabins")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a cabañas
          </Button>
        </div>
      </div>
    );
  }

  const locationData = getLocationData(cabin.location || "Santa Verónica, Atlántico");

  const displayRooms = (() => {
    if (cabin?.bedroomDetails && cabin.bedroomDetails.length > 0) {
      return cabin.bedroomDetails
        .filter((b) => b.active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    if (!cabin) return [];

    const rooms: any[] = [];
    const numRooms = Math.max(1, cabin.bedrooms || 1);
    const capacity = cabin.capacity || 2;
    
    for (let i = 0; i < numRooms; i++) {
      const roomCapacity = Math.floor(capacity / numRooms) + (i < (capacity % numRooms) ? 1 : 0);
      
      let beds = "1 cama doble";
      if (roomCapacity === 1) beds = "1 cama individual";
      else if (roomCapacity === 2) beds = "1 cama doble";
      else if (roomCapacity === 3) beds = "1 cama doble, 1 cama individual";
      else if (roomCapacity === 4) beds = "1 cama doble, 1 litera";
      else if (roomCapacity >= 5) beds = `1 cama doble, ${roomCapacity - 2} camas individuales`;

      const imgIndex = (i + 1) % (cabin.images?.length || 1);
      const image = cabin.images?.[imgIndex] || cabin.images?.[0] || "";

      rooms.push({
        id: `room-${i}`,
        title: `Habitación ${i + 1}`,
        beds,
        image,
      });
    }
    return rooms;
  })();

  return (
    <div className="pb-28 lg:pb-16">
      {/* Back Button (Desktop) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 pt-20 sm:pt-24">
        <Button
          variant="ghost"
          onClick={() => navigate("cabins")}
          className="hidden md:flex gap-2 text-muted-foreground hover:text-ocean -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a cabañas
        </Button>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Mobile Floating Actions */}
          <div className="md:hidden absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            {/* Back */}
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-border/20 shadow-md pointer-events-auto hover:bg-white"
              onClick={() => navigate("cabins")}
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

          <PropertyGallery
            images={cabin.images}
            title={cabin.name}
            variant="cabin" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - Details */}
          <div className="flex-1 min-w-0">
            {/* Title, Location, Actions */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {cabin.name}
                  </h1>
                  <div className="flex items-center gap-1.5 text-muted-foreground mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm">{cabin.location}</span>
                  </div>
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

            {/* Key Stats Row */}
            <div className="grid grid-cols-2 md:flex md:items-center gap-y-3 gap-x-6 md:gap-8 flex-wrap py-2">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-foreground shrink-0" strokeWidth={1.5} />
                <span className="text-base text-foreground font-normal hidden md:inline">{cabin.capacity} huéspedes</span>
                <span className="text-sm text-foreground font-normal md:hidden">{cabin.capacity} PAX</span>
              </div>
              <div className="hidden md:block w-px h-5 bg-border/40" />
              <div className="flex items-center gap-3">
                <BedDouble className="w-5 h-5 text-foreground shrink-0" strokeWidth={1.5} />
                <span className="text-base text-foreground font-normal hidden md:inline">{cabin.bedrooms} habitación{cabin.bedrooms > 1 ? "es" : ""}</span>
                <span className="text-sm text-foreground font-normal md:hidden">{cabin.bedrooms} HAB.</span>
              </div>
              <div className="hidden md:block w-px h-5 bg-border/40" />
              <div className="flex items-center gap-3">
                <Bath className="w-5 h-5 text-foreground shrink-0" strokeWidth={1.5} />
                <span className="text-base text-foreground font-normal hidden md:inline">{cabin.bathrooms} baño{cabin.bathrooms > 1 ? "s" : ""}</span>
                <span className="text-sm text-foreground font-normal md:hidden">{cabin.bathrooms} BAÑOS</span>
              </div>
              <div className="hidden md:block w-px h-5 bg-border/40" />
              <div className="flex items-center gap-3">
                <Waves className="w-5 h-5 text-foreground shrink-0" strokeWidth={1.5} />
                <span className="text-base text-foreground font-normal hidden md:inline">Piscina</span>
                <span className="text-sm text-foreground font-normal md:hidden">Piscina</span>
              </div>
            </div>

            <Separator className="my-5" />

            {/* Full Description */}
            <div>
              <h2 className="text-2xl md:text-[28px] font-bold tracking-tight text-foreground mb-4">
                Acerca de esta cabaña
              </h2>
              <ExpandableSection>
                <p className="text-foreground leading-relaxed text-base font-normal">
                  {cabin.fullDescription}
                </p>
              </ExpandableSection>
            </div>

            <Separator className="my-6" />

            {/* Availability calendar (real-time, from ICS feed) */}
            <AvailabilityCalendar
              cabinId={cabin.id}
              cabinName={cabin.name}
              selectedRange={isMobile ? mobileDateRange : undefined}
              onSelectRange={isMobile ? handleInlineCalendarSelect : undefined}
            />

            <Separator className="my-6" />

            {/* ¿Dónde vas a dormir? */}
            {displayRooms.length > 0 && (
              <>
                <div>
                  <h2 className="text-2xl md:text-[28px] font-bold tracking-tight text-foreground mb-4">
                    ¿Dónde vas a dormir?
                  </h2>
                  <div className="flex overflow-x-auto gap-4 pb-4 overscroll-behavior-x-contain snap-x snap-mandatory hide-scrollbar">
                    {displayRooms.map((bedroom: any) => (
                      <div 
                        key={bedroom.id} 
                        className="w-[160px] flex-none group cursor-pointer overflow-hidden overflow-x-hidden snap-start"
                        onClick={() => setRoomsModalOpen(true)}
                      >
                        <div className="w-full h-[110px] rounded-xl overflow-hidden mb-2 relative">
                          <img 
                            src={bedroom.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"} 
                            alt={bedroom.title} 
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                           onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
                        </div>
                        <h3 className="font-medium text-sm text-foreground">{bedroom.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{bedroom.beds}</p>
                      </div>
                    ))}
                  </div>

                </div>
                <Separator className="my-6" />
              </>
            )}

            {/* Highlights */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ocean/60" />
                Puntos destacados
              </h2>
              <ExpandableSection itemCount={cabin.highlights.length} maxHeight={290}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {cabin.highlights.map((highlight, i) => {
                    const text = (highlight as any).text || highlight;
                    const HIcon = getHighlightIcon(text);
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-muted/40 transition-colors duration-150"
                      >
                        <HIcon className="w-4 h-4 text-ocean/50 shrink-0" />
                        <span className="text-sm text-foreground">
                          {text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </ExpandableSection>
            </div>

            <Separator className="my-5" />

            {/* Amenities */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3.5 flex items-center gap-2">
                <Home className="w-4 h-4 text-ocean/60" />
                Comodidades
              </h2>
              <ExpandableSection itemCount={cabin.amenities.length} maxHeight={200}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {cabin.amenities.map((amenity, i) => {
                    const text = (amenity as any).text || amenity;
                    const AIcon = getAmenityIcon(text);
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 py-1.5 px-1"
                      >
                        <AIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-sm text-foreground">{text}</span>
                      </div>
                    );
                  })}
                </div>
              </ExpandableSection>
            </div>

            <Separator className="my-5" />

            {/* Rules */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-ocean/60" />
                Reglas de la cabaña
              </h2>
              <ExpandableSection itemCount={cabin.rules.length} maxHeight={230}>
                <div className="space-y-2">
                  {cabin.rules.map((rule, i) => {
                    const text = (rule as any).text || rule;
                    const RIcon = getRuleIcon(text);
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 py-1.5"
                      >
                        <RIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{text}</span>
                      </div>
                    );
                  })}
                </div>
              </ExpandableSection>
            </div>

            <Separator className="my-5" />

            {/* Location Map */}
            <div>
              <h2 className="text-2xl md:text-[28px] font-bold tracking-tight text-foreground mb-4">
                A dónde irás
              </h2>
              <p className="text-sm text-foreground mb-4">
                {locationData.text}
              </p>
              <div className="w-full h-[250px] sm:h-[300px] rounded-2xl overflow-hidden mb-4 relative bg-muted border border-border/50">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(locationData.query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`} />
              </div>
              {cabin.mapsUrl && (
                <a
                  href={cabin.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ocean hover:text-ocean-dark transition-colors mb-4"
                >
                  <Navigation className="w-4 h-4" />
                  Ver ubicación exacta en Google Maps
                </a>
              )}
              <div>
                <h3 className="font-semibold text-foreground text-base mb-1.5">
                  Aspectos destacados del vecindario
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {locationData.description}
                </p>
              </div>
            </div>





          </div>

          {/* Right Column - Sticky Price Card (Desktop) */}
          {!isMobile && (
            <div className="hidden lg:block w-[380px] shrink-0">
              <div className="sticky top-28">
                <PriceCard cabin={cabin} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <div data-mobile-reserve-cta className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border/50 px-5 py-3">
        <div className="flex items-center justify-between gap-3">
          <div onClick={() => setMobileBottomSheetOpen(true)} className="cursor-pointer">
            <p className="text-lg font-bold text-foreground underline decoration-foreground/30 underline-offset-4 mb-0.5">
              {formatPrice(mobileTotal)}
            </p>
            <p className="text-[13px] text-muted-foreground underline decoration-muted-foreground/30 underline-offset-4">
               {mobileDateSummaryText} · {mobileGuests} huésped{mobileGuests > 1 ? "es" : ""}
            </p>
          </div>
          <Button
            size="sm"
            className={cn(
              "bg-ocean hover:bg-ocean-dark text-white rounded-lg h-11 px-8 text-base font-semibold shadow-md",
              pulseReserveButton && "reserve-pulse"
            )}
            onClick={() => setMobileBottomSheetOpen(true)}
          >
            Reservar
          </Button>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        title={cabin.name}
        text={`Mira esta cabaña: ${cabin.name} en ${cabin.location}`} />

      {/* Rooms Modal */}
      <Dialog open={roomsModalOpen} onOpenChange={setRoomsModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-full max-w-full h-[100dvh] sm:h-[85vh] sm:max-w-2xl sm:rounded-2xl p-0 gap-0 overflow-hidden flex flex-col bg-background z-[100] top-0 translate-y-0 sm:top-[50%] sm:-translate-y-[50%] sm:border border-0">
          <DialogHeader className="px-5 py-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-sm z-10 text-left flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold">¿Dónde vas a dormir?</DialogTitle>
            <button
              onClick={() => setRoomsModalOpen(false)}
              aria-label="Cerrar"
              className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground -mr-2 flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </DialogHeader>
          <div className="overflow-y-auto p-5 sm:p-6 space-y-8 flex-1 pb-10">
            {displayRooms.map((room: any) => {
              const roomImages: string[] = room.images && room.images.length > 0 ? room.images : [room.image];
              return (
                <div key={room.id} className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{room.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground mt-0.5">{room.beds}</p>
                  </div>
                  <div className="flex overflow-x-auto gap-3 pb-2 snap-x snap-mandatory hide-scrollbar">
                    {roomImages.map((imgUrl: string, idx: number) => (
                      <div
                        key={idx}
                        className="w-[240px] sm:w-[320px] aspect-[4/3] rounded-xl overflow-hidden relative border border-border/30 shadow-sm shrink-0 snap-start"
                      >
                        <img
                          src={imgUrl}
                          alt={`${room.title} - Foto ${idx + 1}`}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80";
                            e.currentTarget.onerror = null;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Bottom Sheet (Price Details) */}
      <Dialog open={mobileBottomSheetOpen} onOpenChange={setMobileBottomSheetOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-full max-w-full h-auto p-0 gap-0 flex flex-col bg-background z-[100] bottom-0 top-auto translate-y-0 border-t border-border/50 rounded-t-2xl rounded-b-none lg:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full">
          <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto my-3 flex-shrink-0" />
          <DialogHeader className="px-5 py-2 border-b border-border/50 bg-background/95 backdrop-blur-sm z-10 text-left flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold">Detalles del precio</DialogTitle>
            <button
              onClick={() => setMobileBottomSheetOpen(false)}
              aria-label="Cerrar"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
          <div className="p-6 space-y-6 flex-1 bg-background pb-10">
             <div className="flex justify-between items-center text-base">
               <span className="font-normal">{formatPrice(cabin.pricePerNight)} x {mobileNightCount} noches</span>
               <span className="font-medium">{formatPrice(mobileTotal)}</span>
             </div>
             
             <Separator />
             
             <div className="flex justify-between items-center">
               <div>
                 <h4 className="font-semibold text-foreground text-sm">Fechas</h4>
                 <p className="text-sm text-muted-foreground">
                   {mobileDateRange?.from && mobileDateRange?.to
                  ? `${format(mobileDateRange.from, "d -", { locale: es })} ${format(mobileDateRange.to, "d 'de' MMM", { locale: es })}`
                  : "Selecciona fechas"}
                 </p>
               </div>
               <Button variant="secondary" size="sm" className="rounded-full px-4 h-8 bg-muted text-foreground" onClick={() => {
                 setMobileBottomSheetOpen(false);
                 setTimeout(() => setMobileCalendarModalOpen(true), 150);
               }}>Cambia</Button>
             </div>

             <Separator />

             <div className="flex justify-between items-center">
               <div>
                 <h4 className="font-semibold text-foreground text-sm">Huéspedes</h4>
                 <p className="text-sm text-muted-foreground">
                   {mobileGuests} persona{mobileGuests > 1 ? "s" : ""} · máx. {cabin.capacity}
                 </p>
               </div>
               <div className="flex items-center gap-3">
                 <Button
                   variant="outline"
                   size="icon"
                   className="h-8 w-8 rounded-full shrink-0"
                   onClick={() => setMobileGuests((g) => Math.max(1, g - 1))}
                   disabled={mobileGuests <= 1}
                   aria-label="Reducir huéspedes"
                 >
                   <Minus className="w-4 h-4" />
                 </Button>
                 <span className="w-5 text-center text-sm font-semibold text-foreground tabular-nums">
                   {mobileGuests}
                 </span>
                 <Button
                   variant="outline"
                   size="icon"
                   className="h-8 w-8 rounded-full shrink-0"
                   onClick={() => setMobileGuests((g) => Math.min(cabin.capacity, g + 1))}
                   disabled={mobileGuests >= cabin.capacity}
                   aria-label="Aumentar huéspedes"
                 >
                   <Plus className="w-4 h-4" />
                 </Button>
               </div>
             </div>

             <Separator />

              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total estimado</span>
                <span>{formatPrice(mobileTotal)}</span>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button className="relative inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-white border border-[#1DA851]/20 shadow-[0_4px_14px_0_rgba(29,168,81,0.12)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(29,168,81,0.2)] hover:-translate-y-0.5 group overflow-hidden w-full" onClick={() => {
                  setMobileBottomSheetOpen(false);
                  handleWhatsAppReservation();
                }}>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#1DA851]/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#1DA851] relative z-10"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  <span className="relative z-10 font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-ocean-dark to-[#1DA851]">
                    Reservar por WhatsApp
                  </span>
                </Button>
              </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Calendar Modal (Bottom Sheet - Occupies bottom ~50-60% of screen) */}
      <Dialog open={mobileCalendarModalOpen} onOpenChange={setMobileCalendarModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-full max-w-full h-auto max-h-[80vh] p-0 gap-0 overflow-hidden flex flex-col bg-background z-[100] bottom-0 top-auto translate-y-0 border-t border-border/50 rounded-t-3xl rounded-b-none lg:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full">
          {/* Drag indicator handle */}
          <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto my-2.5 flex-shrink-0" />

          <DialogHeader className="px-5 py-2.5 border-b border-border/50 bg-background/95 backdrop-blur-sm z-10 text-left flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-bold">Selecciona tus fechas</DialogTitle>
            <button
              onClick={() => setMobileCalendarModalOpen(false)}
              aria-label="Cerrar modal de fechas"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground -mr-1 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
          
          <div className="p-3 flex-1 overflow-y-auto flex flex-col items-center justify-center mobile-airbnb-calendar">
             <Calendar
                initialFocus
                mode="range"
                defaultMonth={mobileDateRange?.from ?? new Date()}
                selected={mobileDateRange}
                onSelect={handleModalCalendarSelect}
                numberOfMonths={1}
                locale={es}
                showOutsideDays={false}
                disabled={[
                  { before: new Date() },
                  ...(bookedDates.length > 0 ? bookedDates : []),
                  ...(mobileDateRange?.from && !mobileDateRange?.to
                    ? buildRangeDisabledAfterFrom(mobileDateRange.from, bookedDates)
                    : []),
                ]}
                modifiers={{ booked: bookedDates }}
                modifiersStyles={{
                  booked: { textDecoration: "line-through", color: "#9CA3AF", opacity: 0.55 },
                }}
                className="mx-auto w-full max-w-[340px]" />
          </div>

          <div className="p-4 px-6 border-t border-border/50 bg-background z-20 flex justify-between items-center shrink-0">
             <Button variant="link" className="px-0 underline text-foreground text-sm" onClick={() => setMobileDateRange(undefined)}>Borrar fechas</Button>
             <Button className="h-10 px-7 font-semibold rounded-xl bg-ocean text-white hover:bg-ocean-dark text-sm" onClick={() => {
               setMobileCalendarModalOpen(false);
               setTimeout(() => setMobileBottomSheetOpen(true), 150);
             }}>
               Guardar
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PriceCard({ cabin }: { cabin: Cabin }) {
  const { navigate } = useNavigation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [guests, setGuests] = useState(1);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  const { data: availabilityData } = useCabinAvailability(cabin.id);
  const bookedDates = useMemo(
    () => (availabilityData?.booked ? expandBookedRanges(availabilityData.booked) : []),
    [availabilityData?.booked]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nightCount =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from)
      : 0;

  const subtotal = nightCount * cabin.pricePerNight;
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee;

  const formatDateShort = (date: Date) => {
    return format(date, "d 'de' MMM", { locale: es });
  };

  return (
    <Card className="border-border/50 shadow-xl py-0 gap-0">
      <CardContent className="p-6 space-y-5">
        {/* Price */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(cabin.pricePerNight)}
            </span>
            <span className="text-sm text-muted-foreground">/ noche</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Rango: {cabin.priceRange}
          </p>
        </div>

        <Separator />

        {/* Date Selector & Guest Selector */}
        <div className="space-y-3">
          {/* Date Range Picker */}
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <button
                className="w-full grid grid-cols-2 gap-0 rounded-xl border border-border overflow-hidden text-left hover:border-ocean/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean/30"
                aria-label="Seleccionar fechas"
              >
                <div className="p-3 border-r border-border">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Check-in
                  </label>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {dateRange?.from
                      ? formatDateShort(dateRange.from)
                      : "Seleccionar fecha"}
                  </p>
                </div>
                <div className="p-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Check-out
                  </label>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {dateRange?.to
                      ? formatDateShort(dateRange.to)
                      : "Seleccionar fecha"}
                  </p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
              sideOffset={8}
            >
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  if (range?.to) {
                    setDatePopoverOpen(false);
                  }
                }}
                disabled={[
                  { before: today },
                  ...(bookedDates.length > 0 ? bookedDates : []),
                ]}
                modifiers={{ booked: bookedDates }}
                modifiersStyles={{
                  booked: { textDecoration: "line-through", color: "#9CA3AF", opacity: 0.55 },
                }}
                numberOfMonths={1}
                locale={es}
                defaultMonth={today} />
            </PopoverContent>
          </Popover>

          {/* Guest Selector */}
          <Popover open={guestPopoverOpen} onOpenChange={setGuestPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                className="w-full rounded-xl border border-border p-3 text-left hover:border-ocean/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean/30"
                aria-label="Seleccionar huéspedes"
              >
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Huéspedes
                </label>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {guests} huésped{guests > 1 ? "es" : ""} (máx. {cabin.capacity})
                </p>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 p-4"
              align="start"
              sideOffset={8}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Huéspedes</p>
                  <p className="text-xs text-muted-foreground">
                    Máximo {cabin.capacity}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    disabled={guests <= 1}
                    aria-label="Reducir huéspedes"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-6 text-center text-sm font-semibold text-foreground">
                    {guests}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setGuests((g) => Math.min(cabin.capacity, g + 1))}
                    disabled={guests >= cabin.capacity}
                    aria-label="Aumentar huéspedes"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Reserve Button */}
        {!showWhatsApp ? (
          <Button
            className="w-full bg-ocean hover:bg-ocean-dark text-white rounded-xl h-12 text-base font-semibold"
            onClick={() => setShowWhatsApp(true)}
          >
            Reservar
          </Button>
        ) : (
          <div className="flex justify-center w-full">
            <Button
              className="relative inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-white border border-[#1DA851]/20 shadow-[0_4px_14px_0_rgba(29,168,81,0.12)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(29,168,81,0.2)] hover:-translate-y-0.5 group overflow-hidden"
              onClick={() => navigate("contact")}
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#1DA851]/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#1DA851] relative z-10"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              <span className="relative z-10 font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-ocean-dark to-[#1DA851]">
                Reservar por WhatsApp
              </span>
            </Button>
          </div>
        )}

        {/* WhatsApp Button */}
        <Button
          asChild
          variant="outline"
          className="w-full rounded-xl h-11 border-leaf/30 text-leaf hover:bg-leaf/5 gap-2"
        >
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              `Hola, me interesa la ${cabin.name} en ${cabin.location}. ¿Podrían darme más información?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-4 h-4" />
            Preguntar por WhatsApp
          </a>
        </Button>

        {/* Dynamic Price Breakdown */}
        <div className="space-y-2 pt-2">
          {nightCount > 0 ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground underline decoration-dotted underline-offset-2">
                  {formatPrice(cabin.pricePerNight)} x {nightCount} noche{nightCount > 1 ? "s" : ""}
                </span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground underline decoration-dotted underline-offset-2">
                  Tarifa de servicio
                </span>
                <span className="text-foreground">{formatPrice(serviceFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-bold">
                <span>Total estimado</span>
                <span>{formatPrice(total)}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground underline decoration-dotted underline-offset-2">
                  {formatPrice(cabin.pricePerNight)} x -- noches
                </span>
                <span className="text-muted-foreground">--</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground underline decoration-dotted underline-offset-2">
                  Tarifa de servicio
                </span>
                <span className="text-muted-foreground">--</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-bold">
                <span>Total estimado</span>
                <span className="text-muted-foreground">--</span>
              </div>
            </>
          )}
        </div>

        <p className="text-[11px] text-center text-muted-foreground">
          No se hará ningún cargo por el momento
        </p>
      </CardContent>
    </Card>
  );
}

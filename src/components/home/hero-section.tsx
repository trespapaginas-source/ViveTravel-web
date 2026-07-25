import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { MapPin, Calendar as CalendarIcon, Users, ChevronDown, Sparkles, Compass, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { useNavigation } from "@/lib/store";
import { heroImages as fallbackHero } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { fetchHeroImages, fetchPlans, fetchCabins } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format, addDays, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { getPlanExperienceSection } from "@/lib/experience-sections";
import { detectUserCity } from "@/lib/geolocation";
import { useDragScroll } from "@/lib/use-drag-scroll";

type SearchTab = "internacionales" | "nacionales" | "circuitos" | "pasadias" | "grupales" | "alojamientos" | "tours";

type RoomDetail = {
  adults: number;
  children: number;
};

type TabParams = {
  origen?: string;
  destino: string;
  fecha: string;
  fechaFin?: string;
  rooms?: RoomDetail[];
  adultos: number; // For simpler tabs
  ninos: number; // For simpler tabs
  actividad?: string;
  tipoViajero?: string;
};

// Autocomplete suggestions list - strictly main cities, NO sublocations.
const CITIES = [
  "Cartagena",
  "Santa Marta",
  "San Andrés Islas",
  "Barranquilla",
  "Eje Cafetero",
  "Cancún",
  "Punta Cana",
];

const POPULAR_DESTINATIONS: Record<Exclude<SearchTab, "grupales">, { featured: string[]; optional: string[] }> = {
  internacionales: {
    featured: ["Punta Cana", "Cancún", "Panamá", "Brasil", "Curazao"],
    optional: ["Aruba", "Miami", "Orlando", "Madrid", "París"],
  },
  nacionales: {
    featured: ["San Andrés", "Cartagena", "Eje Cafetero", "Santa Marta", "Medellín"],
    optional: ["Guatapé", "Barichara", "Caño Cristales", "Amazonas", "Nuquí"],
  },
  circuitos: {
    featured: ["Eurotrip Clásico", "España y Portugal", "Italia Completa", "Japón Esencial", "Turquía y Dubái"],
    optional: ["Egipto y Turquía", "Grecia e Islas Griegas", "Sudeste Asiático", "Reino Unido e Irlanda", "Escandinavia"],
  },
  pasadias: {
    featured: ["Playa Blanca", "Barú", "Islas del Rosario", "Santa Verónica", "Minca"],
    optional: ["Tayrona", "Luruaco", "Sabanilla", "Puerto Colombia", "Cabo de la Vela"],
  },
  alojamientos: {
    featured: ["Santa Verónica", "Puerto Colombia", "Minca", "Tayrona", "Barú"],
    optional: ["Palomino", "Coveñas", "San Andrés", "Cartagena", "Eje Cafetero"],
  },
  tours: {
    featured: ["Paracaidismo", "Buceo", "Tour del Café", "Parque Tayrona", "Ciudad Perdida"],
    optional: ["Snorkel en Barú", "Kayak en Mallorquín", "Tour Histórico", "Cabalgata", "Kitesurf"],
  },
};

export function HeroSection() {
  const { navigateWithSearch } = useNavigation();
  const [activeTab, setActiveTab] = useState<SearchTab>("internacionales");
  const tabsDragScroll = useDragScroll<HTMLDivElement>();

  // Initial parameters state
  const [tabParams, setTabParams] = useState<Record<SearchTab, TabParams>>({
    internacionales: { origen: "", destino: "", fecha: "", fechaFin: "", rooms: [{ adults: 2, children: 0 }], adultos: 2, ninos: 0 },
    nacionales: { origen: "", destino: "", fecha: "", fechaFin: "", rooms: [{ adults: 2, children: 0 }], adultos: 2, ninos: 0 },
    circuitos: { origen: "", destino: "", fecha: "", fechaFin: "", rooms: [{ adults: 2, children: 0 }], adultos: 2, ninos: 0 },
    pasadias: { destino: "", fecha: "", adultos: 2, ninos: 0 },
    grupales: { destino: "", fecha: "", adultos: 2, ninos: 0, tipoViajero: "" },
    alojamientos: { destino: "", fecha: "", fechaFin: "", rooms: [{ adults: 2, children: 0 }], adultos: 2, ninos: 0 },
    tours: { destino: "", actividad: "", fecha: "", adultos: 2, ninos: 0 },
  });

  const activeParams = tabParams[activeTab];

  const updateParam = <K extends keyof TabParams>(key: K, value: TabParams[K]) => {
    setTabParams((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [key]: value,
      },
    }));
  };

  const updateRooms = (newRooms: RoomDetail[]) => {
    const totalAdults = newRooms.reduce((acc, r) => acc + r.adults, 0);
    const totalChildren = newRooms.reduce((acc, r) => acc + r.children, 0);
    setTabParams((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        rooms: newRooms,
        adultos: totalAdults,
        ninos: totalChildren,
      },
    }));
  };

  const handleNoDecididoChange = (checked: boolean) => {
    setNoDecidido(checked);
    if (checked) {
      updateParam("fecha", "");
      if ("fechaFin" in activeParams) {
        updateParam("fechaFin", "");
      }
    }
  };

  // UI state for dropdowns
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);
  const [showAutocompleteDestino, setShowAutocompleteDestino] = useState(false);
  const [showAutocompleteOrigen, setShowAutocompleteOrigen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [dateEndOpen, setDateEndOpen] = useState(false);
  const [noDecidido, setNoDecidido] = useState(false);
  const [showGroupTypeDropdown, setShowGroupTypeDropdown] = useState(false);

  // Group trips specific dropdowns
  const [showGroupDestinations, setShowGroupDestinations] = useState(false);
  const [showGroupDates, setShowGroupDates] = useState(false);

  // References for clicking outside
  const travelersRef = useRef<HTMLDivElement>(null);
  const autocompleteDestinoRef = useRef<HTMLDivElement>(null);
  const autocompleteOrigenRef = useRef<HTMLDivElement>(null);
  const groupTypeRef = useRef<HTMLDivElement>(null);
  const groupDestinationsRef = useRef<HTMLDivElement>(null);
  const groupDatesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadOrigin() {
      const city = await detectUserCity();
      setTabParams((prev) => {
        const updated = { ...prev };
        (Object.keys(updated) as SearchTab[]).forEach((tab) => {
          if ("origen" in updated[tab]) {
            updated[tab] = { ...updated[tab], origen: city };
          }
        });
        return updated;
      });
    }
    loadOrigin();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (travelersRef.current && !travelersRef.current.contains(event.target as Node)) {
        setShowTravelersDropdown(false);
      }
      if (autocompleteDestinoRef.current && !autocompleteDestinoRef.current.contains(event.target as Node)) {
        setShowAutocompleteDestino(false);
      }
      if (autocompleteOrigenRef.current && !autocompleteOrigenRef.current.contains(event.target as Node)) {
        setShowAutocompleteOrigen(false);
      }
      if (groupTypeRef.current && !groupTypeRef.current.contains(event.target as Node)) {
        setShowGroupTypeDropdown(false);
      }
      if (groupDestinationsRef.current && !groupDestinationsRef.current.contains(event.target as Node)) {
        setShowGroupDestinations(false);
      }
      if (groupDatesRef.current && !groupDatesRef.current.contains(event.target as Node)) {
        setShowGroupDates(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetching data
  const { data: heroImages = fallbackHero } = useQuery({
    queryKey: ["hero-images"],
    queryFn: fetchHeroImages,
  });

  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  const { data: cabins = [] } = useQuery({
    queryKey: ["cabins"],
    queryFn: fetchCabins,
  });

  // Filter group plans
  const activeGroupPlans = useMemo(() => {
    return plans.filter((p) => {
      const section = getPlanExperienceSection(p);
      return section === "grupales" && p.published !== false;
    });
  }, [plans]);

  // Filter autocomplete suggestions based on search query
  const filteredCities = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return CITIES;
    return CITIES.filter(city => city.toLowerCase().includes(query));
  }, [searchQuery]);

  const featuredSuggestions = useMemo(() => {
    if (activeTab === "grupales") return [];
    const list = POPULAR_DESTINATIONS[activeTab].featured;
    if (!searchQuery) return list;
    return list.filter(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeTab, searchQuery]);

  const optionalSuggestions = useMemo(() => {
    if (activeTab === "grupales") return [];
    const list = POPULAR_DESTINATIONS[activeTab].optional;
    if (!searchQuery) return list;
    return list.filter(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeTab, searchQuery]);

  const allDestinations = useMemo(() => {
    return [...featuredSuggestions, ...optionalSuggestions].slice(0, 10);
  }, [featuredSuggestions, optionalSuggestions]);

  const handleSearch = () => {
    const params = tabParams[activeTab];
    const roomsDetailStr = params.rooms ? JSON.stringify(params.rooms) : undefined;

    if (activeTab === "alojamientos") {
      navigateWithSearch("cabins", null, {
        destino: params.destino,
        fecha: params.fecha,
        fechaFin: params.fechaFin,
        adultos: params.adultos,
        ninos: params.ninos,
        habitaciones: params.rooms?.length || 1,
        roomsDetail: roomsDetailStr,
        categoria: "alojamientos",
      });
    } else if (activeTab === "grupales") {
      // Find matching group plan to navigate to it directly
      const matchingPlan = activeGroupPlans.find(p => p.name === params.destino);
      navigateWithSearch("plans", "grupales", {
        destino: params.destino,
        fecha: params.fecha,
        adultos: params.adultos,
        ninos: 0,
        tipoViajero: params.tipoViajero,
        categoria: "grupales",
      });
    } else {
      const targetSectionId = activeTab === "tours" ? "tours" : activeTab;
      navigateWithSearch("plans", targetSectionId, {
        destino: params.destino,
        origen: params.origen,
        fecha: params.fecha,
        fechaFin: params.fechaFin,
        adultos: params.adultos,
        ninos: params.ninos,
        habitaciones: params.rooms?.length || undefined,
        roomsDetail: roomsDetailStr,
        categoria: activeTab,
        actividad: params.actividad,
      });
    }
  };

  const backgroundImageUrl = heroImages[0]?.url || "https://gvpioebttpmtblsjilbt.supabase.co/storage/v1/object/public/images/1779761594179-oiiu8u8.jpg";

  // Build placeholders dynamically
  const getDestinationPlaceholder = () => {
    switch (activeTab) {
      case "internacionales": return "¿A qué país viajas?";
      case "nacionales": return "¿Qué destino de Colombia buscas?";
      case "circuitos": return "¿Qué circuito deseas realizar?";
      case "pasadias": return "¿A qué playa o destino vas hoy?";
      case "tours": return "¿En qué ciudad quieres hacer la actividad?";
      case "alojamientos": return "¿En qué zona te hospedarás?";
      case "grupales": return "Selecciona el viaje grupal";
    }
  };

  // Build Travelers Button text summary
  const getTravelersSummary = () => {
    const adults = activeParams.adultos;
    const children = activeParams.ninos;
    const rooms = activeParams.rooms?.length || 1;
    
    const adultText = `${adults} adulto${adults !== 1 ? "s" : ""}`;
    const childText = children > 0 ? `, ${children} niño${children !== 1 ? "s" : ""}` : "";
    const roomText = hasRooms ? `, ${rooms} habitación${rooms !== 1 ? "es" : ""}` : "";
    
    return `${adultText}${childText}${roomText}`;
  };

  const hasRooms = activeTab === "internacionales" || activeTab === "nacionales" || activeTab === "circuitos" || activeTab === "alojamientos";

  return (
    <section className="relative w-full flex flex-col justify-center min-h-[660px] md:h-[80vh] lg:h-[92vh] overflow-visible">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="absolute inset-0 w-full h-full">
          {heroImages[0]?.mobileUrl && (
            <source media="(max-width: 768px)" srcSet={heroImages[0].mobileUrl} />
          )}
          <img
            src={backgroundImageUrl}
            alt="Descubre el Mundo con Luisito el Viajero"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://gvpioebttpmtblsjilbt.supabase.co/storage/v1/object/public/images/1779761594179-oiiu8u8.jpg";
              e.currentTarget.onerror = null;
            }}
          />
        </picture>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/15 z-10" />

      {/* Content container - relative flow in mobile so parent stretches height dynamically to prevent clipping */}
      <div className="relative z-20 w-full flex flex-col items-center justify-start px-4 sm:px-6 text-center pt-28 pb-12 md:absolute md:inset-0 md:pt-0 md:pb-0 md:justify-center">
        <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 sm:mb-6 leading-[1.15] tracking-tight" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.35)" }}>
            Descubre el Mundo con Luisito el Viajero
          </h1>

          <p className="text-white/95 text-sm xs:text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-6 sm:mb-10 leading-normal sm:leading-relaxed font-semibold">
            Experiencias reales, circuitos épicos y pasadías inolvidables. Asesórate con nosotros.
          </p>

          {/* Buscador Modular de Pestañas */}
          <div className="w-full bg-white/95 backdrop-blur-md p-4 sm:p-6 sm:pb-8 rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl text-left animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
            {/* Tabs List */}
            <div
              ref={tabsDragScroll.ref}
              onMouseDown={tabsDragScroll.onMouseDown}
              onMouseMove={tabsDragScroll.onMouseMove}
              onMouseUp={tabsDragScroll.onMouseUp}
              onMouseLeave={tabsDragScroll.onMouseLeave}
              onClickCapture={tabsDragScroll.onClickCapture}
              className="flex bg-zinc-150/80 p-1.5 rounded-xl w-full md:w-fit mb-5 gap-1 overflow-x-auto max-w-full cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {(
                [
                  { id: "internacionales", label: "Planes Internacionales" },
                  { id: "nacionales", label: "Planes Nacionales" },
                  { id: "circuitos", label: "Circuitos" },
                  { id: "pasadias", label: "Pasadías" },
                  { id: "grupales", label: "Viajes Grupales" },
                  { id: "alojamientos", label: "Cabañas" },
                  { id: "tours", label: "Actividades" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowAutocompleteDestino(false);
                    setShowAutocompleteOrigen(false);
                    setSearchQuery("");
                    setNoDecidido(false);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border-none whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-zinc-900 text-white shadow-sm font-bold"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Inputs Dynamic row */}
            <div className={cn(
              "grid grid-cols-1 gap-4 items-end",
              (activeTab === "internacionales" || activeTab === "nacionales" || activeTab === "circuitos") && "md:grid-cols-12",
              activeTab === "pasadias" && "md:grid-cols-12",
              activeTab === "tours" && "md:grid-cols-12",
              activeTab === "alojamientos" && "md:grid-cols-12",
              activeTab === "grupales" && "md:grid-cols-12"
            )}>
              
              {/* ORIGEN (Only for Nacionales, Internacionales & Circuitos) */}
              {(activeTab === "internacionales" || activeTab === "nacionales" || activeTab === "circuitos") && (
                <div className="md:col-span-2 md:row-start-1 relative text-left" ref={autocompleteOrigenRef} style={{ zIndex: showAutocompleteOrigen ? 50 : 5 }}>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 pl-1">Origen</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Ciudad de origen"
                      value={activeParams.origen || ""}
                      onChange={(e) => {
                        updateParam("origen", e.target.value);
                        setSearchQuery(e.target.value);
                        setShowAutocompleteOrigen(true);
                      }}
                      onFocus={() => {
                        setSearchQuery(activeParams.origen || "");
                        setShowAutocompleteOrigen(true);
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean text-sm text-zinc-800 placeholder:text-zinc-400 bg-zinc-50/50 font-semibold h-[46px] transition-all"
                    />
                  </div>

                  {showAutocompleteOrigen && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-200/85 p-4 z-50 w-[290px] sm:w-[320px] animate-in fade-in slide-in-from-top-1 duration-200 text-left">
                      {/* Little pointer arrow */}
                      <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-t border-l border-zinc-200/85 rotate-45" />

                      <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-zinc-150">
                        <MapPin className="w-4 h-4 text-ocean shrink-0" />
                        <span className="text-xs sm:text-sm font-extrabold text-zinc-700">Ciudades principales</span>
                      </div>

                      <div className="space-y-0.5 max-h-60 overflow-y-auto pr-1">
                        {filteredCities.length === 0 ? (
                          <p className="text-xs text-zinc-500 p-2">Escribe para filtrar</p>
                        ) : (
                          filteredCities.map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => {
                                updateParam("origen", city);
                                setShowAutocompleteOrigen(false);
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-50 text-sm font-semibold text-zinc-700 hover:text-zinc-900 transition-all duration-155 cursor-pointer block border-none bg-transparent"
                            >
                              {city}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* DESTINO / CIUDAD */}
              <div className={cn(
                "relative text-left md:row-start-1",
                (activeTab === "internacionales" || activeTab === "nacionales" || activeTab === "circuitos") && "md:col-span-2",
                activeTab === "pasadias" && "md:col-span-4",
                activeTab === "tours" && "md:col-span-3",
                activeTab === "alojamientos" && "md:col-span-3",
                activeTab === "grupales" && "md:col-span-3"
              )} ref={activeTab === "grupales" ? groupDestinationsRef : autocompleteDestinoRef} style={{ zIndex: (showAutocompleteDestino || showGroupDestinations) ? 40 : 4 }}>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 pl-1">
                  {activeTab === "grupales" ? "Viaje Grupal" : "Destino"}
                </label>
                
                {activeTab === "grupales" ? (
                  // Select dropdown list for grupales
                  <div className="relative">
                    <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowGroupDestinations(!showGroupDestinations)}
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean text-sm text-zinc-800 bg-zinc-50/50 font-semibold cursor-pointer flex items-center justify-between text-left h-[46px]"
                    >
                      <span className="truncate">{activeParams.destino || "Selecciona un viaje"}</span>
                      <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                    </button>

                    {showGroupDestinations && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-150 p-2 z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider pl-2 mb-2">Viajes disponibles</p>
                        {activeGroupPlans.length === 0 ? (
                          <p className="text-xs text-zinc-500 p-2">No hay salidas programadas</p>
                        ) : (
                          <div className="space-y-1">
                            {activeGroupPlans.map((p) => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  updateParam("destino", p.name);
                                  // Automatically select date
                                  if (p.fecha_salida) {
                                    updateParam("fecha", p.fecha_salida);
                                  }
                                  setShowGroupDestinations(false);
                                }}
                                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-zinc-100 flex items-center justify-between text-sm font-semibold text-zinc-700 transition-colors"
                              >
                                <span className="truncate">{p.name}</span>
                                {p.fecha_salida && <span className="text-[10px] font-bold text-ocean bg-ocean/10 px-2 py-0.5 rounded-full shrink-0">{p.fecha_salida}</span>}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  // Autocomplete standard destination
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={getDestinationPlaceholder()}
                      value={activeParams.destino}
                      onChange={(e) => {
                        updateParam("destino", e.target.value);
                        setSearchQuery(e.target.value);
                        setShowAutocompleteDestino(true);
                      }}
                      onFocus={() => {
                        setSearchQuery(activeParams.destino);
                        setShowAutocompleteDestino(true);
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean text-sm text-zinc-800 placeholder:text-zinc-400 bg-zinc-50/50 font-semibold h-[46px] transition-all"
                    />
                  </div>
                )}

                {!showGroupDestinations && showAutocompleteDestino && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-200/85 p-4 z-50 w-[290px] sm:w-[320px] animate-in fade-in slide-in-from-top-1 duration-200 text-left">
                    {/* Little pointer arrow */}
                    <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-t border-l border-zinc-200/85 rotate-45" />

                    <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-zinc-150">
                      <MapPin className="w-4 h-4 text-ocean shrink-0" />
                      <span className="text-xs sm:text-sm font-extrabold text-zinc-700">Destinos populares</span>
                    </div>

                    <div className="space-y-0.5 max-h-60 overflow-y-auto pr-1">
                      {allDestinations.length === 0 ? (
                        <p className="text-xs text-zinc-500 p-2">Escribe para buscar destinos</p>
                      ) : (
                        allDestinations.map((dest) => (
                          <button
                            key={dest}
                            type="button"
                            onClick={() => {
                              updateParam("destino", dest);
                              setShowAutocompleteDestino(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-50 text-sm font-semibold text-zinc-700 hover:text-zinc-900 transition-all duration-155 cursor-pointer block border-none bg-transparent"
                          >
                            {dest}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actividad / Experiencia (Only for Actividades tab) */}
              {activeTab === "tours" && (
                <div className="md:col-span-3 md:row-start-1 text-left" style={{ zIndex: 3 }}>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 pl-1">Actividad o Experiencia</label>
                  <div className="relative">
                    <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Ej: Paracaidismo, Buceo"
                      value={activeParams.actividad || ""}
                      onChange={(e) => updateParam("actividad", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean text-sm text-zinc-800 placeholder:text-zinc-400 bg-zinc-50/50 font-semibold h-[46px]"
                    />
                  </div>
                </div>
              )}

              {/* ENTRADA & SALIDA GROUPED CONTAINER (Only for tabs with rooms: internacionales, nacionales, circuitos, alojamientos) */}
              {hasRooms ? (
                <div
                  className={cn(
                    "relative text-left md:row-start-1",
                    (activeTab === "internacionales" || activeTab === "nacionales" || activeTab === "circuitos") ? "md:col-span-3" : "md:col-span-4"
                  )}
                  style={{ zIndex: (dateOpen || dateEndOpen) ? 30 : 3 }}
                >
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {/* Entrada */}
                    <div className="relative text-left">
                      <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 pl-1">
                        Entrada
                      </label>
                      <div className="relative">
                        <Popover open={noDecidido ? false : dateOpen} onOpenChange={(open) => !noDecidido && setDateOpen(open)}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              disabled={noDecidido}
                              className={cn(
                                "w-full pl-9 pr-2 py-3 rounded-xl border text-sm font-semibold flex items-center justify-between text-left h-[46px] transition-all",
                                noDecidido
                                  ? "bg-zinc-100/90 text-zinc-400 border-zinc-200/60 cursor-not-allowed"
                                  : "border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean text-zinc-800 bg-zinc-50/50 cursor-pointer"
                              )}
                            >
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                                <CalendarIcon className={cn("w-4 h-4", noDecidido ? "text-zinc-300" : "text-zinc-400")} />
                              </span>
                              <span className="truncate block w-full text-xs sm:text-sm">
                                {noDecidido
                                  ? "Sin fecha"
                                  : activeParams.fecha
                                  ? format(new Date(activeParams.fecha + "T12:00:00"), "dd MMM yyyy", { locale: es })
                                  : "Seleccionar"}
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={activeParams.fecha ? new Date(activeParams.fecha + "T12:00:00") : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  const dateStr = format(date, "yyyy-MM-dd");
                                  updateParam("fecha", dateStr);
                                  if (activeParams.fechaFin) {
                                    const checkOutDate = new Date(activeParams.fechaFin + "T12:00:00");
                                    if (isBefore(checkOutDate, date)) {
                                      updateParam("fechaFin", format(addDays(date, 1), "yyyy-MM-dd"));
                                    }
                                  }
                                } else {
                                  updateParam("fecha", "");
                                }
                                setDateOpen(false);
                              }}
                              disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Salida */}
                    <div className="relative text-left">
                      <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 pl-1">
                        Salida
                      </label>
                      <div className="relative">
                        <Popover open={noDecidido ? false : dateEndOpen} onOpenChange={(open) => !noDecidido && setDateEndOpen(open)}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              disabled={noDecidido}
                              className={cn(
                                "w-full pl-9 pr-2 py-3 rounded-xl border text-sm font-semibold flex items-center justify-between text-left h-[46px] transition-all",
                                noDecidido
                                  ? "bg-zinc-100/90 text-zinc-400 border-zinc-200/60 cursor-not-allowed"
                                  : "border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean text-zinc-800 bg-zinc-50/50 cursor-pointer"
                              )}
                            >
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                                <CalendarIcon className={cn("w-4 h-4", noDecidido ? "text-zinc-300" : "text-zinc-400")} />
                              </span>
                              <span className="truncate block w-full text-xs sm:text-sm">
                                {noDecidido
                                  ? "Sin fecha"
                                  : activeParams.fechaFin
                                  ? format(new Date(activeParams.fechaFin + "T12:00:00"), "dd MMM yyyy", { locale: es })
                                  : "Seleccionar"}
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={activeParams.fechaFin ? new Date(activeParams.fechaFin + "T12:00:00") : undefined}
                              onSelect={(date) => {
                                updateParam("fechaFin", date ? format(date, "yyyy-MM-dd") : "");
                                setDateEndOpen(false);
                              }}
                              disabled={(date) => {
                                const minDate = activeParams.fecha ? addDays(new Date(activeParams.fecha + "T12:00:00"), 1) : new Date();
                                minDate.setHours(0,0,0,0);
                                return date < minDate;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  {/* Switch "Todavía no he decidido la fecha" (Directly below Entrada and Salida) */}
                  <div className="relative mt-2.5 md:absolute md:top-full md:left-0 md:mt-2.5 flex items-center gap-2 w-max pb-1 z-10">
                    <Switch
                      id="no-decidido-fecha"
                      checked={noDecidido}
                      onCheckedChange={handleNoDecididoChange}
                      className="data-[state=checked]:bg-ocean scale-90 origin-left"
                    />
                    <label
                      htmlFor="no-decidido-fecha"
                      className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 cursor-pointer select-none transition-colors"
                    >
                      Todavía no he decidido la fecha
                    </label>
                  </div>
                </div>
              ) : (
                /* SINGLE DATE SELECTOR (For other tabs: pasadias, tours, grupales) */
                <div
                  className={cn(
                    "relative text-left md:row-start-1",
                    activeTab === "pasadias" && "md:col-span-3",
                    activeTab === "tours" && "md:col-span-2",
                    activeTab === "grupales" && "md:col-span-2"
                  )}
                  ref={activeTab === "grupales" ? groupDatesRef : undefined}
                  style={{ zIndex: (dateOpen || showGroupDates) ? 30 : 3 }}
                >
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 pl-1">
                    {activeTab === "grupales" ? "Fecha" : "Fecha"}
                  </label>

                  {activeTab === "grupales" ? (
                    // Select dropdown list of departure dates for grupales
                    <div className="relative">
                      <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowGroupDates(!showGroupDates)}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean text-sm text-zinc-800 bg-zinc-50/50 font-semibold cursor-pointer flex items-center justify-between text-left h-[46px]"
                      >
                        <span className="truncate">{activeParams.fecha || "Selecciona fecha"}</span>
                        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                      </button>

                      {showGroupDates && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-150 p-2 z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200">
                          <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider pl-2 mb-2">Fechas programadas</p>
                          {activeGroupPlans.length === 0 ? (
                            <p className="text-xs text-zinc-500 p-2">No hay fechas disponibles</p>
                          ) : (
                            <div className="space-y-1">
                              {(() => {
                                const filteredByDest = activeParams.destino
                                  ? activeGroupPlans.filter(p => p.name === activeParams.destino)
                                  : activeGroupPlans;

                                return filteredByDest.map((p) => {
                                  if (!p.fecha_salida) return null;
                                  return (
                                    <button
                                      key={p.id}
                                      type="button"
                                      onClick={() => {
                                        updateParam("fecha", p.fecha_salida!);
                                        if (!activeParams.destino) {
                                          updateParam("destino", p.name);
                                        }
                                        setShowGroupDates(false);
                                      }}
                                      className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-zinc-100 flex items-center justify-between text-sm font-semibold text-zinc-700 transition-colors"
                                    >
                                      <span>{p.fecha_salida}</span>
                                      <span className="text-[10px] font-bold text-zinc-400 truncate max-w-[120px]">{p.name}</span>
                                    </button>
                                  );
                                });
                              })()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Calendar popup picker for tours, pasadias
                    <div className="relative">
                      <Popover open={dateOpen} onOpenChange={setDateOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="w-full pl-9 pr-2 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean text-sm text-zinc-800 bg-zinc-50/50 font-semibold cursor-pointer flex items-center justify-between text-left h-[46px]"
                          >
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                              <CalendarIcon className="w-4 h-4 text-zinc-400" />
                            </span>
                            <span className="truncate block w-full text-xs sm:text-sm">
                              {activeParams.fecha
                                ? format(new Date(activeParams.fecha + "T12:00:00"), "dd MMM yyyy", { locale: es })
                                : "Seleccionar"}
                            </span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={activeParams.fecha ? new Date(activeParams.fecha + "T12:00:00") : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const dateStr = format(date, "yyyy-MM-dd");
                                updateParam("fecha", dateStr);
                              } else {
                                updateParam("fecha", "");
                              }
                              setDateOpen(false);
                            }}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              )}

              {/* PASAJEROS (Multihabitación o contador simple) */}
              <div className={cn(
                "relative text-left md:row-start-1",
                (activeTab === "internacionales" || activeTab === "nacionales" || activeTab === "circuitos") && "md:col-span-3",
                activeTab === "pasadias" && "md:col-span-3",
                activeTab === "tours" && "md:col-span-2",
                activeTab === "alojamientos" && "md:col-span-3",
                activeTab === "grupales" && "md:col-span-2"
              )} ref={travelersRef}>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 pl-1">
                  {activeTab === "grupales" ? "Personas" : hasRooms ? "Pasajeros y Habitaciones" : "Viajeros"}
                </label>
                <button
                  type="button"
                  onClick={() => setShowTravelersDropdown(!showTravelersDropdown)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean text-sm text-zinc-800 bg-zinc-50/50 font-semibold cursor-pointer flex items-center justify-between text-left h-[46px]"
                >
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center">
                    <Users className="w-4 h-4 text-zinc-400" />
                  </span>
                  <span className="truncate">
                    {getTravelersSummary()}
                  </span>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  </span>
                </button>

                {showTravelersDropdown && (
                  <div className="absolute right-0 md:left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-zinc-150 p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="space-y-4">
                      {/* Adultos */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-zinc-800">Adultos</p>
                          <p className="text-[10px] text-zinc-400 font-bold">Mayores de 12 años</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateParam("adultos", Math.max(1, activeParams.adultos - 1))}
                            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-100 font-bold active:scale-95 transition-all cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-sm font-extrabold text-zinc-800 tabular-nums">
                            {activeParams.adultos}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateParam("adultos", Math.min(10, activeParams.adultos + 1))}
                            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-100 font-bold active:scale-95 transition-all cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Niños */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-zinc-800">Niños</p>
                          <p className="text-[10px] text-zinc-400 font-bold">0 a 11 años</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateParam("ninos", Math.max(0, activeParams.ninos - 1))}
                            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-100 font-bold active:scale-95 transition-all cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-sm font-extrabold text-zinc-800 tabular-nums">
                            {activeParams.ninos}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateParam("ninos", Math.min(6, activeParams.ninos + 1))}
                            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-100 font-bold active:scale-95 transition-all cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Habitaciones */}
                      {hasRooms && (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-zinc-800">Habitaciones</p>
                            <p className="text-[10px] text-zinc-400 font-bold">Distribución de camas</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                const currentRooms = activeParams.rooms || [{ adults: 2, children: 0 }];
                                if (currentRooms.length > 1) {
                                  const updatedRooms = currentRooms.slice(0, -1);
                                  setTabParams((prev) => ({
                                    ...prev,
                                    [activeTab]: {
                                      ...prev[activeTab],
                                      rooms: updatedRooms,
                                    },
                                  }));
                                }
                              }}
                              className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-100 font-bold active:scale-95 transition-all cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-sm font-extrabold text-zinc-800 tabular-nums">
                              {activeParams.rooms?.length || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const currentRooms = activeParams.rooms || [{ adults: 2, children: 0 }];
                                if (currentRooms.length < 5) {
                                  const updatedRooms = [...currentRooms, { adults: 2, children: 0 }];
                                  setTabParams((prev) => ({
                                    ...prev,
                                    [activeTab]: {
                                      ...prev[activeTab],
                                      rooms: updatedRooms,
                                    },
                                  }));
                                }
                              }}
                              className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-100 font-bold active:scale-95 transition-all cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-zinc-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowTravelersDropdown(false)}
                          className="px-4 py-2 bg-ocean text-white rounded-lg text-xs font-bold hover:bg-ocean-dark transition-colors cursor-pointer"
                        >
                          Listo
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tipo de viajero (Only for grupales) */}
              {activeTab === "grupales" && (
                <div className="md:col-span-3 md:row-start-1 text-left relative" ref={groupTypeRef} style={{ zIndex: showGroupTypeDropdown ? 5 : 1 }}>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 pl-1">Tipo de Viajero (opcional)</label>
                  <button
                    type="button"
                    onClick={() => setShowGroupTypeDropdown(!showGroupTypeDropdown)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean text-sm text-zinc-800 bg-zinc-50/50 font-semibold cursor-pointer flex items-center justify-between text-left h-[46px]"
                  >
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center">
                      <Compass className="w-4 h-4 text-zinc-400" />
                    </span>
                    <span className="truncate">
                      {activeParams.tipoViajero || "Cualquiera"}
                    </span>
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </span>
                  </button>

                  {showGroupTypeDropdown && (
                    <div className="absolute right-0 md:left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-150 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                      {(["Cualquiera", "Solo", "En Pareja", "En Familia", "Con Amigos"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            updateParam("tipoViajero", type === "Cualquiera" ? "" : type);
                            setShowGroupTypeDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-700 font-semibold hover:bg-zinc-100 transition-colors"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className={cn(
                "w-full text-center md:row-start-1 md:col-span-2",
                activeTab === "pasadias" && "md:col-span-2",
                activeTab === "tours" && "md:col-span-2",
                activeTab === "alojamientos" && "md:col-span-2",
                activeTab === "grupales" && "md:col-span-2"
              )}>
                <Button
                  onClick={handleSearch}
                  className="w-full py-3 h-[46px] bg-zinc-900 hover:bg-black text-white font-bold rounded-xl shadow-sm transition-all duration-200 active:scale-95 border-none cursor-pointer text-sm"
                >
                  <Search className="w-4 h-4 mr-1.5 shrink-0" />
                  {activeTab === "grupales" ? "Ver Viaje" : "Buscar"}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

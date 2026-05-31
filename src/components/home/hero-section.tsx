import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { MapPin, Calendar as CalendarIcon, Users, ChevronDown, Sparkles, Compass, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useNavigation } from "@/lib/store";
import { heroImages as fallbackHero } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { fetchHeroImages, fetchPlans, fetchCabins } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format, addDays, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { getPlanExperienceSection } from "@/lib/experience-sections";

type SearchTab = "internacionales" | "nacionales" | "pasadias" | "tours" | "alojamientos" | "grupales";

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

export function HeroSection() {
  const { navigateWithSearch } = useNavigation();
  const [activeTab, setActiveTab] = useState<SearchTab>("internacionales");

  // Initial parameters state
  const [tabParams, setTabParams] = useState<Record<SearchTab, TabParams>>({
    internacionales: { origen: "", destino: "", fecha: "", fechaFin: "", rooms: [{ adults: 2, children: 0 }], adultos: 2, ninos: 0 },
    nacionales: { origen: "", destino: "", fecha: "", fechaFin: "", rooms: [{ adults: 2, children: 0 }], adultos: 2, ninos: 0 },
    pasadias: { destino: "", fecha: "", adultos: 2, ninos: 0 },
    tours: { destino: "", actividad: "", fecha: "", adultos: 2, ninos: 0 },
    alojamientos: { destino: "", fecha: "", fechaFin: "", rooms: [{ adults: 2, children: 0 }], adultos: 2, ninos: 0 },
    grupales: { destino: "", fecha: "", adultos: 2, ninos: 0, tipoViajero: "" },
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

  // UI state for dropdowns
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);
  const [showAutocompleteDestino, setShowAutocompleteDestino] = useState(false);
  const [showAutocompleteOrigen, setShowAutocompleteOrigen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [dateEndOpen, setDateEndOpen] = useState(false);
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
      case "pasadias": return "¿A qué playa o destino vas hoy?";
      case "tours": return "¿En qué ciudad quieres hacer la actividad?";
      case "alojamientos": return "¿En qué zona te hospedarás?";
      case "grupales": return "Selecciona el viaje grupal";
    }
  };

  // Build Travelers Button text summary
  const getTravelersSummary = () => {
    if (activeTab === "internacionales" || activeTab === "nacionales" || activeTab === "alojamientos") {
      const rooms = activeParams.rooms || [{ adults: 2, children: 0 }];
      const totalPersons = rooms.reduce((acc, r) => acc + r.adults + r.children, 0);
      const totalRooms = rooms.length;
      return `${totalPersons} persona${totalPersons !== 1 ? "s" : ""}, ${totalRooms} habitación${totalRooms !== 1 ? "es" : ""}`;
    }

    const adults = activeParams.adultos;
    const children = activeParams.ninos;
    const adultText = `${adults} persona${adults !== 1 ? "s" : ""}`;
    const childText = children > 0 ? `, ${children} menor${children !== 1 ? "es" : ""}` : "";
    return `${adultText}${childText}`;
  };

  const hasRooms = activeTab === "internacionales" || activeTab === "nacionales" || activeTab === "alojamientos";

  return (
    <section className="relative w-full flex flex-col justify-center min-h-[660px] md:h-[80vh] lg:h-[92vh] overflow-visible md:overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImageUrl}
          alt="Descubre el Mundo con Luisito el Viajero"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = "https://gvpioebttpmtblsjilbt.supabase.co/storage/v1/object/public/images/1779761594179-oiiu8u8.jpg"; e.currentTarget.onerror = null; }}
        />
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
          <div className="w-full bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl text-left animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
            {/* Tabs List */}
            <div className="flex bg-zinc-150/80 p-1.5 rounded-xl w-full md:w-fit mb-5 gap-1 overflow-x-auto max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {(
                [
                  { id: "internacionales", label: "Planes Internacionales" },
                  { id: "nacionales", label: "Planes Nacionales" },
                  { id: "pasadias", label: "Pasadías" },
                  { id: "tours", label: "Actividades" },
                  { id: "alojamientos", label: "Alojamientos" },
                  { id: "grupales", label: "Viajes Grupales" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowAutocompleteDestino(false);
                    setShowAutocompleteOrigen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border-none whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-ocean text-white shadow-sm font-bold"
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
              (activeTab === "internacionales" || activeTab === "nacionales") && "md:grid-cols-12",
              activeTab === "pasadias" && "md:grid-cols-12",
              activeTab === "tours" && "md:grid-cols-12",
              activeTab === "alojamientos" && "md:grid-cols-12",
              activeTab === "grupales" && "md:grid-cols-12"
            )}>
              
              {/* ORIGEN (Only for Nacionales & Internacionales) */}
              {(activeTab === "internacionales" || activeTab === "nacionales") && (
                <div className="md:col-span-2 relative text-left" ref={autocompleteOrigenRef}>
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
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-150 p-3 z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200">
                      <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider pl-2 mb-2">Ciudades principales</p>
                      {filteredCities.length === 0 ? (
                        <p className="text-xs text-zinc-500 p-2">Escribe para filtrar</p>
                      ) : (
                        <div className="space-y-1">
                          {filteredCities.map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => {
                                updateParam("origen", city);
                                setShowAutocompleteOrigen(false);
                              }}
                              className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-zinc-100 flex items-center gap-2 text-sm font-semibold text-zinc-800 transition-colors"
                            >
                              <MapPin className="w-3.5 h-3.5 text-ocean shrink-0" />
                              <span>{city}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* DESTINO / CIUDAD */}
              <div className={cn(
                "relative text-left",
                (activeTab === "internacionales" || activeTab === "nacionales") && "md:col-span-2",
                activeTab === "pasadias" && "md:col-span-4",
                activeTab === "tours" && "md:col-span-3",
                activeTab === "alojamientos" && "md:col-span-3",
                activeTab === "grupales" && "md:col-span-3"
              )} ref={activeTab === "grupales" ? groupDestinationsRef : autocompleteDestinoRef}>
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
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-150 p-3 z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider pl-2 mb-2">Ciudades principales</p>
                    {filteredCities.length === 0 ? (
                      <p className="text-xs text-zinc-500 p-2">Escribe para filtrar</p>
                    ) : (
                      <div className="space-y-1">
                        {filteredCities.map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => {
                              updateParam("destino", city);
                              setShowAutocompleteDestino(false);
                            }}
                            className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-zinc-100 flex items-center gap-2 text-sm font-semibold text-zinc-800 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-ocean shrink-0" />
                            <span>{city}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actividad / Experiencia (Only for Actividades tab) */}
              {activeTab === "tours" && (
                <div className="md:col-span-3 text-left">
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

              {/* ENTRADA (Calendario o Dropdown de fechas para grupales) */}
              <div className={cn(
                "text-left",
                (activeTab === "internacionales" || activeTab === "nacionales") && "md:col-span-2",
                activeTab === "pasadias" && "md:col-span-3",
                activeTab === "tours" && "md:col-span-2",
                activeTab === "alojamientos" && "md:col-span-2",
                activeTab === "grupales" && "md:col-span-2"
              )} ref={activeTab === "grupales" ? groupDatesRef : undefined}>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 pl-1">
                  {activeTab === "alojamientos" || activeTab === "internacionales" || activeTab === "nacionales" ? "Entrada" : "Fecha"}
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
                            {/* If a destination was already chosen, show only that plan's date. Otherwise show all. */}
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
                  // Calendar popup picker for other tabs
                  <div className="relative">
                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean text-sm text-zinc-800 bg-zinc-50/50 font-semibold cursor-pointer flex items-center justify-between text-left h-[46px]"
                        >
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center">
                            <CalendarIcon className="w-4 h-4 text-zinc-400" />
                          </span>
                          <span>
                            {activeParams.fecha
                              ? format(new Date(activeParams.fecha + "T12:00:00"), "dd 'de' MMM, yyyy", { locale: es })
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
                              // Validate return date
                              const hasReturn = activeTab === "alojamientos" || activeTab === "internacionales" || activeTab === "nacionales";
                              if (hasReturn && activeParams.fechaFin) {
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
                )}
              </div>

              {/* SALIDA (Fecha de regreso para Nacionales, Internacionales y Alojamientos) */}
              {(activeTab === "alojamientos" || activeTab === "internacionales" || activeTab === "nacionales") && (
                <div className="md:col-span-2 text-left">
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 pl-1">Salida</label>
                  <div className="relative">
                    <Popover open={dateEndOpen} onOpenChange={setDateEndOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean text-sm text-zinc-800 bg-zinc-50/50 font-semibold cursor-pointer flex items-center justify-between text-left h-[46px]"
                        >
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center">
                            <CalendarIcon className="w-4 h-4 text-zinc-400" />
                          </span>
                          <span>
                            {activeParams.fechaFin
                              ? format(new Date(activeParams.fechaFin + "T12:00:00"), "dd 'de' MMM, yyyy", { locale: es })
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
              )}

              {/* PASAJEROS (Multihabitación o contador simple) */}
              <div className={cn(
                "relative text-left",
                (activeTab === "internacionales" || activeTab === "nacionales") && "md:col-span-3",
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
                  <div className="absolute right-0 md:left-0 mt-2 w-76 bg-white rounded-2xl shadow-2xl border border-zinc-150 p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    {hasRooms ? (
                      // Despegar-style Multi-room picker
                      <div className="space-y-4">
                        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                          {(activeParams.rooms || [{ adults: 2, children: 0 }]).map((room, idx) => (
                            <div key={idx} className="p-3 bg-zinc-50/70 rounded-xl border border-zinc-200 relative">
                              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-zinc-200/50">
                                <p className="text-[11px] font-bold text-zinc-600">Habitación {idx + 1}</p>
                                {(activeParams.rooms || []).length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = [...(activeParams.rooms || [])];
                                      current.splice(idx, 1);
                                      updateRooms(current);
                                    }}
                                    className="text-[10px] font-bold text-red-500 hover:text-red-650 cursor-pointer"
                                  >
                                    Eliminar
                                  </button>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                {/* Adultos */}
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-bold text-zinc-800">Mayores</p>
                                    <p className="text-[9px] font-bold text-zinc-400">Desde 18 años</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = [...(activeParams.rooms || [])];
                                        current[idx] = { ...current[idx], adults: Math.max(1, current[idx].adults - 1) };
                                        updateRooms(current);
                                      }}
                                      className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-100 font-bold active:scale-95 transition-all cursor-pointer text-xs"
                                    >
                                      -
                                    </button>
                                    <span className="w-4 text-center text-xs font-extrabold text-zinc-800 tabular-nums">
                                      {room.adults}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = [...(activeParams.rooms || [])];
                                        current[idx] = { ...current[idx], adults: Math.min(10, current[idx].adults + 1) };
                                        updateRooms(current);
                                      }}
                                      className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-100 font-bold active:scale-95 transition-all cursor-pointer text-xs"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                {/* Niños */}
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-bold text-zinc-800">Menores</p>
                                    <p className="text-[9px] font-bold text-zinc-400">Hasta 17 años</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = [...(activeParams.rooms || [])];
                                        current[idx] = { ...current[idx], children: Math.max(0, current[idx].children - 1) };
                                        updateRooms(current);
                                      }}
                                      className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-100 font-bold active:scale-95 transition-all cursor-pointer text-xs"
                                    >
                                      -
                                    </button>
                                    <span className="w-4 text-center text-xs font-extrabold text-zinc-800 tabular-nums">
                                      {room.children}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = [...(activeParams.rooms || [])];
                                        current[idx] = { ...current[idx], children: Math.min(6, current[idx].children + 1) };
                                        updateRooms(current);
                                      }}
                                      className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-100 font-bold active:scale-95 transition-all cursor-pointer text-xs"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-zinc-250/50 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              const current = [...(activeParams.rooms || [{ adults: 2, children: 0 }])];
                              if (current.length < 5) {
                                current.push({ adults: 2, children: 0 });
                                updateRooms(current);
                              }
                            }}
                            className="text-xs font-bold text-ocean hover:underline cursor-pointer"
                          >
                            + Añadir habitación
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowTravelersDropdown(false)}
                            className="px-4 py-2 bg-ocean text-white rounded-lg text-xs font-bold hover:bg-ocean-dark transition-colors cursor-pointer"
                          >
                            Aplicar
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Single counters for Pasadias, Tours and Grupales
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-zinc-800">Adultos</p>
                            <p className="text-[10px] text-zinc-400 font-bold">Mayores de 12 años</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => updateParam("adultos", Math.max(1, activeParams.adultos - 1))}
                              className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 active:scale-90 transition-all font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-sm font-bold text-zinc-800 tabular-nums">
                              {activeParams.adultos}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateParam("adultos", Math.min(10, activeParams.adultos + 1))}
                              className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 active:scale-90 transition-all font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {activeTab !== "grupales" && (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-zinc-800">Menores</p>
                              <p className="text-[10px] text-zinc-400 font-bold">Edades de 0 a 11 años</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => updateParam("ninos", Math.max(0, activeParams.ninos - 1))}
                                className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 active:scale-90 transition-all font-bold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-5 text-center text-sm font-bold text-zinc-800 tabular-nums">
                                {activeParams.ninos}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateParam("ninos", Math.min(6, activeParams.ninos + 1))}
                                className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 active:scale-90 transition-all font-bold cursor-pointer"
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
                    )}
                  </div>
                )}
              </div>

              {/* Tipo de viajero (Only for grupales) */}
              {activeTab === "grupales" && (
                <div className="md:col-span-3 text-left relative" ref={groupTypeRef}>
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

              {/* Search Button */}
              <div className={cn(
                "w-full text-center",
                (activeTab === "internacionales" || activeTab === "nacionales") && "md:col-span-2",
                activeTab === "pasadias" && "md:col-span-2",
                activeTab === "tours" && "md:col-span-2",
                activeTab === "alojamientos" && "md:col-span-2",
                activeTab === "grupales" && "md:col-span-2"
              )}>
                <Button
                  onClick={handleSearch}
                  className="w-full py-3 h-[46px] bg-yellow-400 hover:bg-yellow-500 text-zinc-900 hover:text-zinc-900 font-extrabold rounded-xl shadow-md shadow-yellow-400/20 hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-200 active:scale-95 border-none cursor-pointer text-sm"
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

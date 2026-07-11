"use client";

import { useState, useEffect } from "react";
import { useNavigation } from "@/lib/store";
import { ArrowRight, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function StickySummaryBar() {
  const {
    currentView,
    searchDestination,
    searchOrigin,
    searchDate,
    searchDateEnd,
    searchAdults,
    searchChildren,
    searchRooms,
    searchIsSticky,
    searchPriceFrom,
    navigate,
    setSearchIsSticky,
  } = useNavigation();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!searchIsSticky || !searchDestination) return null;

  const isListView = currentView === "plans" || currentView === "cabins";
  const isDetailView = currentView === "plan-detail" || currentView === "cabin-detail";
  const isVisible = isDetailView || (isListView && isScrolled);

  const visibilityClasses = isVisible
    ? "translate-y-0 opacity-100"
    : "-translate-y-full opacity-0 pointer-events-none";

  // Format dates nicely
  const formatDateRange = () => {
    if (!searchDate) return "Fechas por definir";
    const start = new Date(searchDate + "T12:00:00");
    const startStr = format(start, "d MMM", { locale: es });
    if (!searchDateEnd) return startStr;
    const end = new Date(searchDateEnd + "T12:00:00");
    const endStr = format(end, "d MMM yyyy", { locale: es });
    return `${startStr} - ${endStr}`;
  };

  const totalPax = parseInt(searchAdults || "2", 10) + parseInt(searchChildren || "0", 10);
  const roomsCount = parseInt(searchRooms || "1", 10);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleModify = () => {
    // Navigate home and scroll to top where the search bar is located
    navigate("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
    // De-activate sticky summary when editing
    setSearchIsSticky(false);
  };

  return (
    <div className={`fixed top-14 sm:top-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 py-2.5 px-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-500 transform ${visibilityClasses}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        {/* Route Info */}
        <div className="flex items-center gap-2 font-bold text-zinc-800">
          <span className="text-zinc-500 font-medium text-xs sm:text-sm">{searchOrigin || "Cualquier origen"}</span>
          <ArrowRight className="w-3.5 h-3.5 text-ocean" />
          <span className="text-ocean-dark text-sm sm:text-base font-extrabold">{searchDestination}</span>
        </div>

        {/* Search Meta Summary */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-zinc-600">
          {/* Dates */}
          <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200/60">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>{formatDateRange()}</span>
          </div>

          {/* Passengers & Rooms */}
          <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200/60">
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            <span>
              {totalPax} pasajero{totalPax !== 1 ? "s" : ""} · {roomsCount} hab.
            </span>
          </div>
        </div>

        {/* Pricing and Call to Action */}
        <div className="flex items-center gap-4">
          {searchPriceFrom && (
            <div className="text-right">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Desde</span>
              <p className="text-foreground font-extrabold text-base leading-none">
                {formatPrice(searchPriceFrom)}
              </p>
            </div>
          )}
          <Button
            size="sm"
            onClick={handleModify}
            className="bg-ocean hover:bg-ocean-dark text-white rounded-xl px-4 py-1.5 text-xs font-bold shadow-sm h-8"
          >
            Modificar
          </Button>
        </div>
      </div>
    </div>
  );
}

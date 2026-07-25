"use client";

import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useCabinAvailability,
  expandBookedRanges,
} from "@/hooks/use-cabin-availability";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useMemo } from "react";
import { es } from "date-fns/locale";
import { CalendarDays, CircleDot, CircleSlash, Info } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface AvailabilityCalendarProps {
  cabinId: string;
  cabinName: string;
  /** Optional: sync the selected range back to the parent (booking widget). */
  selectedRange?: DateRange;
  onSelectRange?: (range: DateRange | undefined) => void;
  /** When true, the calendar is used purely for display (no selection). */
  readOnly?: boolean;
}

export function AvailabilityCalendar({
  cabinId,
  cabinName,
  selectedRange,
  onSelectRange,
  readOnly = false,
}: AvailabilityCalendarProps) {
  const { data, isLoading } = useCabinAvailability(cabinId);
  const isMobile = useIsMobile();
  const [internalRange, setInternalRange] = useState<DateRange | undefined>(
    undefined
  );

  const range = readOnly ? selectedRange : selectedRange ?? internalRange;
  const setRange = (r: DateRange | undefined) => {
    if (!readOnly) setInternalRange(r);
    onSelectRange?.(r);
  };

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const bookedDates = useMemo(
    () => (data?.booked ? expandBookedRanges(data.booked) : []),
    [data?.booked]
  );

  const bookedSet = useMemo(() => {
    const s = new Set<string>();
    bookedDates.forEach((d) => s.add(d.toISOString().slice(0, 10)));
    return s;
  }, [bookedDates]);

  const isDateBooked = (date: Date) =>
    bookedSet.has(date.toISOString().slice(0, 10));

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-1">
        <CalendarDays className="w-5 h-5 text-ocean" />
        <h2 className="text-2xl md:text-[28px] font-bold tracking-tight text-foreground">
          Disponibilidad
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Consulta en tiempo real las fechas disponibles de {cabinName}.
        {!data?.hasCalendar && !isLoading && (
          <span className="block mt-1 text-xs">
            El calendario de esta propiedad se está configurando.
          </span>
        )}
      </p>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CircleDot className="w-3.5 h-3.5 text-ocean" />
          Disponible
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CircleSlash className="w-3.5 h-3.5 text-zinc-400" />
          Ocupado / bloqueado
        </span>
        {data?.source === "cache" && (
          <Badge
            variant="outline"
            className="text-[10px] font-normal text-muted-foreground border-border"
          >
            <Info className="w-2.5 h-2.5 mr-1" />
            Actualizado recientemente
          </Badge>
        )}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-4 md:p-8">
        {isLoading ? (
          <div className="flex justify-center">
            <Skeleton className="w-full max-w-[320px] h-[340px]" />
          </div>
        ) : (
          <div className="availability-calendar flex justify-center overflow-x-auto md:block md:overflow-x-visible">
            <Calendar
              mode="range"
              selected={range}
              onSelect={readOnly ? undefined : (r) => setRange(r ?? undefined)}
              disabled={[
                { before: today },
                ...(bookedDates.length > 0 ? bookedDates : []),
              ]}
              numberOfMonths={isMobile ? 1 : 2}
              locale={es}
              defaultMonth={today}
              className={isMobile ? "mobile-airbnb-calendar" : "mobile-airbnb-calendar desktop-full-calendar"}
              style={!isMobile ? { "--cell-size": "48px" } as React.CSSProperties : undefined}
              classNames={{
                root: cn(!isMobile ? "w-full" : "w-fit"),
                months: cn(!isMobile ? "flex flex-row w-full gap-8" : "flex gap-4 flex-col md:flex-row relative"),
                month: cn(!isMobile ? "flex flex-col flex-1 gap-4" : "flex flex-col w-full gap-4"),
                day: cn("relative w-full h-full p-0 text-center"),
              }}
              modifiers={{
                booked: bookedDates,
              }}
              modifiersStyles={{
                booked: {
                  textDecoration: "line-through",
                  color: "#9CA3AF",
                  opacity: 0.55,
                },
              }}
            />
          </div>
        )}

        {data?.hasCalendar && data.booked.length === 0 && !isLoading && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            ¡Buenas noticias! Esta propiedad está disponible todo el calendario
            mostrado.
          </p>
        )}
      </div>
    </section>
  );
}

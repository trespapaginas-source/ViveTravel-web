"use client";

import { memo, useCallback } from "react";
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { CardImageCarousel } from "@/components/shared/card-image-carousel";
import { useNavigation } from "@/lib/store";
import { fetchPlans } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { type TourPlan } from "@/lib/data";
import { motion } from "framer-motion";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

const DepartureCard = memo(function DepartureCard({
  plan,
  onNavigate,
}: {
  plan: TourPlan;
  onNavigate: (id: string) => void;
}) {
  return (
    <Card
      className="group w-full h-full flex flex-col cursor-pointer overflow-hidden rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 shadow-none py-0 gap-0"
      onClick={() => onNavigate(plan.id)}
    >
      {/* Image */}
      <div className="relative h-[210px] w-full shrink-0">
        <CardImageCarousel images={plan.images} alt={plan.name} />
        {/* Fixed-dates chip over the photo */}
        <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm border border-black/5 pointer-events-none">
          <CalendarDays className="w-3.5 h-3.5 text-zinc-900" />
          <span>Fechas fijas</span>
        </div>
      </div>

      <CardContent className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-[17px] text-foreground line-clamp-1 group-hover:text-zinc-900 transition-colors duration-200 leading-snug">
          {plan.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{plan.location}</span>
        </div>

        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed mt-2">
          {plan.shortDescription}
        </p>

        {/* Duration + departure calendar */}
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mt-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{plan.duration}</span>
          </div>
          {plan.schedule && (
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-1">{plan.schedule}</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-zinc-100 flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Desde</p>
            <p className="text-foreground font-bold text-[17px] leading-tight">
              {formatPrice(plan.price)}
              <span className="text-xs text-muted-foreground font-normal ml-1">/ persona</span>
            </p>
          </div>
          <Button
            size="sm"
            className="rounded-xl text-xs font-semibold h-9 bg-zinc-900 hover:bg-black text-white border-none shadow-xs shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(plan.id);
            }}
          >
            Ver plan
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

/**
 * National destinations sold with a fixed departure calendar (Santander,
 * Huila, Eje Cafetero, ...). Renders every published plan flagged with
 * `fixedDeparture: true` — adding a new destination is a data change only.
 */
export function ScheduledDepartures() {
  const { navigate } = useNavigation();
  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  const handleNavigate = useCallback(
    (id: string) => navigate("plan-detail", id),
    [navigate]
  );

  const departures = plans.filter(
    (p) => p.published !== false && p.fixedDeparture
  );

  if (departures.length === 0) return null;

  return (
    <section id="salidas-programadas" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-zinc-50/60 border-y border-zinc-100 content-visibility-auto contain-intrinsic-size-auto">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Salidas Programadas"
          subtitle="Destinos nacionales con calendario de salidas definido. Elige tu fecha y viaja acompañado desde cualquier lugar de Colombia."
        />

        <div className="mt-8 flex flex-wrap justify-center gap-5 sm:gap-6">
          {departures.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
              className="w-full sm:w-[340px] flex"
            >
              <DepartureCard plan={plan} onNavigate={handleNavigate} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

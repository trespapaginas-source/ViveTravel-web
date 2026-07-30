"use client";

import { memo, useCallback } from "react";
import { Clock, MapPin, ArrowRight, Star, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatShortDuration, formatShortLocation, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { useNavigation } from "@/lib/store";
import { fetchPlans } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useSiteContent } from "@/lib/use-site-content";
import { CardImageCarousel } from "@/components/shared/card-image-carousel";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

const PlanCard = memo(function PlanCard({
  plan,
  onNavigate,
}: {
  plan: { id: string; name: string; images: string[]; category: string; duration: string; location: string; shortDescription: string; price: number; rating: number; reviewCount: number; fecha_salida?: string; maxGuests?: number };
  onNavigate: (id: string) => void;
}) {
  return (
    <Card
      className="group w-full h-full flex flex-col cursor-pointer overflow-hidden overflow-x-hidden rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 shadow-none"
      onClick={() => onNavigate(plan.id)}
    >
      {/* Image */}
      <div className="relative h-[220px] w-full">
        <CardImageCarousel images={plan.images} alt={plan.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Group-trip departure date — top left (same style as plans-list grupales) */}
        {plan.fecha_salida && (
          <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 shadow-sm border border-black/5">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-600" />
            <span>{plan.fecha_salida}</span>
          </div>
        )}

        {/* Duration badge — top right (or top left when no fecha_salida) */}
        <div className={cn(
          "absolute top-3 z-10 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[11px] font-semibold border border-white/10 shadow-sm pointer-events-none",
          plan.fecha_salida ? "right-3" : "left-3"
        )}>
          <Clock className="w-3 h-3 text-white/90" />
          <span className="text-white/90">{formatShortDuration(plan.duration)}</span>
        </div>

        {/* Limited spots badge — bottom left (group trips only) */}
        {plan.fecha_salida && plan.maxGuests && (
          <div className="absolute bottom-3 left-3 z-10 bg-zinc-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-[pulse_2s_ease-in-out_infinite] shadow-sm">
            <Users className="w-2.5 h-2.5" />
            Solo {plan.maxGuests} cupos
          </div>
        )}
      </div>

      <CardContent className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[17px] text-foreground line-clamp-2 group-hover:text-ocean transition-colors duration-200 leading-snug">
            {plan.name}
          </h3>
          {plan.rating > 0 && (
            <div className="flex items-center gap-1 text-xs font-bold text-foreground shrink-0 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
              <span>{plan.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          <span className="line-clamp-1">{formatShortLocation(plan.location)}</span>
        </div>

        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed mt-2">
          {plan.shortDescription}
        </p>

        <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
          <span className="text-zinc-900 text-[13px] font-semibold flex items-center gap-1 transition-colors duration-200 group-hover:text-black">
            Ver detalles
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
          <div className="text-right">
            <p className="text-foreground font-bold text-[17px] sm:text-[18px] leading-tight">
              {formatPrice(plan.price)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export function FeaturedPlans() {
  const { navigate } = useNavigation();
  const { content } = useSiteContent();
  const featured = content.featuredPlans;
  const { data: allPlans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  const handleNavigate = useCallback(
    (id: string) => navigate("plan-detail", id),
    [navigate]
  );

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title={featured.title}
            subtitle={featured.subtitle}
          />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-full">
                <Card className="w-full h-full flex flex-col overflow-hidden rounded-2xl shadow-none border border-zinc-100">
                  <Skeleton className="h-[220px] w-full" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-4 w-1/3 mt-4 self-end" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Featured plans are pinned by `featuredOrder` (1-based). Plans without it
  // are never featured here, regardless of their general `order`.
  const featuredPlans = allPlans
    .filter((p) => p.published !== false && typeof p.featuredOrder === "number")
    .sort((a, b) => (a.featuredOrder! - b.featuredOrder!))
    .slice(0, 6);

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 content-visibility-auto contain-intrinsic-size-auto overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={featured.title}
          subtitle={featured.subtitle}
        />

        {/* Mobile: horizontal carousel (no elastic drag, free horizontal scroll).
            Desktop: 3×2 grid. */}
        <div
          className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 overflow-x-auto sm:overflow-visible px-4 sm:px-0 -mx-4 sm:mx-0 pb-4 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain", touchAction: "pan-x" }}
        >
          {featuredPlans.map((plan, index) => {
            return (
              <motion.div
                key={`${plan.id}-${index}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: index * 0.1,
                }}
                className="shrink-0 w-[85vw] max-w-[320px] sm:w-full sm:max-w-none flex"
              >
                <PlanCard plan={plan} onNavigate={handleNavigate} />
              </motion.div>
            );
          })}
        </div>





        {/* View all plans CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("plans", null, { viewMode: "1" })}
            className="border-zinc-200 text-zinc-900 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-200 px-8 rounded-xl font-semibold shadow-xs"
          >
            {featured.viewAll}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}

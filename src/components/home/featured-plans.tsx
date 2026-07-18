"use client";

import { memo, useCallback } from "react";
import { Clock, MapPin, ArrowRight, Star } from "lucide-react";
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
  plan: { id: string; name: string; images: string[]; category: string; duration: string; location: string; shortDescription: string; price: number; rating: number; reviewCount: number };
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

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 pointer-events-none">
          <Clock className="w-3.5 h-3.5 text-white/90" />
          <span className="text-white/90 text-xs font-medium drop-shadow-sm">{formatShortDuration(plan.duration)}</span>
        </div>
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
          <span className="text-ocean text-[13px] font-semibold flex items-center gap-1 transition-colors duration-200 group-hover:text-ocean-dark">
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
          <div className="mt-8 flex sm:grid overflow-x-auto sm:overflow-visible sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 scroll-smooth pb-4 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-none w-[80vw] max-w-[290px] sm:w-auto sm:max-w-none">
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

  const featuredPlans = allPlans.filter((p) => p.published !== false).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 content-visibility-auto contain-intrinsic-size-auto overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={featured.title}
          subtitle={featured.subtitle}
        />

        <div className="flex gap-4 sm:grid overflow-x-auto sm:overflow-visible sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 scroll-smooth pb-4 sm:pb-0 px-4 sm:px-0 -mx-4 sm:mx-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory scroll-pl-4">
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
                className="flex-none w-[80vw] max-w-[290px] sm:w-auto sm:max-w-none snap-start snap-always flex sm:block"
              >
                <PlanCard plan={plan} onNavigate={handleNavigate} />
              </motion.div>
            );
          })}
        </div>

        {/* Indicador de deslizamiento horizontal en móvil */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-xs text-muted-foreground mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ocean animate-ping" />
          <span>Desliza para ver más planes</span>
        </div>



        {/* View all plans CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("plans")}
            className="border-ocean text-ocean hover:bg-ocean hover:text-white transition-colors duration-300 px-8 rounded-xl font-semibold shadow-sm"
          >
            {featured.viewAll}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}

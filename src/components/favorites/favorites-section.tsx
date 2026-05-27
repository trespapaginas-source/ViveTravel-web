"use client";

import { useNavigation } from "@/lib/store";
import { getFavorites } from "@/lib/favorites";
import { fetchCabin, fetchPlan } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Heart,
  MapPin,
  Users,
  BedDouble,
  Bath,
  ArrowRight,
  Compass,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatShortDuration, formatShortLocation } from "@/lib/utils";
import { useState, useCallback } from "react";
import { toggleFavorite } from "@/lib/favorites";
import { toast } from "sonner";
import { type Cabin, type TourPlan } from "@/lib/data";
import { getPlanExperienceSection } from "@/lib/experience-sections";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Try to fetch as cabin first, then as plan
function FavoriteItem({
  itemId,
  onRemove,
}: {
  itemId: string;
  onRemove: () => void;
}) {
  const { navigate } = useNavigation();

  // Try cabin first
  const cabinQuery = useQuery({
    queryKey: ["cabin", itemId],
    queryFn: () => fetchCabin(itemId),
    enabled: !!itemId,
  });

  // Try plan if cabin didn't load
  const planQuery = useQuery({
    queryKey: ["plan", itemId],
    queryFn: () => fetchPlan(itemId),
    enabled: !!itemId && !cabinQuery.data,
  });

  const cabin = cabinQuery.data;
  const plan = planQuery.data;
  const isLoading = cabinQuery.isLoading || (!cabin && planQuery.isLoading);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleFavorite(itemId);
      onRemove();
      toast.success("Eliminado de tu colección");
    },
    [itemId, onRemove]
  );

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 py-0 gap-0">
        <div className="aspect-video bg-muted animate-pulse" />
        <CardContent className="p-4 space-y-3">
          <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (cabin) {
    return (
      <FavoriteCabinCard
        cabin={cabin}
        onRemove={handleRemove}
        onSelect={() => navigate("cabin-detail", cabin.id)} />
    );
  }

  if (plan) {
    return (
      <FavoritePlanCard
        plan={plan}
        onRemove={handleRemove}
        onSelect={() => navigate("plan-detail", plan.id)} />
    );
  }

  return null;
}

function FavoriteCabinCard({
  cabin,
  onSelect,
  onRemove,
}: {
  cabin: Cabin;
  onSelect: () => void;
  onRemove: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="overflow-hidden cursor-pointer group border-border/50 hover:border-ocean/20 hover:shadow-lg transition-all duration-300 py-0 gap-0"
        onClick={onSelect}
      >
        <div className="relative aspect-[3/2] overflow-hidden">
          <img             src={cabin.images[0]}
            alt={cabin.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
           onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <button
            onClick={onRemove}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-105 transition-all duration-200 min-w-[32px] min-h-[32px]"
            aria-label="Eliminar de favoritos"
          >
            <Heart className="w-3.5 h-3.5 fill-indigo text-indigo" />
          </button>
          {/* Type badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ocean/80 text-white backdrop-blur-sm">
              Cabaña
            </span>
          </div>
        </div>

        <CardContent className="p-3.5 sm:p-4 space-y-2">
          <div>
            <h3 className="font-bold text-[17px] text-foreground group-hover:text-ocean transition-colors line-clamp-1 leading-snug">
              {cabin.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="w-3 h-3 shrink-0 text-muted-foreground" />
              <span className="line-clamp-1">{cabin.location}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {cabin.shortDescription}
          </p>

          <div className="flex items-center gap-0 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{cabin.capacity}</span>
            </div>
            <span className="mx-1.5 text-muted-foreground">·</span>
            <div className="flex items-center gap-1">
              <BedDouble className="w-3 h-3" />
              <span>{cabin.bedrooms} hab.</span>
            </div>
            <span className="mx-1.5 text-muted-foreground">·</span>
            <div className="flex items-center gap-1">
              <Bath className="w-3 h-3" />
              <span>{cabin.bathrooms} baño{cabin.bathrooms > 1 ? "s" : ""}</span>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2 border-t border-border/30 mt-2">
            <div className="text-right">
              <p className="text-foreground font-bold text-[15px] sm:text-[17px] leading-tight">
                <span className="text-[11px] sm:text-[13px] font-normal text-muted-foreground mr-1">Desde</span>
                {formatPrice(cabin.pricePerNight)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FavoritePlanCard({
  plan,
  onSelect,
  onRemove,
}: {
  plan: TourPlan;
  onSelect: () => void;
  onRemove: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="overflow-hidden cursor-pointer group border-border/50 hover:border-ocean/20 hover:shadow-lg transition-all duration-300 py-0 gap-0"
        onClick={onSelect}
      >
        <div className="relative aspect-[3/2] overflow-hidden">
          <img             src={plan.images[0]}
            alt={plan.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
           onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <button
            onClick={onRemove}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-105 transition-all duration-200 min-w-[32px] min-h-[32px]"
            aria-label="Eliminar de favoritos"
          >
            <Heart className="w-3.5 h-3.5 fill-indigo text-indigo" />
          </button>
          {/* Type badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ocean/80 text-white backdrop-blur-sm">
              Plan
            </span>
          </div>

        </div>

        <CardContent className="p-3.5 sm:p-4 space-y-2">
          <div>
            <h3 className="font-bold text-[17px] text-foreground group-hover:text-ocean transition-colors line-clamp-1 leading-snug">
              {plan.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="w-3 h-3 shrink-0 text-muted-foreground" />
              <span className="line-clamp-1">{formatShortLocation(plan.location)}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {plan.shortDescription}
          </p>

          <div className="flex items-center gap-0 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatShortDuration(plan.duration)}</span>
            </div>
            {getPlanExperienceSection(plan) === "grupales" && (
              <>
                <span className="mx-1.5 text-muted-foreground">·</span>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Máx. {plan.maxGuests}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-end pt-2 border-t border-border/30 mt-2">
            <div className="text-right">
              <p className="text-foreground font-bold text-[15px] sm:text-[17px] leading-tight">
                {formatPrice(plan.price)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function FavoritesSection() {
  const { navigate } = useNavigation();
  const [favIds, setFavIds] = useState<string[]>(() =>
    typeof window !== "undefined" ? getFavorites() : []
  );

  const handleRemove = useCallback(() => {
    setFavIds(getFavorites());
  }, []);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="Tu Colección"
            subtitle="Tus planes y cabañas favoritos guardados para comparar y encontrar tu escapada ideal." />
        </motion.div>

        {favIds.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
              <Compass className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1.5">
              Tu colección está vacía
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Explora nuestras experiencias, viajes y cabañas y guarda lo que más te guste tocando el ícono de corazón.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => navigate("plans", "pasadias")}
                className="bg-ocean hover:bg-ocean-dark text-white rounded-full px-8 gap-2"
              >
                Explorar experiencias
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigate("cabins")}
                variant="outline"
                className="border-ocean text-ocean hover:bg-ocean hover:text-white rounded-full px-8 gap-2"
              >
                Explorar cabañas
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {favIds.map((id) => (
                <FavoriteItem
                  key={id}
                  itemId={id}
                  onRemove={handleRemove} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

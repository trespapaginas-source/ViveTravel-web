"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { pastTripImages as fallbackTrips } from "@/lib/data";
import { useSiteContent } from "@/lib/use-site-content";
import { useQuery } from "@tanstack/react-query";
import { fetchTripImages } from "@/lib/api";

export function TravelCarousel() {
  const { content } = useSiteContent();
  const carousel = content.carousel;

  const { data: pastTripImages = fallbackTrips } = useQuery({
    queryKey: ["trip-images"],
    queryFn: fetchTripImages,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/30 content-visibility-auto contain-intrinsic-size-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={carousel.title}
          subtitle={carousel.subtitle} />

        <div className="relative">
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 sm:-ml-5">
              {pastTripImages.map((trip) => (
                <div
                  key={trip.id}
                  className="flex-[0_0_70%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 pl-4 sm:pl-5"
                >
                  <div className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer">

                    <img                       src={trip.url}
                      alt={trip.caption}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                     onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Caption on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white/60 text-xs font-medium mb-0.5">
                        {carousel.brandHover}
                      </p>
                      <p className="text-white text-sm font-medium leading-snug">
                        {trip.caption}
                      </p>
                    </div>

                    {/* Always-visible caption badge */}
                    <div className="absolute bottom-3 left-3 right-3 group-hover:opacity-0 transition-opacity duration-300">
                      <p className="text-white text-xs sm:text-sm font-medium bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 truncate">
                        {trip.caption}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-4 z-10 bg-white hover:bg-ocean hover:text-white text-foreground shadow-lg rounded-full p-2.5 sm:p-3 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-4 z-10 bg-white hover:bg-ocean hover:text-white text-foreground shadow-lg rounded-full p-2.5 sm:p-3 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-6 sm:gap-12">
          {carousel.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

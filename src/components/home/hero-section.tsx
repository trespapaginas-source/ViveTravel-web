"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { MapPin, Palmtree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/lib/store";
import { heroImages as fallbackHero } from "@/lib/data";
import { useSiteContent } from "@/lib/use-site-content";
import { useQuery } from "@tanstack/react-query";
import { fetchHeroImages } from "@/lib/api";

export function HeroSection() {
  const { navigate } = useNavigation();
  const { content } = useSiteContent();
  const hero = content.hero;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: heroImages = fallbackHero } = useQuery({
    queryKey: ["hero-images"],
    queryFn: fetchHeroImages,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setTimeout(() => onSelect(), 0);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full h-[60vh] min-h-[480px] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Embla Carousel */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {heroImages.map((image, index) => (
            <div key={image.id} className="flex-[0_0_100%] min-w-0 relative h-full">
              <img                 src={image.url}
                alt={image.caption}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                sizes="100vw"
                className="w-full h-full object-cover"
               onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 z-10" />

      {/* Navigation arrows removed */}

      {/* Content — CSS animation instead of framer-motion */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 animate-in fade-in duration-500" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
            <Palmtree className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-sm sm:text-base font-medium tracking-wider uppercase">
              {hero.brandLabel}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.28)" }}>
            {hero.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-ocean-light">
              {hero.titleHighlight}
            </span>
          </h1>

          <p className="text-white/80 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed">
            {hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: "500ms", animationFillMode: "both" }}>
            <Button
              size="lg"
              onClick={() => navigate("plans")}
              className="bg-ocean hover:bg-ocean-dark text-white px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-lg rounded-xl shadow-lg shadow-ocean/30 transition-all duration-200 hover:scale-105 min-h-[44px]"
            >
              <MapPin className="w-5 h-5 mr-2" />
              {hero.ctaPlans}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("contact")}
              className="border-white/40 text-white hover:bg-white/15 backdrop-blur-sm px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-lg rounded-xl transition-all duration-200 hover:scale-105 bg-transparent gap-2 min-h-[44px]"
            >
              <Palmtree className="w-5 h-5" />
              {hero.ctaCabins}
            </Button>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-1">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`p-2.5 transition-all duration-300 rounded-full ${
              index === selectedIndex
                ? ""
                : ""
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          >
            <span className={`block rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "w-6 h-2 bg-ocean-light"
                : "w-2 h-2 bg-white/50 hover:bg-white/70"
            }`} />
          </button>
        ))}
      </div>

      {/* Caption removed */}
    </section>
  );
}

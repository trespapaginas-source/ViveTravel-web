"use client";

import { ArrowRight } from "lucide-react";
import { useNavigation } from "@/lib/store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/lib/use-site-content";

export function InternationalDestinations() {
  const { navigate } = useNavigation();
  const { content } = useSiteContent();
  const international = content.international;
  const destinations = international.destinations || [];

  return (
    <section className="py-16 sm:py-20 lg:py-24 content-visibility-auto contain-intrinsic-size-auto overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            {international.title}{" "}
            <span className="text-ocean">{international.titleHighlight}</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            {international.subtitle}
          </p>
        </div>

        {/* Mobile: horizontal carousel (no elastic drag, free horizontal scroll).
            Desktop: 3×2 grid. */}
        <div
          className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 overflow-x-auto sm:overflow-visible px-4 sm:px-0 -mx-4 sm:mx-0 pb-4 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain", touchAction: "pan-x" }}
        >
          {destinations.map((destination, index) => {
            return (
              <motion.article
                key={`${destination.name}-${index}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: index * 0.1,
                }}
                className="group relative shrink-0 w-[80vw] max-w-[290px] sm:w-auto sm:max-w-none h-[400px] sm:h-auto sm:aspect-[4/5] overflow-hidden overflow-x-hidden rounded-3xl cursor-pointer bg-muted border border-zinc-100"
                onClick={() => navigate("plans", "internacionales", { viewMode: "1" })}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80";
                    e.currentTarget.onerror = null;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 flex flex-col justify-end">
                  <p className="text-white/90 text-sm font-medium mb-2 drop-shadow-sm">
                    {destination.eyebrow}
                  </p>
                  <h3 className="text-white text-3xl sm:text-4xl font-bold leading-tight drop-shadow-sm">
                    {destination.name}
                  </h3>
                  {destination.description && (
                    <p className="text-white/80 text-xs sm:text-sm mt-2 line-clamp-3 sm:line-clamp-4 drop-shadow-sm">
                      {destination.description}
                    </p>
                  )}
                  <div className="mt-5 inline-flex items-center self-start gap-2 rounded-full bg-white/20 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-white border border-white/30 transition-colors duration-300 group-hover:bg-white group-hover:text-ocean">
                    Ver destino
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
}


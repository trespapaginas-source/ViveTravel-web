"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigation } from "@/lib/store";
import { useSiteContent } from "@/lib/use-site-content";

interface Destination {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

const cardVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

function DestinationCard({
  destination,
  index,
  onNavigate,
}: {
  destination: Destination;
  index: number;
  onNavigate: () => void;
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="group relative w-full overflow-hidden cursor-pointer"
      onClick={onNavigate}
    >
      {/* Image */}
      <div className="relative h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px]">
        <img           src={destination.image}
          alt={destination.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
         onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10 group-hover:from-black/70 group-hover:via-black/30 transition-all duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide drop-shadow-lg">
            {destination.title}
          </h3>
          <p className="text-white/80 text-sm sm:text-base mt-2 max-w-md drop-shadow-md">
            {destination.subtitle}
          </p>

          {/* Hover CTA */}
          <div className="mt-4 flex items-center gap-2 text-white/0 group-hover:text-white/90 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="text-sm font-medium">Explorar</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Bottom line accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-ocean scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </motion.div>
  );
}

export function DestinationsGallery() {
  const { navigate } = useNavigation();
  const { content } = useSiteContent();
  const gallery = content.gallery;

  return (
    <section className="py-16 sm:py-20 lg:py-24 content-visibility-auto contain-intrinsic-size-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            {gallery.title}{" "}
            <span className="text-ocean">{gallery.titleHighlight}</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            {gallery.subtitle}
          </p>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {gallery.destinations.map((dest, i) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              index={i}
              onNavigate={() => navigate("plans", "nacionales")} />
          ))}
        </div>
      </div>
    </section>
  );
}

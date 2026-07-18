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
      className="group relative w-full h-[280px] sm:h-[320px] md:h-[360px] overflow-hidden rounded-3xl cursor-pointer bg-muted border border-zinc-100"
      onClick={onNavigate}
    >
      <img
        src={destination.image}
        alt={destination.title}
        loading="lazy"
        decoding="async"
        sizes="(max-width: 640px) 100vw, 50vw"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 flex flex-col justify-end">
        <h3 className="text-white text-2xl sm:text-3xl font-bold leading-tight drop-shadow-sm">
          {destination.title}
        </h3>
        <p className="text-white/80 text-sm mt-2 drop-shadow-sm">
          {destination.subtitle}
        </p>
        <div className="mt-4 inline-flex items-center self-start gap-2 rounded-full bg-white/20 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-white border border-white/30 transition-colors duration-300 group-hover:bg-white group-hover:text-ocean">
          Ver destino
          <ArrowRight className="w-4 h-4" />
        </div>
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

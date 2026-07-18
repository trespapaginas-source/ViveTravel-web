"use client";

import { cn } from "@/lib/utils";

interface PageBannerProps {
  /** Eyebrow label shown above the title (e.g. "Alojamientos", "Experiencias"). */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Background image URL. Should be a wide, high-quality landscape photo. */
  image: string;
  /** Fallback image if the primary fails to load. */
  fallbackImage?: string;
  /** Extra classes for the root element. */
  className?: string;
}

/**
 * Full-width section banner with a clean background photo (no overlay) and a
 * white title rendered with a drop-shadow for legibility over any image.
 *
 * Editorial style (Airbnb/Booking-like): the photo speaks, the text floats.
 * Height is contained (~160px mobile / ~340px desktop) so it doesn't push the
 * content too far down; mobile uses a slimmer, more delicate treatment.
 */
export function PageBanner({
  eyebrow,
  title,
  subtitle,
  image,
  fallbackImage,
  className,
}: PageBannerProps) {
  return (
    <section
      className={cn(
        "relative w-full h-[160px] sm:h-[300px] lg:h-[340px] overflow-hidden",
        "flex items-end",
        className
      )}
    >
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          if (fallbackImage) {
            e.currentTarget.src = fallbackImage;
            e.currentTarget.onerror = null;
          }
        }}
      />

      {/* Text content */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 pb-3.5 sm:pb-10 lg:pb-12">
        <div className="max-w-7xl mx-auto">
          {eyebrow && (
            <p
              className="text-[9px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-white/90 mb-1 sm:mb-1.5"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
            >
              {eyebrow}
            </p>
          )}
          <h1
            className="text-xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight sm:leading-[1.05]"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.45)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="mt-1 sm:mt-2.5 text-xs sm:text-base text-white/90 max-w-2xl leading-snug sm:leading-relaxed line-clamp-1 sm:line-clamp-none"
              style={{ textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

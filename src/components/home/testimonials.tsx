"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { testimonials as fallbackTestimonials } from "@/lib/data";
import { useSiteContent } from "@/lib/use-site-content";
import { useQuery } from "@tanstack/react-query";
import { fetchTestimonials } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}

interface TestimonialCardProps {
  testimonial: typeof fallbackTestimonials[0];
}

function TestimonialCard({ testimonial: t }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-200 transition-all duration-300 flex flex-col justify-between h-[210px] w-[290px] sm:w-[320px] shrink-0 select-none">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            {t.avatarUrl ? (
              <img
                src={t.avatarUrl}
                alt={`Foto de ${t.name}`}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-xs border border-slate-100"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 shadow-xs"
                style={{ backgroundColor: t.avatarBg || "#1a73e8" }}
              >
                {t.avatar}
              </div>
            )}

            <div>
              <h4 className="font-semibold text-slate-800 text-[13px] sm:text-[14px] leading-tight line-clamp-1">
                {t.name}
              </h4>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {t.location}
              </span>
            </div>
          </div>

          <GoogleIcon />
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-2.5">
          {Array.from({ length: t.rating || 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0"
            />
          ))}
        </div>

        {/* Review Text */}
        <blockquote className="text-slate-600 text-[12.5px] sm:text-[13px] leading-relaxed line-clamp-4">
          &ldquo;{t.text}&rdquo;
        </blockquote>
      </div>
    </div>
  );
}

export function Testimonials() {
  const { content } = useSiteContent();
  const testConfig = content.testimonials;

  const { data: testimonials = fallbackTestimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });

  // Mobile index state
  const [mobileIdx, setMobileIdx] = useState(0);

  const nextMobile = useCallback(() => {
    setMobileIdx((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevMobile = useCallback(() => {
    setMobileIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-slide on mobile
  useEffect(() => {
    const timer = setInterval(() => {
      nextMobile();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextMobile]);

  // Handle marquee items duplication for seamless infinite looping
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <SectionHeader
          title={testConfig.title}
          subtitle={testConfig.subtitle}
        />
      </div>

      {/* ── Desktop & Tablet View: Infinite Marquee ── */}
      <div className="hidden md:block relative w-full overflow-hidden py-4 select-none">
        {/* Left fade gradient overlay */}
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        {/* Right fade gradient overlay */}
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-5 px-4">
          {marqueeItems.map((t, idx) => (
            <TestimonialCard key={`${t.id}-marquee-${idx}`} testimonial={t} />
          ))}
        </div>
      </div>

      {/* ── Mobile View: 1-Card Looping Carousel Slider ── */}
      <div className="md:hidden px-4 select-none">
        <div className="max-w-md mx-auto flex flex-col items-center">
          {/* Card Slider wrapper */}
          <div className="relative w-full h-[210px] overflow-hidden flex justify-center items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileIdx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="absolute"
              >
                <TestimonialCard testimonial={testimonials[mobileIdx]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-6 mt-6">
            <button
              onClick={prevMobile}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              aria-label="Reseña anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-500 min-w-[40px] text-center">
              {mobileIdx + 1} / {testimonials.length}
            </span>
            <button
              onClick={nextMobile}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              aria-label="Siguiente reseña"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

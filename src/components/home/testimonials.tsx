"use client";

import { Star } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { testimonials as fallbackTestimonials } from "@/lib/data";
import { useSiteContent } from "@/lib/use-site-content";
import { useQuery } from "@tanstack/react-query";
import { fetchTestimonials } from "@/lib/api";

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

export function Testimonials() {
  const { content } = useSiteContent();
  const testConfig = content.testimonials;

  const { data: testimonials = fallbackTestimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 content-visibility-auto contain-intrinsic-size-auto">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title={testConfig.title}
          subtitle={testConfig.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar image or dynamic background fallback */}
                    {t.avatarUrl ? (
                      <img
                        src={t.avatarUrl}
                        alt={`Foto de ${t.name}`}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow-sm border border-slate-100"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: t.avatarBg || "#1a73e8" }}
                      >
                        {t.avatar}
                      </div>
                    )}

                    {/* Name & Date */}
                    <div>
                      <h4 className="font-semibold text-slate-800 text-[14px] leading-tight line-clamp-1 hover:underline cursor-pointer animate-none">
                        {t.name}
                      </h4>
                      <span className="text-[12px] text-slate-400 block mt-0.5">
                        {t.location}
                      </span>
                    </div>
                  </div>

                  {/* Google Icon */}
                  <GoogleIcon />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="text-slate-600 text-[13.5px] leading-relaxed whitespace-pre-line">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
              </div>


            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

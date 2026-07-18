"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/lib/use-site-content";
import { defaultSiteContent } from "@/lib/content-defaults";

export function PromotionsBanner() {
  const { content } = useSiteContent();
  const [currentIndex, setCurrentIndex] = useState(0);

  const promotions = content.promotions || defaultSiteContent.promotions;
  const banners = promotions.banners || [];
  const valueCards = promotions.valueCards || [];

  // Dynamic WhatsApp details
  const whatsappNumber = content.contact?.whatsapp || "573001234567";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hola,%20quiero%20conocer%20las%20promociones%20y%20descuentos%20de%20temporada`;

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section className="pt-6 pb-2 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Carousel Container */}
        <div className="relative group rounded-3xl overflow-hidden shadow-md border border-zinc-200 h-[119px] sm:h-auto sm:aspect-[2560/675] bg-zinc-50">
          {/* Slides */}
          <div className="w-full h-full relative">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={cn(
                  "absolute inset-0 w-full h-full transition-all duration-700 ease-in-out",
                  index === currentIndex 
                    ? "opacity-100 z-10 pointer-events-auto visible" 
                    : "opacity-0 z-0 pointer-events-none invisible"
                )}
              >
                <img
                  src={banner.url}
                  alt={banner.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                aria-label="Anterior promoción"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                aria-label="Siguiente promoción"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Indicators / Dots */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all duration-200 cursor-pointer",
                      index === currentIndex ? "bg-indigo-600 w-5 sm:w-6" : "bg-white/60 hover:bg-white"
                    )}
                    aria-label={`Ir a promoción ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Row of 3 Overlapping White Cards (Hidden on mobile, visible on desktop) */}
        <div className="hidden md:block relative z-20 -mt-8 max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white py-2.5 px-4 rounded-2xl border border-zinc-200/80 shadow-md flex items-center gap-3 hover:border-zinc-300 transition-all duration-200">
              <div className="p-1.5 bg-indigo-50 rounded-xl text-indigo-600 shrink-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="3" className="fill-indigo-500/10 stroke-indigo-600" strokeWidth="2" />
                  <line x1="2" y1="10" x2="22" y2="10" className="stroke-indigo-600" strokeWidth="2" />
                  <rect x="5" y="14" width="4" height="2" rx="0.5" className="fill-indigo-600" />
                  <circle cx="15" cy="15" r="1.5" className="fill-indigo-600/60" />
                  <circle cx="17" cy="15" r="1.5" className="fill-indigo-600" />
                </svg>
              </div>
              <div className="text-left min-w-0">
                <h3 className="font-bold text-zinc-800 text-[13px] md:text-sm leading-tight mb-0.5 truncate">
                  {valueCards[0]?.title || "Promos y medios de pago"}
                </h3>
                <p className="text-zinc-500 text-[11px] leading-normal line-clamp-2">
                  {valueCards[0]?.description || "Cuotas con tarjetas de crédito, transferencias y facilidades de pago."}
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white py-2.5 px-4 rounded-2xl border border-zinc-200/80 shadow-md flex items-center gap-3 hover:border-zinc-300 transition-all duration-200">
              <div className="p-1.5 bg-indigo-50 rounded-xl text-indigo-600 shrink-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.5 2h5A1.5 1.5 0 0 1 16 3.5v1.62a1 1 0 0 0 .29.71l5.59 5.59a1.5 1.5 0 0 1 0 2.12l-6.38 6.38a1.5 1.5 0 0 1-2.12 0l-5.59-5.59a1 1 0 0 0-.71-.29H5.5A1.5 1.5 0 0 1 4 12.5v-9A1.5 1.5 0 0 1 5.5 2z" className="fill-indigo-500/10 stroke-indigo-600" strokeWidth="2" />
                  <circle cx="8.5" cy="6.5" r="1.5" className="fill-indigo-600" />
                  <line x1="14" y1="10" x2="10" y2="14" className="stroke-indigo-600" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="10.5" cy="11" r="0.75" className="fill-indigo-600" />
                  <circle cx="13.5" cy="13" r="0.75" className="fill-indigo-600" />
                </svg>
              </div>
              <div className="text-left min-w-0">
                <h3 className="font-bold text-zinc-800 text-[13px] md:text-sm leading-tight mb-0.5 truncate">
                  {valueCards[1]?.title || "Beneficios y promociones"}
                </h3>
                <p className="text-zinc-500 text-[11px] leading-normal line-clamp-2">
                  {valueCards[1]?.description || "Acumula beneficios y aprovecha todas las promociones 2x1 activas."}
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white py-2.5 px-4 rounded-2xl border border-zinc-200/80 shadow-md flex items-center gap-3 hover:border-zinc-300 transition-all duration-200 group text-left cursor-pointer"
            >
              <div className="p-1.5 bg-indigo-50 rounded-xl text-indigo-600 shrink-0 group-hover:bg-indigo-100 transition-colors flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 21a6 6 0 0 0-12 0" className="stroke-indigo-600" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="10" r="4" className="fill-indigo-500/10 stroke-indigo-600" strokeWidth="2" />
                  <path d="M8.5 10c0-3.5 2-4.5 3.5-4.5s3.5 1 3.5 4.5" className="stroke-indigo-600" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="7" y="8.5" width="1.5" height="3" rx="0.75" className="fill-indigo-600" />
                  <rect x="15.5" y="8.5" width="1.5" height="3" rx="0.75" className="fill-indigo-600" />
                  <path d="M16 11c0 2-2 3-3.5 3" className="stroke-indigo-600" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-left min-w-0 flex-1">
                <h3 className="font-bold text-zinc-800 text-[13px] md:text-sm leading-tight mb-0.5 truncate group-hover:text-indigo-600 transition-colors font-medium">
                  {valueCards[2]?.title || "Mi agente Vive Travel"}
                </h3>
                <p className="text-zinc-500 text-[11px] leading-normal line-clamp-2">
                  {valueCards[2]?.description || "Asesoría personalizada por WhatsApp o llamada con nuestros agentes."}
                </p>
              </div>
            </a>

          </div>
        </div>

      </div>
    </section>
  );
}

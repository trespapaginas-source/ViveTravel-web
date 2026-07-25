"use client";

import { ArrowDownRight, PackageCheck, Sparkles, Users, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const TICKER_ITEMS = [
  { label: "PAQUETES TODO INCLUIDO", icon: PackageCheck },
  { label: "VIAJES 2x1", icon: Sparkles },
  { label: "VIAJES GRUPALES INCREÍBLES", icon: Users },
  { label: "ARMA TU COMBO", icon: Compass },
];

export function TickerRibbon() {
  // Repeat items 4 times to ensure seamless infinite scrolling loop
  const repeatedItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <section className="relative w-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white border-y border-zinc-800/80 shadow-md py-3 sm:py-3.5 overflow-hidden select-none z-10">
      {/* Subtle background glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

      <div className="flex w-max animate-marquee whitespace-nowrap">
        {repeatedItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3 sm:gap-4 mx-4 sm:mx-6 shrink-0">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-white/80 shrink-0" />
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-white/95 drop-shadow-xs font-sans">
                  {item.label}
                </span>
              </div>
              
              {/* Separator Arrow */}
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-white/70 ml-1">
                <ArrowDownRight className="w-3.5 h-3.5 -rotate-45" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

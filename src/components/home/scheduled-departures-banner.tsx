"use client";

export function ScheduledDeparturesBanner() {
  return (
    <section className="relative w-full overflow-hidden py-6 sm:py-8 md:py-10 my-3 border-y border-zinc-200/80 shadow-xs">
      {/* Background Image - Clean Sky & Airplane */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/sky-banner-bg.jpg"
          alt="Cielo y Avión - Salidas Programadas Vive Travel"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.currentTarget.src = "/images/sky-banner-bg.png";
            e.currentTarget.onerror = null;
          }}
        />
      </div>

      {/* Light subtle shadow gradient overlay for text readability without obscuring the sky */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50 z-10" />

      {/* Content Container - Compact & Sleek */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center">
        {/* Headline */}
        <h2 
          className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight sm:leading-snug drop-shadow-md"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
        >
          Tu próximo viaje ya tiene fecha confirmada
        </h2>

        {/* Subtitle */}
        <p 
          className="text-white/95 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed mt-1.5 font-medium drop-shadow-sm"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
        >
          Viaja en grupo con itinerario 100% organizado, guías acompañantes y la tranquilidad de tener todo listo desde Colombia.
        </p>
      </div>
    </section>
  );
}

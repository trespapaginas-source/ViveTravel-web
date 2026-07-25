"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTransports } from "@/lib/api";
import Link from "next/link";
import { PageBanner } from "@/components/shared/page-banner";
import {
  ShieldCheck,
  Sparkles,
  Clock,
  Users,
  PhoneCall,
  ArrowLeft,
  Navigation,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigation } from "@/lib/store";
import { WHATSAPP_NUMBER } from "@/lib/config";

const pillarsInfo = [
  {
    icon: ShieldCheck,
    title: "Seguridad y Confianza",
    description: "Conductores profesionales y vehículos en excelente estado mecánico y estético.",
  },
  {
    icon: Sparkles,
    title: "Confort y Comodidad",
    description: "Viaja con comodidad en vehículos modernos, amplios y completamente climatizados.",
  },
  {
    icon: Clock,
    title: "Puntualidad Garantizada",
    description: "Nos comprometemos con tu tiempo y tu tranquilidad. Llegamos siempre a tiempo.",
  },
  {
    icon: PhoneCall,
    title: "Atención Personalizada",
    description: "Servicios adaptados a tus necesidades, horarios y paradas específicas en la ruta.",
  },
  {
    icon: Navigation,
    title: "Disponibilidad 24/7",
    description: "Estamos listos para llevarte cuando y donde lo necesites. Operamos todo el día.",
  },
];

export function TransportsView() {
  const { navigate } = useNavigation();
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["transports"],
    queryFn: fetchTransports,
  });

  const handleWhatsAppRedirect = (vehicleName: string) => {
    const message = [
      `🌴 *CONSULTA DE TRANSPORTE VIVE TRAVEL*`,
      ``,
      `📋 *Servicio:* Transporte Privado`,
      `🚘 *Vehículo solicitado:* ${vehicleName}`,
      `📍 *Ciudades de operación:* Barranquilla y Cartagena`,
      ``,
      `Hola, me gustaría cotizar un servicio de transporte privado para un traslado en ${vehicleName}. ¿Podrían brindarme información de tarifas y disponibilidad?`,
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50/70 min-h-screen">
      <PageBanner
        eyebrow="Transporte privado"
        title="Tu destino, nuestro compromiso"
        subtitle="Servicio de transporte privado con la mejor atención, comodidad y puntualidad. Te llevamos a donde necesites en Barranquilla, Cartagena y el Caribe."
        image="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&h=600&fit=crop"
        fallbackImage="/images/carretera-colombia.jpg"
      />

      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* Back Button */}
        <button
          onClick={() => navigate("home")}
          className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al inicio</span>
        </button>

        {/* Fleet Vehicles Grid */}
        <section className="space-y-8">
          <div className="border-b border-slate-200/80 pb-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Nuestros Vehículos
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal mt-1">
              Elige la opción que mejor se adapte al tamaño de tu grupo y necesidades de viaje.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image Section */}
                  <Link href={`/transporte/${vehicle.id}`} className="block relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-xs text-white font-semibold text-xs">
                        <Users className="w-3.5 h-3.5 text-slate-300" />
                        {vehicle.capacity}
                      </span>
                    </div>
                  </Link>

                  {/* Content Section */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <Link href={`/transporte/${vehicle.id}`} className="block">
                        <h3 className="text-xl font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                          {vehicle.name}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {vehicle.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Características
                      </span>
                      <ul className="space-y-1.5">
                        {vehicle.features.slice(0, 3).map((feat, fidx) => (
                          <li key={fidx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-2 space-y-4">
                  <div className="flex justify-between items-baseline pt-4">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tarifa base desde</span>
                    <span className="text-lg font-semibold text-slate-900">{vehicle.priceRange}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/transporte/${vehicle.id}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors"
                    >
                      <span>Detalles</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                    <button
                      onClick={() => handleWhatsAppRedirect(vehicle.name)}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <span>Cotizar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pillars Section (Open Clean Centered Layout) */}
        <section className="space-y-10 pt-10 border-t border-slate-200/80 text-center">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Nuestro Compromiso de Servicio
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal">
              Viaja seguro, cómodo y sin preocupaciones con las garantías de calidad de Vive Travel.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-10 gap-y-10 pt-2 max-w-5xl mx-auto">
            {pillarsInfo.map((pillar, idx) => (
              <div key={idx} className="space-y-3 text-center flex flex-col items-center max-w-xs w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-slate-200/70 flex items-center justify-center text-slate-700">
                  <pillar.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-base text-slate-900">
                    {pillar.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action (Open Clean Section - NO BOX CARD) */}
        <section className="pt-10 border-t border-slate-200/80 text-center space-y-4 max-w-xl mx-auto pb-4">
          <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">¿Listo para cotizar tu servicio de transporte?</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Indícanos tu fecha de viaje, número de pasajeros y ruta requerida en Barranquilla, Cartagena o la región Caribe. Te responderemos de inmediato con una tarifa a tu medida.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleWhatsAppRedirect("Flota Completa")}
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>Consultar disponibilidad</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}


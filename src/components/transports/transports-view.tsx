"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTransports } from "@/lib/api";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageBanner } from "@/components/shared/page-banner";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Users, 
  MapPin, 
  PhoneCall, 
  ArrowLeft,
  Navigation,
  ArrowRight
} from "lucide-react";
import { useNavigation } from "@/lib/store";
import { WHATSAPP_NUMBER } from "@/lib/config";

// Icons for the 5 service pillars
const pillarIcons = [
  <ShieldCheck key="shield" className="w-8 h-8 text-ocean" />,
  <Sparkles key="sparkles" className="w-8 h-8 text-ocean" />,
  <Clock key="clock" className="w-8 h-8 text-ocean" />,
  <PhoneCall key="phone" className="w-8 h-8 text-ocean" />,
  <Navigation key="nav" className="w-8 h-8 text-ocean" />
];

const pillarsInfo = [
  {
    title: "Seguridad y Confianza",
    description: "Conductores profesionales y vehículos en excelente estado mecánico y estético.",
  },
  {
    title: "Confort y Comodidad",
    description: "Viaja con comodidad en vehículos modernos, amplios y completamente climatizados.",
  },
  {
    title: "Puntualidad Garantizada",
    description: "Nos comprometemos con tu tiempo y tu tranquilidad. Llegamos siempre a tiempo.",
  },
  {
    title: "Atención Personalizada",
    description: "Servicios adaptados a tus necesidades, horarios y paradas específicas en la ruta.",
  },
  {
    title: "Disponibilidad 24/7",
    description: "Estamos listos para llevarte cuando y donde lo necesites. Operamos todo el día.",
  }
];

export function TransportsView() {
  const { navigate } = useNavigation();
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["transports"],
    queryFn: fetchTransports
  });

  const handleWhatsAppRedirect = (vehicleName: string) => {
    const message = [
      `🌴 *CONSULTA DE TRANSPORTE VIVE TRAVEL*`,
      ``,
      `📋 *Servicio:* Transporte Privado`,
      `🚘 *Vehículo solicitado:* ${vehicleName}`,
      `📍 *Ciudades de operación:* Barranquilla y Cartagena`,
      ``,
      `Hola, me gustaría cotizar un servicio de transporte privado para un traslado en ${vehicleName}. ¿Podrían brindarme información de tarifas y disponibilidad?`
    ].join("\n");
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-ocean border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <PageBanner
        eyebrow="Transporte privado"
        title="Tu destino, nuestro compromiso"
        subtitle="Servicio de transporte privado con la mejor atención, comodidad y puntualidad. Te llevamos a donde necesites, cuando lo necesites."
        image="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&h=600&fit=crop"
        fallbackImage="/images/carretera-colombia.jpg"
      />
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28 lg:pb-16">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("home")}
        className="flex gap-2 mb-8 -ml-2 text-muted-foreground hover:text-foreground w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al inicio
      </Button>

      {/* Fleet Vehicles Grid */}
      <div className="space-y-8 mb-16">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            Nuestros Vehículos
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            Elige la opción que mejor se adapte al tamaño de tu grupo y necesidades de viaje.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, idx) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="flex"
            >
              <Card className="rounded-[2rem] border-border/50 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col w-full">
                {/* Image Section */}
                <div className="h-48 sm:h-52 relative overflow-hidden bg-muted">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop"; }}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-ocean/90 backdrop-blur-sm text-white font-bold text-xs px-3 py-1 border-0 rounded-full flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {vehicle.capacity}
                    </Badge>
                  </div>
                </div>

                {/* Content Section */}
                <CardContent className="p-6 flex-1 flex flex-col space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-foreground">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {vehicle.description}
                    </p>
                  </div>

                  <Separator className="bg-zinc-100" />

                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">Características</p>
                    <ul className="space-y-1.5 pt-1">
                      {vehicle.features.slice(0, 3).map((feat, fidx) => (
                        <li key={fidx} className="flex items-start gap-2 text-xs text-muted-foreground leading-snug">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator className="bg-zinc-100" />

                  <div className="space-y-4 pt-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Tarifa Base</span>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground/60 leading-none">Desde</p>
                        <p className="text-xl font-extrabold text-foreground mt-0.5">{vehicle.priceRange}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleWhatsAppRedirect(vehicle.name)}
                      className="w-full relative flex items-center justify-center gap-2 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      <span>Cotizar por WhatsApp</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pillars Section */}
      <div className="bg-zinc-50 rounded-[2.5rem] p-8 sm:p-12 lg:p-16 border border-zinc-100 shadow-sm mb-12">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            Nuestro Compromiso de Servicio
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            Viaja seguro, cómodo y sin preocupaciones con las garantías que ofrece Vive Travel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillarsInfo.map((pillar, idx) => (
            <div key={idx} className="flex gap-4 items-start bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:translate-y-[-2px] transition-transform duration-200">
              <div className="bg-ocean/5 p-3 rounded-2xl shrink-0">
                {pillarIcons[idx]}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-foreground leading-snug">
                  {pillar.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking and Contact Call-out */}
      <div className="text-center space-y-4 max-w-xl mx-auto py-6">
        <h3 className="text-2xl font-bold text-foreground">¿Listo para cotizar tu servicio?</h3>
        <p className="text-sm text-muted-foreground">
          Indícanos tu fecha de viaje, número de pasajeros, destino y paradas requeridas. Te responderemos de inmediato con una cotización adaptada.
        </p>
        <div className="pt-2">
          <Button
            onClick={() => handleWhatsAppRedirect("Flota Completa")}
            size="lg"
            className="rounded-full bg-ocean hover:bg-ocean-dark text-white font-bold px-8 h-13 shadow-sm hover:shadow-md transition-all flex items-center gap-2 mx-auto"
          >
            <span>Consultar ahora</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
}

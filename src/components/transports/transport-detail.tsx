"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchTransport, fetchTransports } from "@/lib/api";
import type { TransportVehicle } from "@/lib/data";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, Check, ArrowRight, CheckCircle2 } from "lucide-react";

function buildWhatsAppUrl(vehicle: TransportVehicle): string {
  const message = [
    `🌴 *CONSULTA DE TRANSPORTE VIVE TRAVEL*`,
    ``,
    `📋 *Servicio:* Transporte Privado`,
    `🚘 *Vehículo solicitado:* ${vehicle.name}`,
    `📍 *Ciudades de operación:* Barranquilla y Cartagena`,
    ``,
    `Hola, me gustaría cotizar un servicio de transporte privado para un traslado en ${vehicle.name}. ¿Podrían brindarme información de tarifas y disponibilidad?`,
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function TransportDetail({ id }: { id: string }) {
  const { data: vehicle, isLoading } = useQuery({
    queryKey: ["transport", id],
    queryFn: () => fetchTransport(id),
  });
  const { data: allVehicles = [] } = useQuery({
    queryKey: ["transports"],
    queryFn: fetchTransports,
  });

  const [imgError, setImgError] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-ocean border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Vehículo no encontrado.</p>
        <Link
          href="/transporte"
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-ocean hover:text-ocean-dark"
        >
          <ArrowLeft className="w-4 h-4" />
          Ver todos los vehículos
        </Link>
      </div>
    );
  }

  const related = allVehicles.filter((v) => v.id !== vehicle.id).slice(0, 3);
  const fallbackImg = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=800&fit=crop";

  return (
    <div className="bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Back */}
        <Link
          href="/transporte"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a transporte
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12">
          {/* Main column */}
          <div className="min-w-0">
            {/* Hero image */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted mb-6">
              <img
                src={imgError ? fallbackImg : vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-cover"
                onError={() => {
                  if (!imgError) setImgError(true);
                }}
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/95 backdrop-blur-sm text-foreground font-semibold text-xs px-3 py-1.5 border-0 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                  <Users className="w-3.5 h-3.5 text-ocean" />
                  {vehicle.capacity}
                </Badge>
              </div>
            </div>

            {/* Title + description */}
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {vehicle.name}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {vehicle.description}
            </p>

            {/* Ideal for */}
            {vehicle.bestFor && (
              <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border/50">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ocean mb-1">
                  Ideal para
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">{vehicle.bestFor}</p>
              </div>
            )}

            {/* Features */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Características
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {vehicle.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <CheckCircle2 className="w-4 h-4 text-ocean shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sticky booking column */}
          <aside className="lg:order-last">
            <div className="lg:sticky lg:top-24">
              <Card className="border-border/50 p-5 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Tarifa desde
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">{vehicle.priceRange}</p>
                <p className="text-xs text-muted-foreground mt-1">Cotización según ruta y duración</p>

                <Button
                  asChild
                  className="w-full mt-5 h-12 rounded-xl bg-ocean hover:bg-ocean-dark text-white font-semibold text-sm shadow-sm transition-all"
                >
                  <a href={buildWhatsAppUrl(vehicle)} target="_blank" rel="noopener noreferrer">
                    Cotizar por WhatsApp
                  </a>
                </Button>

                <p className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">
                  Respuesta inmediata · Barranquilla y Cartagena
                </p>
              </Card>
            </div>
          </aside>
        </div>

        {/* Related vehicles */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border/60">
            <h2 className="text-lg font-semibold text-foreground mb-5">
              Otros vehículos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((v) => (
                <Link
                  key={v.id}
                  href={`/transporte/${v.id}`}
                  className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-ocean/30 hover:bg-muted/30 transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-ocean transition-colors truncate">
                      {v.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">{v.capacity}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-ocean transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

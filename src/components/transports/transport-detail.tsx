"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchTransport, fetchTransports } from "@/lib/api";
import type { TransportVehicle } from "@/lib/data";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { ArrowLeft, Users, ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";

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
        <div className="animate-spin w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-slate-600 font-normal">Vehículo no encontrado.</p>
        <Link
          href="/transporte"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ver todos los vehículos</span>
        </Link>
      </div>
    );
  }

  const related = allVehicles.filter((v) => v.id !== vehicle.id).slice(0, 3);
  const fallbackImg = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=800&fit=crop";

  return (
    <div className="bg-slate-50/70 min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/transporte"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a transporte</span>
          </Link>

          <span className="text-xs font-medium text-slate-400">
            Flota de Transporte Privado
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Hero image */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs">
              <img
                src={imgError ? fallbackImg : vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-cover"
                onError={() => {
                  if (!imgError) setImgError(true);
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-xs text-white font-semibold text-xs shadow-2xs">
                  <Users className="w-3.5 h-3.5 text-slate-300" />
                  <span>Capacidad: {vehicle.capacity}</span>
                </span>
              </div>
            </div>

            {/* Header info */}
            <div className="space-y-3 pb-6 border-b border-slate-200/80">
              <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-snug">
                {vehicle.name}
              </h1>
              <p className="text-base text-slate-600 font-normal leading-relaxed">
                {vehicle.description}
              </p>
            </div>

            {/* Ideal for */}
            {vehicle.bestFor && (
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Ideal para
                </span>
                <p className="text-sm font-medium text-slate-800 leading-relaxed">{vehicle.bestFor}</p>
              </div>
            )}

            {/* Features */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                Características del Vehículo
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicle.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking Column (4 cols) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Tarifa base desde
                </span>
                <p className="text-2xl font-semibold text-slate-900">{vehicle.priceRange}</p>
                <p className="text-xs text-slate-500 font-normal">Cotización exacta según ruta y horario</p>
              </div>

              <a
                href={buildWhatsAppUrl(vehicle)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Cotizar por WhatsApp</span>
              </a>

              <div className="pt-2 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                  Operación en Barranquilla, Cartagena y rutas del Caribe colombiano.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Related vehicles */}
        {related.length > 0 && (
          <section className="pt-10 border-t border-slate-200/80 space-y-6">
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
              Otros Vehículos Disponibles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((v) => (
                <Link
                  key={v.id}
                  href={`/transporte/${v.id}`}
                  className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-2xs transition-all cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-slate-700 transition-colors truncate">
                      {v.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">{v.capacity}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}


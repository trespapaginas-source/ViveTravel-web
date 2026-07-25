"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  getVisasGroupedByCategory,
  VISA_CATEGORIES,
  type VisaCategoryId,
  type VisaSummary,
} from "@/lib/visas";
import { Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterId = "all" | VisaCategoryId;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "Todos los destinos" },
  { id: "required", label: "Visa requerida" },
  { id: "onarrival", label: "eTA / Trámite al llegar" },
  { id: "free", label: "Sin visa" },
];

function CountryFlagBadge({ visa }: { visa: VisaSummary }) {
  const cat = VISA_CATEGORIES[visa.categoryId];
  const flagCode = visa.countryCode ? visa.countryCode.toLowerCase() : "co";

  return (
    <Link
      href={`/visas/${visa.slug}`}
      className="group flex flex-col items-center text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 rounded-xl p-2 cursor-pointer"
      title={`${visa.country} — ${visa.visaCategory}`}
    >
      {/* 3D Glossy Crystal Flag Sphere */}
      <div className="relative w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-4px_6px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-105">
        <img
          src={`https://flagcdn.com/w160/${flagCode}.png`}
          alt={`Bandera de ${visa.country}`}
          className="w-full h-full object-cover rounded-full select-none"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const parent = e.currentTarget.parentElement;
            if (parent && !parent.querySelector(".flag-fallback")) {
              const fallback = document.createElement("span");
              fallback.className = "flag-fallback text-3xl select-none";
              fallback.innerText = visa.flagEmoji || "🌐";
              parent.appendChild(fallback);
            }
          }}
        />
        {/* Glass reflection 3D bevel overlay */}
        <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-b from-white/45 via-transparent to-black/35 ring-1 ring-black/10" />

        {/* Status indicator dot */}
        <div className="absolute bottom-0 right-1 z-10 flex items-center justify-center">
          <span
            className={cn(
              "w-3.5 h-3.5 rounded-full border-2 border-white shadow-2xs",
              cat.dot
            )}
          />
        </div>
      </div>

      {/* Country Name */}
      <span className="mt-2.5 text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors max-w-[110px] leading-snug line-clamp-2">
        {visa.country}
      </span>

      {/* Category Pill / Tag */}
      <span className="mt-0.5 text-[11px] font-normal text-slate-500 max-w-[110px] truncate">
        {visa.visaCategory}
      </span>
    </Link>
  );
}

export function VisasSection() {
  const categoryGroups = getVisasGroupedByCategory();
  const [filter, setFilter] = useState<FilterId>("all");

  const visibleGroups =
    filter === "all"
      ? categoryGroups
      : categoryGroups.filter((g) => g.categoryId === filter);

  return (
    <div className="bg-slate-50/70 min-h-screen text-slate-800">
      {/* Hero Header */}
      <section className="bg-[#002B49] text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Passport Graphic */}
            <div className="lg:col-span-4 flex justify-center lg:justify-start">
              <Image
                src="/images/visas/pasaporte-colombiano.png"
                alt="Pasaporte Colombiano"
                width={280}
                height={380}
                className="rounded-xl shadow-lg border border-slate-700/50 object-contain"
                priority
              />
            </div>

            {/* Right: Titles & Content */}
            <div className="lg:col-span-8 text-center lg:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Requisitos Migratorios</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-snug">
                Visas y Requisitos de Ingreso para Colombianos
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                Consulta los destinos que exigen visa, eTA o permiten libre ingreso con pasaporte colombiano antes de planear tu viaje.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Category Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors border cursor-pointer",
                    isActive
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                  )}
                >
                  {f.id !== "all" && (
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        VISA_CATEGORIES[f.id].dot
                      )}
                    />
                  )}
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-normal">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Actualizado a 2026</span>
          </div>
        </div>

        {/* Grouped Category Sections */}
        <div className="space-y-12">
          {visibleGroups.map((group) => (
            <section
              key={group.categoryId}
              className="space-y-6 pb-10 border-b border-slate-200/80 last:border-0"
            >
              {/* Section Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                    {group.categoryName}
                  </h2>
                  <span className="text-xs font-medium text-slate-500 tabular-nums">
                    {group.visas.length} {group.visas.length === 1 ? "destino" : "destinos"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-2xl">
                  {group.description}
                </p>
              </div>

              {/* Flag Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 justify-items-center pt-2">
                {group.visas.map((visa) => (
                  <CountryFlagBadge key={visa.slug} visa={visa} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Comprehensive Legal Disclaimer */}
        <div className="pt-8 border-t border-slate-200/80 space-y-4 text-xs text-slate-600 font-normal leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <span>Aviso Importante — Exención de Responsabilidad sobre Información de Visas</span>
          </div>

          <p>
            La información aquí presentada tiene carácter exclusivamente orientativo e informativo, y no constituye asesoría migratoria ni consular. Los requisitos, costos, tiempos de procesamiento y condiciones para la obtención de visas son establecidos y modificados unilateralmente por las embajadas, consulados y autoridades migratorias de cada país, sin previo aviso.
          </p>

          <p>
            Vive Travel (Vive Group S.A.S.) realiza esfuerzos razonables por mantener esta información actualizada; sin embargo, no garantiza la exactitud, vigencia ni completitud de los datos aquí publicados en todo momento. La información podría no reflejar los cambios más recientes implementados por las autoridades correspondientes.
          </p>

          <p>
            Por lo anterior, es responsabilidad exclusiva del viajero verificar directamente con la embajada, consulado o entidad migratoria competente los requisitos vigentes para su trámite de visa antes de iniciar cualquier gestión. Vive Travel recomienda consultar con nuestro equipo de asesoría como apoyo adicional, pero dicha consulta no sustituye la verificación directa ante la autoridad competente.
          </p>

          <p>
            Vive Travel no será responsable por: negación, demora o revocación de visas por parte de las autoridades consulares; cambios en requisitos, tarifas consulares o tiempos de procesamiento posteriores a la publicación de esta información; decisiones del viajero tomadas con base exclusiva en la información aquí publicada sin verificación ante la fuente oficial; ni pérdidas económicas derivadas de la compra de tiquetes, reservas hoteleras u otros servicios previos a la obtención de la visa.
          </p>

          <p>
            Las tarifas indicadas en esta sección corresponden exclusivamente a los costos consulares de referencia publicados por cada embajada o consulado. Vive Travel aplica un cargo adicional por la gestión y acompañamiento en el trámite, el cual será informado por su asesor comercial antes de iniciar el proceso. La aprobación o negación de la visa es una decisión soberana de cada país y Vive Travel no tiene injerencia alguna en dicha decisión, por lo cual el pago del servicio de gestión no es reembolsable independientemente del resultado del trámite, salvo acuerdo expreso previo por escrito.
          </p>

          <p className="font-medium text-slate-800">
            Se recomienda al viajero no adquirir tiquetes aéreos, reservas hoteleras ni otros servicios turísticos no reembolsables hasta tanto cuente con la visa aprobada y vigente para su destino.
          </p>

          <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-100">
            Última actualización de esta sección: 16 de julio de 2026.
          </div>
        </div>
      </div>
    </div>
  );
}



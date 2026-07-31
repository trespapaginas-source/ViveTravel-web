"use client";

import Link from "next/link";
import {
  type Visa,
  type VisaSummary,
  VISA_CATEGORIES,
} from "@/lib/visas";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Wallet,
  Building2,
  CalendarClock,
  ExternalLink,
  Lightbulb,
  Info,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VisaDetailProps {
  visa: Visa;
  prev: VisaSummary | null;
  next: VisaSummary | null;
}

export function VisaDetail({ visa }: VisaDetailProps) {
  const cat = VISA_CATEGORIES[visa.categoryId];
  const flagCode = visa.countryCode ? visa.countryCode.toLowerCase() : "co";

  const quickFacts = [
    {
      icon: CalendarClock,
      label: "Estadía máxima",
      value: visa.stayDuration,
    },
    {
      icon: Wallet,
      label: "Costo estimado",
      value: visa.cost,
    },
    {
      icon: Clock,
      label: "Tiempo de respuesta",
      value: visa.processingTime,
    },
    {
      icon: Building2,
      label: "Canal de solicitud",
      value: visa.whereToApply,
    },
  ];

  return (
    <div className="bg-slate-50/70 min-h-screen py-8 sm:py-12 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/visas"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a Visas</span>
          </Link>

          <span className="text-xs font-medium text-slate-400">
            Requisitos de ingreso para viajeros colombianos
          </span>
        </div>

        {/* Clean Editorial Header */}
        <header className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 pb-8 border-b border-slate-200/80">
          {/* 3D Glossy Crystal Flag Sphere */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 shadow-[0_4px_14px_rgba(0,0,0,0.18),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-4px_6px_rgba(0,0,0,0.35)]">
            <img
              src={`https://flagcdn.com/w320/${flagCode}.png`}
              alt={`Bandera de ${visa.country}`}
              className="w-full h-full object-cover rounded-full select-none"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector(".flag-fallback")) {
                  const fallback = document.createElement("span");
                  fallback.className = "flag-fallback text-4xl select-none";
                  fallback.innerText = visa.flagEmoji || "🌐";
                  parent.appendChild(fallback);
                }
              }}
            />
            {/* Glass reflection 3D bevel overlay */}
            <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-b from-white/45 via-transparent to-black/35 ring-1 ring-black/10" />

            <div className="absolute bottom-0 right-0 z-10">
              <span className={cn("w-4 h-4 rounded-full border-2 border-white shadow-2xs block", cat.dot)} />
            </div>
          </div>

          {/* Title & Category Info */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 text-xs font-semibold">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                {visa.region}
              </span>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                  cat.badge
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", cat.dot)} />
                {visa.visaCategory}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-snug">
              {visa.country}
            </h1>

            <p className="text-base text-slate-600 font-normal leading-relaxed max-w-2xl">
              {visa.summary}
            </p>
          </div>
        </header>

        {/* Quick Facts Boarding Summary Grid */}
        <section className="py-6 border-b border-slate-200/80">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {quickFacts.map((f) => (
              <div key={f.label} className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <f.icon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    {f.label}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-900">
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content Layout */}
        <div className="space-y-10 max-w-3xl">
          {/* Requisitos Obligatorios */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              Requisitos Obligatorios de Ingreso
            </h2>

            <ul className="space-y-3">
              {visa.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Paso a Paso del Trámite */}
          <section className="space-y-4 pt-2">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              Paso a Paso para Tramitar la Autorización
            </h2>

            <ol className="space-y-4 pl-1">
              {visa.process.map((step, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-semibold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm font-normal text-slate-700 leading-relaxed pt-0.5">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Casos Especiales y Exenciones si existen */}
          {visa.specialNotes && visa.specialNotes.length > 0 && (
            <section className="space-y-3 p-4.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Modalidades y Exenciones Especiales
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">
                {visa.specialNotes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Información Consular & CAS si existe */}
          {visa.embassyInfo && (
            <section className="space-y-3 p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
                Sede Consular y Centro de Atención en Bogotá
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {visa.embassyInfo.address && (
                  <div>
                    <span className="font-semibold text-slate-900 block">Dirección Embajada:</span>
                    <span className="text-slate-600">{visa.embassyInfo.address}</span>
                  </div>
                )}
                {visa.embassyInfo.cas && (
                  <div>
                    <span className="font-semibold text-slate-900 block">Centro CAS / Biometría:</span>
                    <span className="text-slate-600">{visa.embassyInfo.cas}</span>
                  </div>
                )}
                {visa.embassyInfo.phone && (
                  <div>
                    <span className="font-semibold text-slate-900 block">Teléfonos de contacto:</span>
                    <span className="text-slate-600">{visa.embassyInfo.phone}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Documentos a Presentar si existen */}
          {visa.documents && visa.documents.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                Documentos Físicos y Digitales a Presentar
              </h2>

              <ul className="space-y-2.5">
                {visa.documents.map((doc, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm font-normal text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Recomendaciones y Tips (Sobrio, No Orange) */}
          {visa.tips && visa.tips.length > 0 && (
            <section className="border-l-2 border-slate-300 bg-slate-100/50 p-4 rounded-r-xl space-y-2.5 my-6">
              <h3 className="text-sm font-semibold text-slate-900">
                Recomendaciones Clave para Viajeros
              </h3>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                {visa.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Official Source & Disclaimer */}
          <div className="space-y-4 pt-4 border-t border-slate-200/60">
            <a
              href={visa.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-900 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <span>Consultar Portal Oficial de la Embajada o Gobierno</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>

            <div className="flex items-start gap-2.5 text-xs text-slate-500 font-normal leading-relaxed">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>
                Información de carácter orientativo actualizada a {visa.lastUpdated}. Los requisitos migratorios pueden ser modificados sin previo aviso por el gobierno de {visa.country}. Revisa siempre el portal consular oficial antes de emitir pasajes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


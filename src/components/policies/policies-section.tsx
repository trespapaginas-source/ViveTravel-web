"use client";

import Link from "next/link";
import { useNavigation } from "@/lib/store";
import { getLegalDocsByCategory } from "@/lib/legal-docs";
import {
  FileText,
  ShieldCheck,
  CreditCard,
  Lock,
  Cookie,
  MessageSquare,
  Plane,
  AlertTriangle,
  HandHeart,
  MousePointerClick,
  ChevronRight,
  ArrowLeft,
  Building2,
} from "lucide-react";

// One icon per document slug, chosen for relevance.
const DOC_ICONS: Record<string, React.ElementType> = {
  terminos: FileText,
  reservas: CreditCard,
  datos: Lock,
  privacidad: ShieldCheck,
  cookies: Cookie,
  pqr: MessageSquare,
  "manual-viajero": Plane,
  responsabilidad: AlertTriangle,
  consentimiento: HandHeart,
  "aceptacion-digital": MousePointerClick,
};

export function PoliciesSection() {
  const { navigate } = useNavigation();
  const groups = getLegalDocsByCategory();

  return (
    <div className="bg-slate-50/70 min-h-screen py-8 sm:py-12 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <div>
          <button
            onClick={() => navigate("home")}
            className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <span>Volver al inicio</span>
          </button>
        </div>

        {/* Editorial Header */}
        <header className="space-y-3 border-b border-slate-200/80 pb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>Marco Legal & Términos</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-snug">
            Documentos Legales y Políticas
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl">
            La transparencia en cada reserva es nuestra prioridad. Aquí puedes consultar todas las políticas que rigen tu relación y servicios contratados con Vive Travel.
          </p>
        </header>

        {/* Document index grouped by category */}
        <div className="space-y-12">
          {groups.map(({ category, docs }) => (
            <section key={category} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                  {category}
                </h2>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  {docs.length} {docs.length === 1 ? "documento" : "documentos"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {docs.map((doc) => {
                  const Icon = DOC_ICONS[doc.slug] ?? FileText;
                  return (
                    <Link
                      key={doc.slug}
                      href={`/politicas/${doc.slug}`}
                      className="group flex items-start gap-4 p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white shadow-2xs transition-colors cursor-pointer"
                    >
                      {/* Document icon */}
                      <div className="p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:text-slate-900 shrink-0 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-slate-900 transition-colors truncate">
                            {doc.shortTitle}
                          </h3>
                          <span className="text-[11px] font-mono font-medium text-slate-400">
                            #{doc.number}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                          {doc.description}
                        </p>

                        <div className="pt-1 flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                          <span>Ver documento completo</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Corporate footer */}
        <div className="pt-8 border-t border-slate-200/80">
          <div className="flex items-start gap-3 text-xs text-slate-500 font-normal leading-relaxed">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p>
                Emitido por <span className="font-semibold text-slate-700">Vive Group S.A.S.</span> · NIT 901993710 · RNT 278488 · Barranquilla, Atlántico, Colombia.
              </p>
              <p className="mt-1 text-slate-400">
                Versión vigente 1.0 — 2026. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

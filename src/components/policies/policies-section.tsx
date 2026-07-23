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
    <section className="bg-white">
      {/* Editorial header */}
      <header className="border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <button
            onClick={() => navigate("home")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al inicio
          </button>

          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ocean mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Marco legal
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-foreground leading-[1.1]">
              Documentos legales y políticas
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              La transparencia es parte del viaje. Aquí encontrarás cada documento
              que regula tu relación con Vive Travel, disponible para consulta en
              cualquier momento.
            </p>
          </div>
        </div>
      </header>

      {/* Document index grouped by category */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-14">
          {groups.map(({ category, docs }) => (
            <section key={category}>
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  {category}
                </h2>
                <div className="flex-1 h-px bg-border/60" />
                <span className="text-xs font-medium text-muted-foreground tabular-nums">
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
                      className="group relative flex gap-4 p-5 rounded-2xl border border-border/50 hover:border-ocean/40 bg-white hover:shadow-[0_8px_30px_-12px_rgba(0,139,139,0.12)] transition-all duration-200"
                    >
                      {/* Document number — large, watermark-style */}
                      <span className="select-none text-2xl sm:text-3xl font-bold text-border/80 group-hover:text-ocean/25 transition-colors leading-none tabular-nums pt-0.5">
                        {doc.number}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Icon className="w-4 h-4 text-ocean shrink-0" />
                          <h3 className="text-[15px] font-semibold text-foreground group-hover:text-ocean transition-colors leading-snug">
                            {doc.shortTitle}
                          </h3>
                        </div>
                        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {doc.description}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-3 text-[11px] font-medium text-muted-foreground group-hover:text-ocean transition-colors">
                          Leer documento
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Corporate footer */}
        <div className="mt-16 pt-10 border-t border-border/60">
          <div className="flex items-start gap-3">
            <Building2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Emitido por <span className="font-medium text-foreground/80">Vive Group S.A.S.</span>{" "}
                · NIT 901993710 · RNT 278488 · Barranquilla, Atlántico, Colombia.
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">
                Versión 1.0 — 16 de julio de 2026. Los documentos pueden ser actualizados;
                la versión vigente es la publicada en este sitio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

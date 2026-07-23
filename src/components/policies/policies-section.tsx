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

// One accent per category — all within the brand's neutral palette.
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Términos y contratación": FileText,
  "Reservas y cancelaciones": CreditCard,
  "Privacidad y datos": Lock,
  "Operación y responsabilidad": ShieldCheck,
};

export function PoliciesSection() {
  const { navigate } = useNavigation();
  const groups = getLegalDocsByCategory();

  return (
    <section className="bg-white">
      {/* Header */}
      <header className="border-b border-border/60 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <button
            onClick={() => navigate("home")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            Volver al inicio
          </button>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-ocean mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Documentos legales
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Políticas y documentos legales
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Todos los documentos que regulan tu relación con Vive Travel.
            Consulta, lee y acepta con total transparencia antes de reservar.
          </p>
        </div>
      </header>

      {/* Document index grouped by category */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="space-y-12">
          {groups.map(({ category, docs }) => {
            const CatIcon = CATEGORY_ICONS[category] ?? FileText;
            return (
              <div key={category}>
                <div className="flex items-center gap-2.5 mb-5">
                  <CatIcon className="w-4 h-4 text-ocean" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    {category}
                  </h2>
                  <div className="flex-1 h-px bg-border/60" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {docs.map((doc) => {
                    const Icon = DOC_ICONS[doc.slug] ?? FileText;
                    return (
                      <Link
                        key={doc.slug}
                        href={`/politicas/${doc.slug}`}
                        className="group flex items-start gap-3.5 p-4 rounded-xl border border-border/50 hover:border-ocean/30 hover:bg-muted/30 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-muted/70 flex items-center justify-center shrink-0 group-hover:bg-ocean/10 transition-colors">
                          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-ocean transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono font-bold text-muted-foreground/70">
                              {doc.number}
                            </span>
                            <h3 className="text-sm font-semibold text-foreground group-hover:text-ocean transition-colors leading-tight">
                              {doc.shortTitle}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {doc.description}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-ocean group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-14 pt-8 border-t border-border/60">
          <p className="text-xs text-muted-foreground text-center max-w-xl mx-auto leading-relaxed">
            Documentos emitidos por Vive Group S.A.S. · NIT 901993710 · RNT 278488 ·
            Barranquilla, Atlántico, Colombia. Versión 1.0 — 16 de julio de 2026.
          </p>
        </div>
      </div>
    </section>
  );
}

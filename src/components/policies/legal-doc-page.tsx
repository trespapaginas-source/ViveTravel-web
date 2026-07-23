"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type LegalDoc, type LegalDocSummary } from "@/lib/legal-docs";
import { ArrowLeft, ChevronRight, FileText, Calendar, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalDocPageProps {
  doc: LegalDoc;
  prev: LegalDocSummary | null;
  next: LegalDocSummary | null;
}

export function LegalDocPage({ doc, prev, next }: LegalDocPageProps) {
  const [activeClause, setActiveClause] = useState<number | null>(null);
  const [showTop, setShowTop] = useState(false);

  // Track scroll position to highlight the active clause in the sidebar
  // and toggle the "back to top" button.
  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 600);
      // Find which clause heading is closest to the top of the viewport.
      let current: number | null = null;
      for (const c of doc.clauses) {
        const el = document.getElementById(`clausula-${c.number}`);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top < 140) current = c.number;
        }
      }
      setActiveClause(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [doc.clauses]);

  const scrollToClause = (n: number) => {
    document.getElementById(`clausula-${n}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <article className="bg-white">
      {/* Document header */}
      <header className="border-b border-border/60 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <Link
            href="/politicas"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Todos los documentos
          </Link>

          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-ocean mb-3">
            <FileText className="w-3.5 h-3.5" />
            {doc.category}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {doc.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="font-mono font-semibold text-foreground/70">{doc.number}</span>
              Documento {doc.number}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Versión {doc.version} · {doc.issuedAt}
            </span>
            <span>{doc.clauses.length} cláusulas</span>
          </div>
        </div>
      </header>

      {/* Body: sidebar (desktop) + content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex gap-10">
          {/* Clause index — sticky sidebar, desktop only */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Contenido
              </p>
              <nav className="space-y-0.5">
                {doc.clauses.map((c) => (
                  <button
                    key={c.number}
                    onClick={() => scrollToClause(c.number)}
                    className={cn(
                      "block w-full text-left text-[13px] leading-snug py-1.5 pl-3 border-l-2 transition-colors",
                      activeClause === c.number
                        ? "border-ocean text-ocean font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    {c.heading}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Document clauses */}
          <div className="flex-1 min-w-0 max-w-3xl">
            <div className="space-y-10">
              {doc.clauses.map((c) => (
                <section key={c.number} id={`clausula-${c.number}`} className="scroll-mt-24">
                  <h2 className="flex items-baseline gap-3 text-lg sm:text-xl font-semibold text-foreground mb-3">
                    <span className="text-sm font-mono font-bold text-ocean shrink-0">
                      {c.number}.
                    </span>
                    <span>{c.heading}</span>
                  </h2>
                  <p className="text-[15px] leading-relaxed text-foreground/80">
                    {c.body}
                  </p>
                </section>
              ))}
            </div>

            {/* Prev / Next navigation */}
            <nav className="mt-16 pt-8 border-t border-border/60 grid grid-cols-2 gap-4">
              {prev ? (
                <Link
                  href={`/politicas/${prev.slug}`}
                  className="group flex flex-col gap-1 p-4 rounded-xl border border-border/50 hover:border-ocean/30 hover:bg-muted/30 transition-colors"
                >
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3 rotate-180" />
                    Anterior
                  </span>
                  <span className="text-sm font-semibold text-foreground group-hover:text-ocean transition-colors">
                    {prev.shortTitle}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/politicas/${next.slug}`}
                  className="group flex flex-col gap-1 p-4 rounded-xl border border-border/50 hover:border-ocean/30 hover:bg-muted/30 transition-colors text-right"
                >
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 justify-end">
                    Siguiente
                    <ChevronRight className="w-3 h-3" />
                  </span>
                  <span className="text-sm font-semibold text-foreground group-hover:text-ocean transition-colors">
                    {next.shortTitle}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </nav>

            {/* Back to all docs */}
            <div className="mt-8">
              <Link
                href="/politicas"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Ver todos los documentos legales
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top (floating) */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-foreground text-background shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          aria-label="Volver arriba"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </article>
  );
}

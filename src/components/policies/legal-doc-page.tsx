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

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 500);
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
    <article className="bg-slate-50/70 min-h-screen pt-24 sm:pt-28 pb-8 sm:pb-12 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/politicas"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <span>Todos los documentos legales</span>
          </Link>
        </div>

        {/* Document Header */}
        <header className="space-y-3 border-b border-slate-200/80 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <FileText className="w-4 h-4 text-slate-600" />
            <span>{doc.category}</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono">Doc #{doc.number}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 leading-snug">
            {doc.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-3xl">
            {doc.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 pt-2">
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Versión {doc.version} · {doc.issuedAt}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              {doc.clauses.length} cláusulas regulatorias
            </span>
          </div>
        </header>

        {/* Body: Sticky Sidebar (desktop) + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Table of Contents Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Índice de Cláusulas
              </p>
              <nav className="space-y-1 max-h-[65vh] overflow-y-auto pr-1">
                {doc.clauses.map((c) => (
                  <button
                    key={c.number}
                    onClick={() => scrollToClause(c.number)}
                    className={cn(
                      "block w-full text-left text-xs leading-snug py-1.5 pl-2.5 border-l-2 transition-colors cursor-pointer rounded-r-md",
                      activeClause === c.number
                        ? "border-slate-900 text-slate-900 font-semibold bg-slate-50"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    )}
                  >
                    <span className="font-mono font-medium mr-1 text-[11px] opacity-60">{c.number}.</span>
                    {c.heading}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Document Clauses Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="space-y-8 divide-y divide-slate-100">
              {doc.clauses.map((c) => (
                <section key={c.number} id={`clausula-${c.number}`} className="scroll-mt-24 pt-6 first:pt-0 space-y-2">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight flex items-baseline gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Cláusula {c.number}.
                    </span>
                    <span>{c.heading}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed whitespace-pre-line">
                    {c.body}
                  </p>
                </section>
              ))}
            </div>

            {/* Prev / Next Pagination */}
            <nav className="pt-8 border-t border-slate-200/80 grid grid-cols-2 gap-4">
              {prev ? (
                <Link
                  href={`/politicas/${prev.slug}`}
                  className="group flex flex-col gap-1 p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" />
                    Anterior
                  </span>
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900 transition-colors truncate">
                    {prev.shortTitle}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/politicas/${next.slug}`}
                  className="group flex flex-col gap-1 p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors text-right cursor-pointer"
                >
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 justify-end">
                    Siguiente
                    <ChevronRight className="w-3 h-3" />
                  </span>
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900 transition-colors truncate">
                    {next.shortTitle}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-slate-900 text-white shadow-md flex items-center justify-center hover:bg-slate-800 transition-all cursor-pointer"
          aria-label="Volver arriba"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}
    </article>
  );
}

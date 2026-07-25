import visasData from "@/data/static/visas.json";

export type VisaCategoryId = "free" | "onarrival" | "required";

export interface Visa {
  slug: string;
  country: string;
  countryCode: string;
  flagEmoji: string;
  region: string;
  visaCategory: string;
  categoryId: VisaCategoryId;
  summary: string;
  stayDuration: string;
  cost: string;
  processingTime: string;
  whereToApply: string;
  requirements: string[];
  process: string[];
  tips: string[];
  officialLink: string;
  lastUpdated: string;
  embassyInfo?: {
    address?: string;
    phone?: string;
    cas?: string;
    website?: string;
  };
  documents?: string[];
  specialNotes?: string[];
}

export interface VisaSummary {
  slug: string;
  country: string;
  countryCode: string;
  flagEmoji: string;
  region: string;
  visaCategory: string;
  categoryId: VisaCategoryId;
  summary: string;
}

/** Visual config for each visa category: label, color, dot. */
export const VISA_CATEGORIES: Record<
  VisaCategoryId,
  { label: string; dot: string; badge: string }
> = {
  free: {
    label: "Sin visa",
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  },
  onarrival: {
    label: "Trámite al llegar",
    dot: "bg-amber-500",
    badge:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  },
  required: {
    label: "Visa requerida",
    dot: "bg-red-500",
    badge:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
  },
};

const visas = visasData as Visa[];

/** All visas, ordered by region then country. */
export function getAllVisas(): Visa[] {
  return [...visas].sort((a, b) => {
    if (a.region === b.region) return a.country.localeCompare(b.country);
    return a.region.localeCompare(b.region);
  });
}

/** Lightweight list for index pages (drops the heavy arrays). */
export function getVisaSummaries(): VisaSummary[] {
  return getAllVisas().map((v) => ({
    slug: v.slug,
    country: v.country,
    countryCode: v.countryCode,
    flagEmoji: v.flagEmoji,
    region: v.region,
    visaCategory: v.visaCategory,
    categoryId: v.categoryId,
    summary: v.summary,
  }));
}

/** Single visa by slug. */
export function getVisa(slug: string): Visa | null {
  return visas.find((v) => v.slug === slug) ?? null;
}

/** Prev/next for detail-page navigation. */
export function getAdjacentVisas(slug: string): {
  prev: VisaSummary | null;
  next: VisaSummary | null;
} {
  const ordered = getAllVisas();
  const idx = ordered.findIndex((v) => v.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  const toSummary = (v: Visa | undefined): VisaSummary | null =>
    v
      ? {
          slug: v.slug,
          country: v.country,
          countryCode: v.countryCode,
          flagEmoji: v.flagEmoji,
          region: v.region,
          visaCategory: v.visaCategory,
          categoryId: v.categoryId,
          summary: v.summary,
        }
      : null;
  return {
    prev: toSummary(ordered[idx - 1]),
    next: toSummary(ordered[idx + 1]),
  };
}

/** Visas grouped by region, for the index page. */
export function getVisasByRegion(): Array<{
  region: string;
  visas: VisaSummary[];
}> {
  const summaries = getVisaSummaries();
  const groups = new Map<string, VisaSummary[]>();
  for (const s of summaries) {
    if (!groups.has(s.region)) groups.set(s.region, []);
    groups.get(s.region)!.push(s);
  }
  return Array.from(groups.entries()).map(([region, vs]) => ({
    region,
    visas: vs,
  }));
}

/** Visas grouped by visa category, for structured visual sections. */
export function getVisasGroupedByCategory(): Array<{
  categoryId: VisaCategoryId;
  categoryName: string;
  description: string;
  visas: VisaSummary[];
}> {
  const summaries = getVisaSummaries();
  const categories: VisaCategoryId[] = ["required", "onarrival", "free"];
  const titles: Record<VisaCategoryId, { title: string; desc: string }> = {
    required: {
      title: "Países que exigen visa ordinaria a colombianos",
      desc: "Requieren autorización o visa consular previa estampada en el pasaporte.",
    },
    onarrival: {
      title: "Países que permiten ingreso con eTA, eVisa o tarjeta de turismo",
      desc: "Autorización electrónica o documento expedido a la llegada.",
    },
    free: {
      title: "Países sin visa para ciudadanos colombianos",
      desc: "Ingreso libre por turismo presentando únicamente pasaporte o cédula de ciudadanía.",
    },
  };

  return categories
    .map((catId) => ({
      categoryId: catId,
      categoryName: titles[catId].title,
      description: titles[catId].desc,
      visas: summaries.filter((s) => s.categoryId === catId),
    }))
    .filter((group) => group.visas.length > 0);
}


import legalDocsData from "@/data/static/legal-docs.json";

export interface LegalClause {
  number: number;
  heading: string;
  body: string;
}

export interface LegalDoc {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  version: string;
  issuedAt: string;
  clauses: LegalClause[];
}

export interface LegalDocSummary {
  slug: string;
  number: string;
  shortTitle: string;
  title: string;
  description: string;
  category: string;
  clauseCount: number;
}

const docs = legalDocsData as LegalDoc[];

/** All documents, ordered by their number (01 → 10). */
export function getAllLegalDocs(): LegalDoc[] {
  return [...docs].sort((a, b) => a.number.localeCompare(b.number));
}

/** Lightweight list for index pages (no clause bodies). */
export function getLegalDocSummaries(): LegalDocSummary[] {
  return getAllLegalDocs().map((d) => ({
    slug: d.slug,
    number: d.number,
    shortTitle: d.shortTitle,
    title: d.title,
    description: d.description,
    category: d.category,
    clauseCount: d.clauses.length,
  }));
}

/** Fetch a single document by its slug (URL-safe id). Returns null if not found. */
export function getLegalDoc(slug: string): LegalDoc | null {
  return docs.find((d) => d.slug === slug) ?? null;
}

/** Adjacent docs for prev/next navigation. */
export function getAdjacentDocs(slug: string): {
  prev: LegalDocSummary | null;
  next: LegalDocSummary | null;
} {
  const ordered = getAllLegalDocs();
  const idx = ordered.findIndex((d) => d.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  const toSummary = (d: LegalDoc | undefined): LegalDocSummary | null =>
    d
      ? {
          slug: d.slug,
          number: d.number,
          shortTitle: d.shortTitle,
          title: d.title,
          description: d.description,
          category: d.category,
          clauseCount: d.clauses.length,
        }
      : null;
  return {
    prev: toSummary(ordered[idx - 1]),
    next: toSummary(ordered[idx + 1]),
  };
}

/** Documents grouped by category, for the index page. */
export function getLegalDocsByCategory(): Array<{
  category: string;
  docs: LegalDocSummary[];
}> {
  const summaries = getLegalDocSummaries();
  const groups = new Map<string, LegalDocSummary[]>();
  for (const s of summaries) {
    if (!groups.has(s.category)) groups.set(s.category, []);
    groups.get(s.category)!.push(s);
  }
  return Array.from(groups.entries()).map(([category, ds]) => ({
    category,
    docs: ds,
  }));
}

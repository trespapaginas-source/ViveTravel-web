import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLegalDoc, getAdjacentDocs, getAllLegalDocs } from "@/lib/legal-docs";
import { LegalDocPage } from "@/components/policies/legal-doc-page";

// Pre-render all 10 documents at build time.
export function generateStaticParams() {
  return getAllLegalDocs().map((d) => ({ doc: d.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  return params.then(({ doc: slug }) => {
    const doc = getLegalDoc(slug);
    if (!doc) return { title: "Documento no encontrado | Vive Travel" };
    return {
      title: `${doc.shortTitle} | Vive Travel`,
      description: doc.description,
      alternates: { canonical: `/politicas/${doc.slug}` },
      openGraph: {
        title: `${doc.shortTitle} | Vive Travel`,
        description: doc.description,
        type: "article",
      },
    };
  });
}

export default async function LegalDocRoute({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc: slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  const { prev, next } = getAdjacentDocs(slug);
  return <LegalDocPage doc={doc} prev={prev} next={next} />;
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllVisas, getVisa, getAdjacentVisas } from "@/lib/visas";
import { VisaDetail } from "@/components/visas/visa-detail";

// Pre-render all 10 country pages at build time.
export function generateStaticParams() {
  return getAllVisas().map((v) => ({ country: v.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  return params.then(({ country: slug }) => {
    const visa = getVisa(slug);
    if (!visa) return { title: "Destino no encontrado | Vive Travel" };
    return {
      title: `Visa para ${visa.country} | Vive Travel`,
      description: visa.summary,
      alternates: { canonical: `/visas/${visa.slug}` },
      openGraph: {
        title: `Requisitos de visa para ${visa.country}`,
        description: visa.summary,
        type: "article",
      },
    };
  });
}

export default async function VisaCountryRoute({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: slug } = await params;
  const visa = getVisa(slug);
  if (!visa) notFound();

  const { prev, next } = getAdjacentVisas(slug);
  return <VisaDetail visa={visa} prev={prev} next={next} />;
}

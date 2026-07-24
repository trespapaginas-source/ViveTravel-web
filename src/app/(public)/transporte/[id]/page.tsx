import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchTransport, fetchTransports } from "@/lib/api";
import { TransportDetail } from "@/components/transports/transport-detail";

// Pre-render all vehicles at build time.
export async function generateStaticParams() {
  const vehicles = await fetchTransports();
  return vehicles.map((v) => ({ id: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await fetchTransport(id);
  if (!vehicle) return { title: "Vehículo no encontrado | Vive Travel" };
  return {
    title: `${vehicle.name} | Transporte Vive Travel`,
    description: vehicle.description,
    alternates: { canonical: `/transporte/${vehicle.id}` },
    openGraph: {
      title: `${vehicle.name} | Transporte Vive Travel`,
      description: vehicle.description,
      images: [{ url: vehicle.image }],
    },
  };
}

export default async function TransportDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await fetchTransport(id);
  if (!vehicle) notFound();
  return <TransportDetail id={vehicle.id} />;
}

import type { Metadata } from "next";
import { VisasSection } from "@/components/visas/visas-section";

export const metadata: Metadata = {
  title: "Visas y requisitos de ingreso | Vive Travel",
  description:
    "Consulta si necesitas visa para tu próximo destino siendo colombiano. Requisitos, costos, tiempos de trámite y consejos para cada país.",
  alternates: { canonical: "/visas" },
  openGraph: {
    title: "Visas y requisitos de ingreso | Vive Travel",
    description:
      "Consulta si necesitas visa para tu próximo destino siendo colombiano. Requisitos, costos y trámites por país.",
  },
};

export default function VisasPage() {
  return <VisasSection />;
}

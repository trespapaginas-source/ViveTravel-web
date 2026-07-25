import type { Metadata } from "next";
import { TeamSection } from "@/components/team/team-section";

export const metadata: Metadata = {
  title: "Nuestro Equipo | Vive Travel",
  description:
    "Conoce al equipo de líderes y fundadores detrás de Vive Travel. Pasión por el turismo y la excelencia en el Caribe colombiano.",
  alternates: { canonical: "/equipo" },
  openGraph: {
    title: "Nuestro Equipo | Vive Travel",
    description:
      "Conoce al equipo de líderes y fundadores detrás de Vive Travel.",
  },
};

export default function EquipoPage() {
  return <TeamSection />;
}

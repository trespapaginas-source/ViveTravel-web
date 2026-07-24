import type { Metadata } from "next";
import { TransportsView } from "@/components/transports/transports-view";

export const metadata: Metadata = {
  title: "Transporte Privado | Vive Travel",
  description:
    "Servicio de transporte privado con la mejor atención, comodidad y puntualidad en Barranquilla y Cartagena. Buses, vans, carros y camionetas.",
  alternates: { canonical: "/transporte" },
  openGraph: {
    title: "Transporte Privado | Vive Travel",
    description:
      "Servicio de transporte privado con la mejor atención, comodidad y puntualidad en Barranquilla y Cartagena.",
  },
};

export default function TransportePage() {
  return <TransportsView />;
}

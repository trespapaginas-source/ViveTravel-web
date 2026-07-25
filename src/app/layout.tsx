import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { fetchHeroImages, fetchPlans, fetchTestimonials, fetchTripImages } from "@/lib/api";
import siteContent from "@/data/static/site-content.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vive Travel Atlántico | Agencia de Viajes y Cabañas en el Atlántico",
  description:
    "Descubre planes turísticos y alojamientos en cabañas dentro del departamento del Atlántico, Colombia. Vive experiencias únicas en el Caribe colombiano.",
  keywords: [
    "Vive Travel",
    "Atlántico",
    "Colombia",
    "viajes",
    "cabañas",
    "planes turísticos",
    "Caribe",
    "Barranquilla",
    "playa",
    "turismo",
  ],
  authors: [{ name: "Vive Travel" }],
  icons: {
    icon: [
      { url: "/logos/vive-travel-original.png", type: "image/png" },
    ],
    shortcut: "/logos/vive-travel-original.png",
    apple: "/logos/vive-travel-original.png",
  },
  openGraph: {
    title: "Vive Travel Atlántico",
    description:
      "Planes turísticos y cabañas en el Atlántico, Colombia. Tu aventura caribeña comienza aquí.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [
    initialContent,
    initialHeroImages,
    initialPlans,
    initialTestimonials,
    initialTripImages,
  ] = await Promise.all([
    Promise.resolve(siteContent),
    fetchHeroImages(),
    fetchPlans(),
    fetchTestimonials(),
    fetchTripImages(),
  ]);

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased bg-background text-foreground`}
      >
        <Providers
          initialSiteContent={initialContent}
          initialHeroImages={initialHeroImages}
          initialPlans={initialPlans}
          initialTestimonials={initialTestimonials}
          initialTripImages={initialTripImages}
        >
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}



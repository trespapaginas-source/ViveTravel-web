import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { readFromCache } from "@/lib/cache";
import { defaultSiteContent } from "@/lib/content-defaults";
import type { SiteContentData } from "@/lib/content-types";
import {
  heroImages as fallbackHero,
  tourPlans,
  testimonials as fallbackTestimonials,
  pastTripImages as fallbackTrips,
} from "@/lib/data";

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
    icon: "/logo.svg",
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
    readFromCache<SiteContentData>("site_content", defaultSiteContent),
    readFromCache<any[]>("hero_images", fallbackHero),
    readFromCache<any[]>("plans", tourPlans),
    readFromCache<any[]>("testimonials", fallbackTestimonials),
    readFromCache<any[]>("trip_images", fallbackTrips),
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
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}



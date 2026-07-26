"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { SiteContentData } from "@/lib/content-types";

interface ProvidersProps {
  children: React.ReactNode;
  initialSiteContent?: SiteContentData;
  initialHeroImages?: any[];
  initialPlans?: any[];
  initialTestimonials?: any[];
  initialTripImages?: any[];
}

import cabinsData from "@/data/static/cabins.json";
import plansData from "@/data/static/plans.json";
import transportsData from "@/data/static/transports.json";

export function Providers({
  children,
  initialSiteContent,
  initialHeroImages,
  initialPlans,
  initialTestimonials,
  initialTripImages,
}: ProvidersProps) {
  const [queryClient] = useState(() => {
    const qc = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 10 * 60 * 1000,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
        },
      },
    });

    if (initialSiteContent) {
      qc.setQueryData(["site-content"], initialSiteContent);
    }
    if (initialHeroImages) {
      qc.setQueryData(["hero-images"], initialHeroImages);
    }
    qc.setQueryData(["plans"], initialPlans || plansData);
    qc.setQueryData(["cabins"], cabinsData);
    qc.setQueryData(["transports"], transportsData);

    if (initialTestimonials) {
      qc.setQueryData(["testimonials"], initialTestimonials);
    }
    if (initialTripImages) {
      qc.setQueryData(["trip-images"], initialTripImages);
    }

    return qc;
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}



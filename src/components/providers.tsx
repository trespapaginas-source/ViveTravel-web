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
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
        },
      },
    });

    if (initialSiteContent) {
      qc.setQueryData(["site-content"], initialSiteContent);
    }
    if (initialHeroImages) {
      qc.setQueryData(["hero-images"], initialHeroImages);
    }
    if (initialPlans) {
      qc.setQueryData(["plans"], initialPlans);
    }
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



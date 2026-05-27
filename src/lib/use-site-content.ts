"use client";

import { useQuery } from "@tanstack/react-query";
import { defaultSiteContent } from "@/lib/content-defaults";
import type { SiteContentData } from "@/lib/content-types";
import { fetchSiteContent } from "@/lib/supabase/queries";

export function useSiteContent() {
  const { data, isLoading, error } = useQuery<SiteContentData>({
    queryKey: ["site-content"],
    queryFn: fetchSiteContent,
  });

  return {
    content: data ?? defaultSiteContent,
    isLoading,
    error,
  };
}

"use client";

import type { SiteContentData } from "@/lib/content-types";
import siteContent from "@/data/static/site-content.json";

export function useSiteContent() {
  return {
    content: siteContent as SiteContentData,
    isLoading: false,
    error: null,
  };
}

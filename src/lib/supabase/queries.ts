"use client";

import { defaultSiteContent } from "@/lib/content-defaults";
import type { SiteContentData } from "@/lib/content-types";

export async function fetchSiteContent(): Promise<SiteContentData> {
  try {
    const res = await fetch("/api/content");
    if (!res.ok) {
      console.warn("Failed to fetch site content from local API, using defaults");
      return defaultSiteContent;
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching site content from local API:", error);
    return defaultSiteContent;
  }
}

"use client";

import type { SiteContentData } from "@/lib/content-types";
import { siteContent } from "@/data/site-content";

export async function fetchSiteContent(): Promise<SiteContentData> {
  return Promise.resolve(siteContent);
}

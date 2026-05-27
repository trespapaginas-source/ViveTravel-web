import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { defaultSiteContent } from "@/lib/content-defaults";
import type { SectionKey, SiteContentData } from "@/lib/content-types";
import { readFromCache, writeToCache } from "@/lib/cache";

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      console.warn("[Content API] Supabase client offline. Serviendo caché local...");
      const cached = await readFromCache<SiteContentData>("site_content", defaultSiteContent);
      return NextResponse.json(cached);
    }

    const { data, error } = await supabase
      .from("site_content")
      .select("section_key, content");

    if (error) {
      console.error("[Content API] Error al obtener datos de Supabase, usando caché:", error);
      const cached = await readFromCache<SiteContentData>("site_content", defaultSiteContent);
      return NextResponse.json(cached);
    }

    const result = { ...defaultSiteContent } as Record<SectionKey, unknown>;
    const keys = Object.keys(defaultSiteContent) as SectionKey[];

    for (const row of data || []) {
      const key = row.section_key as SectionKey;
      if (keys.includes(key) && row.content) {
        if (key === "international") {
          const supabaseContent = row.content as Record<string, any>;
          const supabaseDestinations = supabaseContent.destinations || [];
          
          const mergedDestinations = supabaseDestinations.map((dest: any) => {
            const fallbackDest = defaultSiteContent.international.destinations.find(
              (d: any) => d.name.toLowerCase() === dest.name.toLowerCase()
            );
            return {
              ...fallbackDest,
              ...dest
            };
          });

          result[key] = {
            ...defaultSiteContent[key],
            ...supabaseContent,
            destinations: mergedDestinations
          };
        } else {
          result[key] = {
            ...defaultSiteContent[key],
            ...(row.content as Record<string, unknown>),
          };
        }
      }
    }

    // Actualizar caché persistente en disco
    await writeToCache("site_content", result);

    return NextResponse.json(result as SiteContentData);
  } catch (error) {
    console.error("[Content API] Error inesperado, usando caché:", error);
    const cached = await readFromCache<SiteContentData>("site_content", defaultSiteContent);
    return NextResponse.json(cached);
  }
}
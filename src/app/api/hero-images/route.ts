import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { heroImages as fallbackHero } from "@/lib/data";
import { readFromCache, writeToCache } from "@/lib/cache";

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      console.warn("[Hero-Images API] Supabase client offline. Serviendo caché local...");
      const cached = await readFromCache<any[]>("hero_images", fallbackHero);
      return NextResponse.json(cached);
    }

    const { data, error } = await supabase
      .from("hero_images")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("[Hero-Images API] Error o sin imágenes en Supabase, usando caché:", error);
      const cached = await readFromCache<any[]>("hero_images", fallbackHero);
      return NextResponse.json(cached);
    }

    const mapped = data.map((h: any) => ({
      id: h.id,
      url: h.url,
      caption: h.caption || ""
    }));

    // Actualizar caché persistente en disco
    await writeToCache("hero_images", mapped);

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("[Hero-Images API] Error inesperado, usando caché:", err);
    const cached = await readFromCache<any[]>("hero_images", fallbackHero);
    return NextResponse.json(cached);
  }
}

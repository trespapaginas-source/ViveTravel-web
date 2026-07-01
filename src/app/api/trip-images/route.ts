import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { pastTripImages as fallbackTrips } from "@/lib/data";
import { readFromCache, writeToCache } from "@/lib/cache";

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      console.warn("[Trip-Images API] Supabase client offline. Serviendo caché local...");
      const cached = await readFromCache<any[]>("trip_images", fallbackTrips);
      return NextResponse.json(cached);
    }

    const { data, error } = await supabase
      .from("trip_images")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("[Trip-Images API] Error o sin imágenes de viajes en Supabase, usando caché:", error);
      const cached = await readFromCache<any[]>("trip_images", fallbackTrips);
      return NextResponse.json(cached);
    }

    const mapped = data.map((t: any) => ({
      id: t.id,
      url: t.url,
      caption: t.caption || ""
    }));

    // Actualizar caché persistente en disco
    await writeToCache("trip_images", mapped);

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("[Trip-Images API] Error inesperado, usando caché:", err);
    const cached = await readFromCache<any[]>("trip_images", fallbackTrips);
    return NextResponse.json(cached);
  }
}

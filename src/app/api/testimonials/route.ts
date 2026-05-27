import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { testimonials as fallbackTestimonials } from "@/lib/data";
import { readFromCache, writeToCache } from "@/lib/cache";

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      console.warn("[Testimonials API] Supabase client offline. Serviendo caché local...");
      const cached = await readFromCache<any[]>("testimonials", fallbackTestimonials);
      return NextResponse.json(cached);
    }

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("[Testimonials API] Error o sin testimonios en Supabase, usando caché:", error);
      const cached = await readFromCache<any[]>("testimonials", fallbackTestimonials);
      return NextResponse.json(cached);
    }

    const mapped = data.map((t: any) => ({
      id: t.id,
      name: t.name,
      avatar: t.avatar || t.name.substring(0, 2).toUpperCase(),
      location: t.location || "",
      text: t.text || "",
      rating: Number(t.rating) || 5,
      tripName: t.trip_name || ""
    }));

    // Actualizar caché persistente en disco
    await writeToCache("testimonials", mapped);

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("[Testimonials API] Error inesperado, usando caché:", err);
    const cached = await readFromCache<any[]>("testimonials", fallbackTestimonials);
    return NextResponse.json(cached);
  }
}

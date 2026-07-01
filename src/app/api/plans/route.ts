import { NextResponse } from "next/server";
import { tourPlans } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { readFromCache, writeToCache } from "@/lib/cache";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Si Supabase no está configurado (retorna null), hacemos fallback a la caché local
    if (!supabase) {
      console.warn("[Plans API] Supabase client offline. Serviendo caché local...");
      const cached = await readFromCache<any[]>("plans", tourPlans);
      return NextResponse.json(cached);
    }

    const { data, error } = await supabase
      .from("tour_plans")
      .select(`
        *,
        plan_categories (name, slug),
        plan_images (url, sort_order),
        plan_includes (text, sort_order),
        plan_excludes (text, sort_order),
        plan_highlights (text, sort_order)
      `)
      .order("sort_order", { ascending: true });

    if (error || !data) {
      console.error("[Plans API] Error al obtener planes de Supabase, usando caché:", error);
      const cached = await readFromCache<any[]>("plans", tourPlans);
      return NextResponse.json(cached);
    }

    // Mapear los datos de Supabase para que coincidan exactamente con la estructura esperada por el frontend
    const mappedPlans = data.map((row: any) => {
      const sortedImages = (row.plan_images || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((img: any) => img.url);
      
      const sortedIncludes = (row.plan_includes || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((inc: any) => inc.text);

      const sortedExcludes = (row.plan_excludes || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((exc: any) => exc.text);

      const sortedHighlights = (row.plan_highlights || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((hl: any) => hl.text);

      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        shortDescription: row.short_description || "",
        fullDescription: row.full_description || "",
        images: sortedImages.length > 0 ? sortedImages : ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"],
        price: row.price,
        priceRange: row.price_range || "",
        duration: row.duration || "",
        location: row.location || "",
        category: row.plan_categories?.name || "Otros",
        includes: sortedIncludes,
        excludes: sortedExcludes,
        highlights: sortedHighlights,
        rating: Number(row.rating) || 0,
        reviewCount: row.review_count || 0,
        maxGuests: row.max_guests || 1,
        difficulty: row.difficulty || "Fácil",
        schedule: row.schedule || "",
        meeting: row.meeting_point || "",
        published: row.published,
        order: row.sort_order,
        // Si es grupal y tiene fecha (se puede simular o extraer del horario)
        fecha_salida: row.plan_categories?.slug === 'grupales' ? (row.schedule || undefined) : undefined
      };
    });

    // Actualizar caché persistente en disco
    await writeToCache("plans", mappedPlans);

    return NextResponse.json(mappedPlans);
  } catch (err) {
    console.error("[Plans API] Error inesperado, usando caché:", err);
    const cached = await readFromCache<any[]>("plans", tourPlans);
    return NextResponse.json(cached);
  }
}
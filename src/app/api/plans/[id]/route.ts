import { NextRequest, NextResponse } from "next/server";
import { tourPlans } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const supabase = await createClient();
    
    // Si no hay Supabase configurado, usamos fallback local
    if (!supabase) {
      const plan = tourPlans.find((p) => p.id === id || p.slug === id);
      if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(plan);
    }

    // Para evitar que PostgreSQL lance un error si "id" no es un UUID válido al buscar por columna UUID,
    // verificamos con una expresión regular si tiene formato UUID.
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let query = supabase
      .from("tour_plans")
      .select(`
        *,
        plan_categories (name, slug),
        plan_images (url, sort_order),
        plan_includes (text, sort_order),
        plan_excludes (text, sort_order),
        plan_highlights (text, sort_order)
      `);

    if (isUuid) {
      query = query.or(`id.eq.${id},slug.eq.${id}`);
    } else {
      query = query.eq("slug", id);
    }

    const { data: row, error } = await query.maybeSingle();

    if (error || !row) {
      // Si hay error en Supabase o no encuentra, hacemos fallback secundario a local
      const plan = tourPlans.find((p) => p.id === id || p.slug === id);
      if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(plan);
    }

    // Mapear el objeto individual para el frontend
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

    const localPlan = tourPlans.find((p) => p.id === row.id || p.slug === row.slug);
    const mappedPlan = {
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
      fecha_salida: row.plan_categories?.slug === 'grupales' ? (row.schedule || undefined) : undefined,
      itinerary: localPlan?.itinerary || undefined
    };

    return NextResponse.json(mappedPlan);
  } catch (err) {
    console.error("Error en API de plan individual, usando fallback:", err);
    const plan = tourPlans.find((p) => p.id === id || p.slug === id);
    if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(plan);
  }
}
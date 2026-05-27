import { NextRequest, NextResponse } from "next/server";
import { cabins } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const supabase = await createClient();
    
    // Si no hay Supabase configurado, usamos fallback local
    if (!supabase) {
      const cabin = cabins.find((c) => c.id === id || c.slug === id);
      if (!cabin) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(cabin);
    }

    // Para evitar que PostgreSQL lance un error si "id" no es un UUID válido al buscar por columna UUID,
    // verificamos con una expresión regular si tiene formato UUID.
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let query = supabase
      .from("cabins")
      .select(`
        *,
        cabin_images (url, sort_order),
        cabin_amenities (text, sort_order),
        cabin_highlights (text, sort_order),
        cabin_rules (text, sort_order)
      `);

    if (isUuid) {
      query = query.or(`id.eq.${id},slug.eq.${id}`);
    } else {
      query = query.eq("slug", id);
    }

    const { data: row, error } = await query.maybeSingle();

    if (error || !row) {
      // Si hay error en Supabase o no encuentra, hacemos fallback secundario a local
      const cabin = cabins.find((c) => c.id === id || c.slug === id);
      if (!cabin) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(cabin);
    }

    // Mapear el objeto individual para el frontend
    const sortedImages = (row.cabin_images || [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((img: any) => img.url);

    const sortedAmenities = (row.cabin_amenities || [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((ame: any) => ame.text);

    const sortedHighlights = (row.cabin_highlights || [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((hl: any) => hl.text);

    const sortedRules = (row.cabin_rules || [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((rule: any) => rule.text);

    const mappedCabin = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      shortDescription: row.short_description || "",
      fullDescription: row.full_description || "",
      images: sortedImages.length > 0 ? sortedImages : ["https://images.unsplash.com/photo-1499793983394-e58f8b6a1109?w=800&h=600&fit=crop&q=80"],
      pricePerNight: row.price_per_night,
      priceRange: row.price_range || "",
      location: row.location || "",
      capacity: row.capacity || 2,
      bedrooms: row.bedrooms || 1,
      bathrooms: row.bathrooms || 1,
      amenities: sortedAmenities,
      highlights: sortedHighlights,
      rules: sortedRules,
      rating: Number(row.rating) || 0,
      reviewCount: row.review_count || 0,
      coordinates: {
        lat: Number(row.lat) || 0,
        lng: Number(row.lng) || 0
      },
      checkIn: row.check_in || "3:00 PM",
      checkOut: row.check_out || "11:00 AM",
      cancellationPolicy: row.cancellation_policy || "",
      bedroomDetails: row.bedroom_details || null,
      published: row.published,
      order: row.sort_order
    };

    return NextResponse.json(mappedCabin);
  } catch (err) {
    console.error("Error en API de cabaña individual, usando fallback:", err);
    const cabin = cabins.find((c) => c.id === id || c.slug === id);
    if (!cabin) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(cabin);
  }
}
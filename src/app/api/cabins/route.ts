import { NextResponse } from "next/server";
import { cabins } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { readFromCache, writeToCache } from "@/lib/cache";

export async function GET() {
  const localFallback = [...cabins].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  try {
    const supabase = await createClient();
    
    // Si Supabase no está configurado, usamos fallback local ordenado desde la caché
    if (!supabase) {
      console.warn("[Cabins API] Supabase client offline. Serviendo caché local...");
      const cached = await readFromCache<any[]>("cabins", localFallback);
      return NextResponse.json(cached);
    }

    const { data, error } = await supabase
      .from("cabins")
      .select(`
        *,
        cabin_images (url, sort_order),
        cabin_amenities (text, sort_order),
        cabin_highlights (text, sort_order),
        cabin_rules (text, sort_order)
      `)
      .order("sort_order", { ascending: true });

    if (error || !data) {
      console.error("[Cabins API] Error al obtener cabañas de Supabase, usando caché:", error);
      const cached = await readFromCache<any[]>("cabins", localFallback);
      return NextResponse.json(cached);
    }

    // Mapear los datos de Supabase para que coincidan con la estructura esperada por el frontend
    const mappedCabins = data.map((row: any) => {
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

      return {
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
    });

    // Actualizar caché persistente en disco
    await writeToCache("cabins", mappedCabins);

    return NextResponse.json(mappedCabins);
  } catch (err) {
    console.error("[Cabins API] Error inesperado en API de cabañas, usando caché:", err);
    const cached = await readFromCache<any[]>("cabins", localFallback);
    return NextResponse.json(cached);
  }
}
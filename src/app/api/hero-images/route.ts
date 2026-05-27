import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { heroImages as fallbackHero } from "@/lib/data";

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json(fallbackHero);

    const { data, error } = await supabase
      .from("hero_images")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("No hero images found in Supabase, using fallback");
      return NextResponse.json(fallbackHero);
    }

    const mapped = data.map((h: any) => ({
      id: h.id,
      url: h.url,
      caption: h.caption || ""
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("Error in hero-images API:", err);
    return NextResponse.json(fallbackHero);
  }
}

export const runtime = 'edge';

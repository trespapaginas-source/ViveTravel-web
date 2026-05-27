import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { testimonials as fallbackTestimonials } from "@/lib/data";

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json(fallbackTestimonials);

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("No testimonials found in Supabase, using fallback");
      return NextResponse.json(fallbackTestimonials);
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

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("Error in testimonials API:", err);
    return NextResponse.json(fallbackTestimonials);
  }
}

export const runtime = 'edge';

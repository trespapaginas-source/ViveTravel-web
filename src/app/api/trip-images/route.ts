import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { pastTripImages as fallbackTrips } from "@/lib/data";

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json(fallbackTrips);

    const { data, error } = await supabase
      .from("trip_images")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("No trip images found in Supabase, using fallback");
      return NextResponse.json(fallbackTrips);
    }

    const mapped = data.map((t: any) => ({
      id: t.id,
      url: t.url,
      caption: t.caption || ""
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("Error in trip-images API:", err);
    return NextResponse.json(fallbackTrips);
  }
}

export const runtime = 'edge';

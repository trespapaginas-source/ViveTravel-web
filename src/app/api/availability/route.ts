import { NextRequest, NextResponse } from "next/server";
import cabinsData from "@/data/static/cabins.json";

export const runtime = "nodejs";
// This route fetches a live external ICS feed at request time — never
// prerender it. (node-ical also breaks under Turbopack's static eval.)
export const dynamic = "force-dynamic";
// Revalidate at most once per hour at the CDN level.
export const revalidate = 0;

type RawCabin = Record<string, unknown>;

interface BookedRange {
  from: string; // ISO date (yyyy-mm-dd)
  to: string; // ISO date (yyyy-mm-dd), inclusive
}

interface AvailabilityResponse {
  cabinId: string;
  hasCalendar: boolean;
  booked: BookedRange[];
  updatedAt: string;
  source: "cache" | "fetch" | "none";
}

// ─── In-memory cache (per server instance) ────────────────────────────────────
// Fastest possible reads on repeat: no network, no parse. TTL 1h, plus a stale
// entry kept as fallback if the upstream ICS is temporarily unreachable.
interface CacheEntry {
  data: AvailabilityResponse;
  expiresAt: number;
  staleUntil: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour fresh
const CACHE_STALE_MS = 6 * 60 * 60 * 1000; // 6 hours usable-when-stale
const cache = new Map<string, CacheEntry>();

function findCabinIcsUrl(cabinId: string): string | null {
  const cabin = (cabinsData as RawCabin[]).find(
    (c) => c.id === cabinId || c.slug === cabinId
  );
  if (!cabin) return null;
  const url = cabin.icsUrl;
  return typeof url === "string" && url.startsWith("http") ? url : null;
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseICalDate(icalStr: string): Date {
  const cleanStr = icalStr.replace(/[^0-9T]/g, "");
  const y = parseInt(cleanStr.substring(0, 4), 10);
  const m = parseInt(cleanStr.substring(4, 6), 10) - 1;
  const d = parseInt(cleanStr.substring(6, 8), 10);
  if (cleanStr.includes("T")) {
    const h = parseInt(cleanStr.substring(9, 11), 10) || 0;
    const min = parseInt(cleanStr.substring(11, 13), 10) || 0;
    const s = parseInt(cleanStr.substring(13, 15), 10) || 0;
    return new Date(Date.UTC(y, m, d, h, min, s));
  } else {
    return new Date(y, m, d, 0, 0, 0);
  }
}

/**
 * Extract booked date ranges directly from raw ICS content (0 external dependencies).
 */
function extractBookedRangesFromText(icalText: string): BookedRange[] {
  const lines = icalText.split(/\r?\n/);
  const ranges: BookedRange[] = [];
  let currentStart: Date | null = null;
  let currentEnd: Date | null = null;
  let inEvent = false;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (const line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) {
      inEvent = true;
      currentStart = null;
      currentEnd = null;
    } else if (line.startsWith("END:VEVENT")) {
      if (inEvent && currentStart && currentEnd) {
        let end = new Date(currentEnd);
        // Normalize exclusive end date
        if (end.getTime() > currentStart.getTime()) {
          end = new Date(end.getTime() - 24 * 60 * 60 * 1000);
        }
        if (end >= now) {
          const from = new Date(Math.max(currentStart.getTime(), now.getTime()));
          ranges.push({ from: toISODate(from), to: toISODate(end >= from ? end : from) });
        }
      }
      inEvent = false;
    } else if (inEvent) {
      if (line.startsWith("DTSTART")) {
        const idx = line.indexOf(":");
        if (idx !== -1) {
          currentStart = parseICalDate(line.substring(idx + 1));
        }
      } else if (line.startsWith("DTEND")) {
        const idx = line.indexOf(":");
        if (idx !== -1) {
          currentEnd = parseICalDate(line.substring(idx + 1));
        }
      }
    }
  }

  ranges.sort((a, b) => a.from.localeCompare(b.from));
  const merged: BookedRange[] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last) {
      const lastEnd = new Date(last.to + "T00:00:00");
      const lastEndPlus1 = new Date(lastEnd.getTime() + 24 * 60 * 60 * 1000);
      const curFrom = new Date(r.from + "T00:00:00");
      if (curFrom <= lastEndPlus1) {
        const curTo = new Date(r.to + "T00:00:00");
        const newTo = curTo > lastEnd ? r.to : last.to;
        last.to = newTo;
        continue;
      }
    }
    merged.push({ ...r });
  }

  return merged;
}

async function fetchAvailability(cabinId: string): Promise<AvailabilityResponse> {
  const icsUrl = findCabinIcsUrl(cabinId);

  // No calendar configured → respond instantly with empty booked list.
  if (!icsUrl) {
    return {
      cabinId,
      hasCalendar: false,
      booked: [],
      updatedAt: new Date().toISOString(),
      source: "none",
    };
  }

  const res = await fetch(icsUrl, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`ICS fetch failed: ${res.status}`);
  }
  const text = await res.text();
  const booked = extractBookedRangesFromText(text);

  return {
    cabinId,
    hasCalendar: true,
    booked,
    updatedAt: new Date().toISOString(),
    source: "fetch",
  };
}

export async function GET(request: NextRequest) {
  const cabinId = request.nextUrl.searchParams.get("cabin");
  if (!cabinId) {
    return NextResponse.json(
      { error: "Missing 'cabin' query parameter" },
      { status: 400 }
    );
  }

  const now = Date.now();

  // 1. Fresh cache hit — instant.
  const cached = cache.get(cabinId);
  if (cached && cached.expiresAt > now) {
    return NextResponse.json(
      { ...cached.data, source: "cache" },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  }

  try {
    const data = await fetchAvailability(cabinId);
    cache.set(cabinId, {
      data,
      expiresAt: now + CACHE_TTL_MS,
      staleUntil: now + CACHE_STALE_MS,
    });
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    // 2. Stale fallback if upstream is down but we have a recent-enough copy.
    if (cached && cached.staleUntil > now) {
      console.error(
        `[availability] ICS fetch failed for ${cabinId}, serving stale cache:`,
        err instanceof Error ? err.message : err
      );
      return NextResponse.json(
        { ...cached.data, source: "cache" },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
          },
        }
      );
    }

    // 3. No cache at all → fail open: respond with no blocked dates so the
    //    calendar stays usable, and surface a light error signal.
    console.error(
      `[availability] ICS fetch failed for ${cabinId} with no cache:`,
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(
      {
        cabinId,
        hasCalendar: false,
        booked: [],
        updatedAt: new Date().toISOString(),
        source: "none",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300",
        },
      }
    );
  }
}

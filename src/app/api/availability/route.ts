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

/**
 * Shape of a parsed VEVENT we care about. node-ical's full CalendarComponent
 * union is awkward to type (and we import it lazily to avoid build-time eval),
 * so we declare the narrow shape we consume.
 */
interface ParsedVEvent {
  type: string;
  start?: Date | string;
  end?: Date | string;
  datetype?: string;
}
type ParsedCalendar = Record<string, ParsedVEvent | undefined>;

/**
 * Extract booked date ranges from parsed ICS events. Handles all-day events
 * (type "string"/Date) and datetime events. Returns inclusive [from, to] ranges.
 */
function extractBookedRanges(parsed: ParsedCalendar): BookedRange[] {
  const ranges: BookedRange[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (const key of Object.keys(parsed)) {
    const raw = parsed[key];
    if (!raw || raw.type !== "VEVENT") continue;
    // node-ical's CalendarComponent union includes VCalendar (no start/end);
    // we've narrowed to VEVENT above, so cast to the VEVENT shape we need.
    const event = raw as {
      type: string;
      start: Date | string;
      end: Date | string;
      datetype?: string;
    };
    if (!event.start || !event.end) continue;

    // node-ical returns Date for datetimes and string|Date for all-day events.
    const start = event.start instanceof Date ? event.start : new Date(event.start);
    let end = event.end instanceof Date ? event.end : new Date(event.end);

    // All-day ICS events use an exclusive end date (DTEND is the day AFTER the
    // last booked night). Normalize to an inclusive end.
    const isAllDay = typeof event.datetype === "string" && event.datetype.toLowerCase() === "date";
    if (isAllDay) {
      end = new Date(end.getTime() - 24 * 60 * 60 * 1000);
    }

    // Skip past events entirely — no need to block dates that already happened.
    if (end < now) continue;

    const from = new Date(Math.max(start.getTime(), now.getTime()));
    ranges.push({ from: toISODate(from), to: toISODate(end) });
  }

  // Merge overlapping/adjacent ranges for cleaner client-side handling.
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
  // Lazy import: node-ical pulls in rrule/moment which break under Turbopack's
  // static eval at build time. Loading it at request time avoids that.
  const ical = (await import("node-ical")).default;
  const parsed = ical.parseICS(text) as ParsedCalendar;
  const booked = extractBookedRanges(parsed);

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

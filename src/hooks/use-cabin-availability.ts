"use client";

import { useQuery } from "@tanstack/react-query";

export interface BookedRange {
  from: string; // ISO date (yyyy-mm-dd)
  to: string; // ISO date (yyyy-mm-dd), inclusive
}

export interface AvailabilityData {
  cabinId: string;
  hasCalendar: boolean;
  booked: BookedRange[];
  updatedAt: string;
  source: "cache" | "fetch" | "none";
}

/**
 * Fetches the booked-date ranges for a cabin from the /api/availability route,
 * which reads and caches the cabin's ICS (iCalendar) feed server-side.
 *
 * Returns a list of normalized inclusive date ranges that the calendar can mark
 * as occupied. Cached for 30 min on the client to avoid refetches.
 */
export function useCabinAvailability(cabinId: string | null | undefined) {
  return useQuery<AvailabilityData>({
    queryKey: ["availability", cabinId],
    queryFn: async () => {
      const res = await fetch(`/api/availability?cabin=${encodeURIComponent(cabinId!)}`);
      if (!res.ok) {
        throw new Error(`Availability fetch failed: ${res.status}`);
      }
      return res.json() as Promise<AvailabilityData>;
    },
    enabled: !!cabinId,
    staleTime: 30 * 60 * 1000, // 30 min
    gcTime: 60 * 60 * 1000, // 1 h
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

/**
 * Convert booked ranges (yyyy-mm-dd) into an array of Date objects spanning
 * every occupied day. Useful for react-day-picker's `modifiers` / `disabled`.
 */
export function expandBookedRanges(ranges: BookedRange[]): Date[] {
  const days: Date[] = [];
  const seen = new Set<string>();
  for (const r of ranges) {
    const start = new Date(r.from + "T00:00:00");
    const end = new Date(r.to + "T00:00:00");
    const cursor = new Date(start);
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      if (!seen.has(key)) {
        seen.add(key);
        days.push(new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  return days;
}

/**
 * Check whether a given date range overlaps any booked range. Used to validate
 * a user's selection in the booking widget.
 */
export function isRangeBooked(
  from: Date,
  to: Date,
  ranges: BookedRange[]
): boolean {
  const f = new Date(from);
  f.setHours(0, 0, 0, 0);
  const t = new Date(to);
  t.setHours(0, 0, 0, 0);
  return ranges.some((r) => {
    const rFrom = new Date(r.from + "T00:00:00");
    const rTo = new Date(r.to + "T00:00:00");
    return f <= rTo && t >= rFrom;
  });
}

/**
 * Given a check-in date and the list of booked days, return the last
 * selectable check-out day — i.e. the day BEFORE the first booked day that
 * follows the check-in. This is what makes a range behave like Airbnb/Booking:
 * once the user picks a `from`, they can only pick a contiguous run of free
 * nights up to (but not crossing) the next occupied day.
 *
 * Returns `null` when there is no blocking day ahead (open-ended availability).
 */
export function getRangeLimit(from: Date, bookedDays: Date[]): Date | null {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);

  const upcoming = bookedDays
    .filter((d) => {
      const day = new Date(d);
      day.setHours(0, 0, 0, 0);
      // A booked day counts as a boundary only if it is strictly AFTER the
      // check-in (the checkout day itself may equal a booked day in ICS terms,
      // but the night of check-in must be free).
      return day.getTime() > start.getTime();
    })
    .sort((a, b) => a.getTime() - b.getTime());

  if (upcoming.length === 0) return null;

  const firstBlock = new Date(upcoming[0]);
  firstBlock.setHours(0, 0, 0, 0);
  // The limit is the day before the first block — the last free checkout day.
  const limit = new Date(firstBlock);
  limit.setDate(limit.getDate() - 1);
  return limit;
}

/**
 * react-day-picker `disabled` matcher factory for the in-progress range case.
 * When the user has picked a `from` but not yet a `to`, every day AFTER the
 * contiguous free run must be non-selectable so the range can't cross a booked
 * night. Combine the result with the usual `{ before: today }` + booked days.
 */
export function buildRangeDisabledAfterFrom(
  from: Date | undefined,
  bookedDays: Date[]
): { after: Date }[] {
  if (!from) return [];
  const limit = getRangeLimit(from, bookedDays);
  if (!limit) return [];
  return [{ after: limit }];
}

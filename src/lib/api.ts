import type { TourPlan, Cabin, TransportVehicle } from "./data";
import plansData from "@/data/static/plans.json";
import cabinsData from "@/data/static/cabins.json";
import testimonialsData from "@/data/static/testimonials.json";
import heroImagesData from "@/data/static/hero-images.json";
import transportsData from "@/data/static/transports.json";
import { pastTripImages } from "@/lib/data";

type RawRecord = Record<string, unknown>;

export async function fetchPlans(): Promise<TourPlan[]> {
  return (plansData as RawRecord[]).map(normalizePlan);
}

export async function fetchTransports(): Promise<TransportVehicle[]> {
  return transportsData as TransportVehicle[];
}

export async function fetchTransport(id: string): Promise<TransportVehicle | null> {
  const vehicle = (transportsData as RawRecord[]).find(
    (item) => item.id === id
  );
  return vehicle ? (vehicle as unknown as TransportVehicle) : null;
}

export async function fetchPlan(id: string): Promise<TourPlan | null> {
  const plan = (plansData as RawRecord[]).find((item) => item.id === id || item.slug === id);
  return plan ? normalizePlan(plan) : null;
}

export async function fetchCabins(): Promise<Cabin[]> {
  return (cabinsData as RawRecord[]).map(normalizeCabin);
}

export async function fetchCabin(id: string): Promise<Cabin | null> {
  const cabin = (cabinsData as RawRecord[]).find((item) => item.id === id || item.slug === id);
  return cabin ? normalizeCabin(cabin) : null;
}

export async function fetchHeroImages(): Promise<Array<{ id: string; url: string; caption: string; mobileUrl?: string }>> {
  return heroImagesData as Array<{ id: string; url: string; caption: string; mobileUrl?: string }>;
}

export async function fetchTripImages(): Promise<Array<{ id: string; url: string; caption: string }>> {
  return pastTripImages;
}

export async function fetchTestimonials(): Promise<Array<{ id: string; name: string; avatar: string; location: string; text: string; rating: number; tripName: string; avatarBg?: string; ownerResponse?: string; avatarUrl?: string }>> {
  return testimonialsData as Array<{ id: string; name: string; avatar: string; location: string; text: string; rating: number; tripName: string; avatarBg?: string; ownerResponse?: string; avatarUrl?: string }>;
}

function normalizePlan(plan: RawRecord): TourPlan {
  return {
    ...plan,
    images: safeParse(plan.images),
    includes: safeParse(plan.includes),
    excludes: safeParse(plan.excludes),
    highlights: safeParse(plan.highlights),
  } as TourPlan;
}

function normalizeCabin(cabin: RawRecord): Cabin {
  return {
    ...cabin,
    images: safeParse(cabin.images),
    amenities: safeParse(cabin.amenities),
    highlights: safeParse(cabin.highlights),
    rules: safeParse(cabin.rules),
    bedroomDetails: Array.isArray(cabin.bedroomDetails) ? cabin.bedroomDetails : [],
    coordinates: normalizeCoordinates(cabin),
  } as Cabin;
}

function normalizeCoordinates(cabin: RawRecord): { lat: number; lng: number } {
  if (typeof cabin.coordinates === "object" && cabin.coordinates !== null) {
    const coords = cabin.coordinates as { lat?: unknown; lng?: unknown };
    return {
      lat: typeof coords.lat === "number" ? coords.lat : 0,
      lng: typeof coords.lng === "number" ? coords.lng : 0,
    };
  }

  return {
    lat: typeof cabin.lat === "number" ? cabin.lat : 0,
    lng: typeof cabin.lng === "number" ? cabin.lng : 0,
  };
}

function safeParse(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

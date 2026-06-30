import type { TourPlan, Cabin } from "./data";
import { plans } from "@/data/plans";
import { cabins } from "@/data/cabins";
import { heroImages } from "@/data/hero-images";
import { pastTripImages } from "@/data/trip-images";
import { testimonials } from "@/data/testimonials";

// ─── API helpers ──────────────────────────────────────────────────────────────

export async function fetchPlans(): Promise<TourPlan[]> {
  return Promise.resolve(plans);
}

export async function fetchPlan(id: string): Promise<TourPlan | null> {
  const plan = plans.find((p) => p.id === id) || null;
  return Promise.resolve(plan);
}

export async function fetchCabins(): Promise<Cabin[]> {
  return Promise.resolve(cabins);
}

export async function fetchCabin(id: string): Promise<Cabin | null> {
  const cabin = cabins.find((c) => c.id === id) || null;
  return Promise.resolve(cabin);
}

export async function fetchHeroImages(): Promise<Array<{ id: string; url: string; caption: string }>> {
  return Promise.resolve(heroImages);
}

export async function fetchTripImages(): Promise<Array<{ id: string; url: string; caption: string }>> {
  return Promise.resolve(pastTripImages);
}

export async function fetchTestimonials(): Promise<Array<{ id: string; name: string; avatar: string; location: string; text: string; rating: number; tripName: string }>> {
  return Promise.resolve(testimonials);
}

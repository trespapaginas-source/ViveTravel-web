"use client";

import { HeroSection } from "@/components/home/hero-section";
import { FeaturedPlans } from "@/components/home/featured-plans";
import { GroupTrips } from "@/components/home/group-trips";
import { CustomTrips } from "@/components/home/custom-trips";
import { Testimonials } from "@/components/home/testimonials";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedPlans />
      <Testimonials />
      <GroupTrips />
      <CustomTrips />
    </>
  );
}

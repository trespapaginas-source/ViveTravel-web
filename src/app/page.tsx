"use client";

import { lazy, Suspense, useRef, useState, useEffect, type ReactNode } from "react";
import { useNavigation } from "@/lib/store";
import { usePrefetchData } from "@/hooks/use-prefetch-data";
import { Navbar } from "@/components/layout/navbar";
import { StickySummaryBar } from "@/components/layout/sticky-summary-bar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { VideoShowcase } from "@/components/home/video-showcase";

import { FeaturedPlans } from "@/components/home/featured-plans";
import { DestinationsGallery } from "@/components/home/destinations-gallery";
import { InternationalDestinations } from "@/components/home/international-destinations";
import { TravelCarousel } from "@/components/home/travel-carousel";
import { GroupTrips } from "@/components/home/group-trips";
import { CustomTrips } from "@/components/home/custom-trips";
import { Testimonials } from "@/components/home/testimonials";
import { PromotionsBanner } from "@/components/home/promotions-banner";
import { TeamSection } from "@/components/team/team-section";
import { useSiteContent } from "@/lib/use-site-content";

// Lazy load all non-home views — these are NOT needed on initial page load
const PlansList = lazy(() =>
  import("@/components/plans/plans-list").then((m) => ({ default: m.PlansList }))
);
const PlanDetail = lazy(() =>
  import("@/components/plans/plan-detail").then((m) => ({ default: m.PlanDetail }))
);
const CabinsList = lazy(() =>
  import("@/components/cabins/cabins-list").then((m) => ({ default: m.CabinsList }))
);
const CabinDetail = lazy(() =>
  import("@/components/cabins/cabin-detail").then((m) => ({ default: m.CabinDetail }))
);
const ContactSection = lazy(() =>
  import("@/components/contact/contact-section").then((m) => ({ default: m.ContactSection }))
);
const PoliciesSection = lazy(() =>
  import("@/components/policies/policies-section").then((m) => ({ default: m.PoliciesSection }))
);
const FavoritesSection = lazy(() =>
  import("@/components/favorites/favorites-section").then((m) => ({ default: m.FavoritesSection }))
);




function HomeView() {
  const { content } = useSiteContent();
  const { order = [], active = {} } = content.homeConfig || {};

  const componentsRegistry: Record<string, React.ReactNode> = {
    hero: <HeroSection key="hero" />,
    promotions: <PromotionsBanner key="promotions-banner" />,
    plans: <FeaturedPlans key="plans" />,
    gallery: <DestinationsGallery key="gallery" />,
    international: <InternationalDestinations key="international" />,
    stats: <TravelCarousel key="stats" />,
    groups: <GroupTrips key="groups" />,
    custom: <CustomTrips key="custom" />,
    testimonials: <Testimonials key="testimonials" />,
    team: <TeamSection key="team" />,
  };

  return (
    <>
      {order.map((sectionKey) => {
        if (active[sectionKey] && componentsRegistry[sectionKey]) {
          return componentsRegistry[sectionKey];
        }
        return null;
      })}
    </>
  );
}

function ViewSkeleton() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-ocean border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ViewRouter() {
  const { currentView } = useNavigation();

  switch (currentView) {
    case "home":
      return <HomeView />;
    case "plans":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <PlansList />
        </Suspense>
      );
    case "plan-detail":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <PlanDetail />
        </Suspense>
      );
    case "cabins":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <CabinsList />
        </Suspense>
      );
    case "cabin-detail":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <CabinDetail />
        </Suspense>
      );
    case "contact":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <ContactSection />
        </Suspense>
      );
    case "policies":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <PoliciesSection />
        </Suspense>
      );
    case "team":
      return <TeamSection />;
    case "favorites":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <FavoritesSection />
        </Suspense>
      );
    default:
      return <HomeView />;
  }
}

export default function HomePage() {
  const { currentView, searchIsSticky, searchDestination } = useNavigation();
  const isHome = currentView === "home";
  
  const showSticky = searchIsSticky && searchDestination;
  const mainPadding = isHome 
    ? "" 
    : showSticky 
      ? "pt-44 md:pt-32" 
      : "pt-16 sm:pt-20";

  // Prefetch plans & cabins data in background so navigation is instant
  usePrefetchData();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <StickySummaryBar />
      <main className={`flex-1 ${mainPadding}`}>
        <ViewRouter />
      </main>
      <Footer />
    </div>
  );
}

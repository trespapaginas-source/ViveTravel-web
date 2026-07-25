"use client";

import { HeroSection } from "@/components/home/hero-section";
import { PromotionsBanner } from "@/components/home/promotions-banner";
import { TickerRibbon } from "@/components/home/ticker-ribbon";
import { FeaturedPlans } from "@/components/home/featured-plans";
import { ScheduledDeparturesBanner } from "@/components/home/scheduled-departures-banner";
import { DestinationsGallery } from "@/components/home/destinations-gallery";
import { ScheduledDepartures } from "@/components/home/scheduled-departures";
import { InternationalDestinations } from "@/components/home/international-destinations";
import { GroupTrips } from "@/components/home/group-trips";
import { CustomTrips, ReadyCTA } from "@/components/home/custom-trips";
import { Testimonials } from "@/components/home/testimonials";
import { TeamSection } from "@/components/team/team-section";
import { useSiteContent } from "@/lib/use-site-content";

export default function HomePage() {
  const { content } = useSiteContent();
  const { order = [], active = {} } = content.homeConfig || {};

  const componentsRegistry: Record<string, React.ReactNode> = {
    hero: <HeroSection key="hero" />,
    promotions: <PromotionsBanner key="promotions-banner" />,
    ticker: <TickerRibbon key="ticker" />,
    plans: <FeaturedPlans key="plans" />,
    bannerSalidas: <ScheduledDeparturesBanner key="banner-salidas" />,
    gallery: <DestinationsGallery key="gallery" />,
    salidas: <ScheduledDepartures key="salidas" />,
    international: <InternationalDestinations key="international" />,
    groups: <GroupTrips key="groups" />,
    custom: <CustomTrips key="custom" />,
    readyCta: <ReadyCTA key="ready-cta" />,
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

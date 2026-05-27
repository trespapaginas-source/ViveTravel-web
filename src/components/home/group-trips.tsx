"use client";

import { Users, Percent, Calendar, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/lib/store";
import { useSiteContent } from "@/lib/use-site-content";

export function GroupTrips() {
  const { navigate } = useNavigation();
  const { content } = useSiteContent();
  const groupTrips = content.groupTrips;
  const iconsMap = [Percent, Calendar, Heart, Users];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden content-visibility-auto contain-intrinsic-size-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-50 border-y border-gray-100" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs font-medium tracking-wider uppercase">
                <Users className="w-3.5 h-3.5" />
                {groupTrips.label}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              {groupTrips.title}{" "}
              <span className="text-muted-foreground">{groupTrips.titleHighlight}</span>
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg mb-8 leading-relaxed max-w-lg">
              {groupTrips.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                onClick={() => navigate("contact")}
                className="bg-ocean text-white hover:bg-ocean-dark px-6 sm:px-8 py-5 sm:py-6 text-base rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
              >
                {groupTrips.ctaQuote}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("plans", "grupales")}
                className="border-gray-200 text-foreground hover:bg-gray-100 backdrop-blur-sm px-6 py-5 sm:py-6 text-base rounded-xl transition-colors duration-200 bg-transparent"
              >
                {groupTrips.ctaPlans}
              </Button>
            </div>

            {/* Quick stats */}
            <div className="mt-8 flex flex-wrap gap-4 sm:gap-8">
              {groupTrips.stats.map((stat) => (
                <div key={stat.label} className="min-w-[80px]">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Benefit cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groupTrips.benefits.map((benefit, index) => {
              const Icon = iconsMap[index] || Users;
              return (
                <div
                  key={benefit.title}
                  className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 sm:p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="mb-3">
                    <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-foreground font-semibold text-sm sm:text-base mb-1.5">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

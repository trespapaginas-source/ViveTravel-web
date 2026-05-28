"use client";

import {
  Compass,
  DollarSign,
  Map,
  MessageCircle,
  ArrowRight,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/lib/store";
import { useSiteContent } from "@/lib/use-site-content";

export function CustomTrips() {
  const { navigate } = useNavigation();
  const { content } = useSiteContent();
  const custom = content.customTrips;
  const iconsMap = [Compass, Map, DollarSign];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden content-visibility-auto contain-intrinsic-size-auto">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-muted/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs font-medium tracking-wider uppercase">
              <Waves className="w-3.5 h-3.5" />
              {custom.label}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            {custom.title}{" "}
            <span className="text-muted-foreground">{custom.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {custom.description}
          </p>
        </div>

        {/* Benefits cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {custom.benefits.map((benefit, index) => {
            const Icon = iconsMap[index] || Compass;
            return (
              <div key={benefit.title} className="group">
                <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 h-full">
                  <div className="mb-4 sm:mb-5">
                    <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-foreground font-semibold text-lg sm:text-xl mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Card */}
        <div className="relative bg-gray-50 border border-gray-100 rounded-3xl overflow-hidden">
          <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-10 sm:py-14 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                {custom.ctaTitle}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base max-w-lg leading-relaxed">
                {custom.ctaDescription}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-stretch shrink-0">
              <Button
                size="lg"
                onClick={() => navigate("contact")}
                className="w-full max-w-[260px] sm:w-auto bg-ocean text-white hover:bg-ocean-dark px-6 sm:px-8 py-5 sm:py-6 text-base rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {custom.ctaContact}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("plans")}
                className="w-full max-w-[260px] sm:w-auto border-gray-200 text-foreground hover:bg-gray-100 px-6 py-5 sm:py-6 text-base rounded-xl transition-colors duration-200 bg-transparent"
              >
                {custom.ctaPlans}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

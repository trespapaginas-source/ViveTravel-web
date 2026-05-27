"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useNavigation, type ViewType } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EXPERIENCE_SECTIONS, type ExperienceSectionId } from "@/lib/experience-sections";
import { ChevronDown, Menu, Phone, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/lib/use-site-content";

const navItems = [
  { key: "home" as const, label: "Inicio" },
  { key: "cabins" as const, label: "Cabañas" },
  { key: "team" as const, label: "Equipo" },
  { key: "contact" as const, label: "Contacto" },
  { key: "policies" as const, label: "Políticas" },
];

/** Check if a nav item is active, including nested detail views */
function isItemActive(itemKey: string, currentView: ViewType): boolean {
  if (currentView === itemKey) return true;
  if (itemKey === "plans" && currentView === "plan-detail") return true;
  if (itemKey === "cabins" && currentView === "cabin-detail") return true;
  return false;
}

export function Navbar() {
  const { currentView, navigate } = useNavigation();
  const { content } = useSiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const tickingRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  const isHome = currentView === "home" && pathname === "/";
  const showOpaque = !isHome || scrolled;

  // Throttled scroll handler using rAF — avoids excessive re-renders
  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigate first, then close mobile menu after the next frame
  // so the view has time to render before the Sheet starts closing
  const handleNav = useCallback(
    (view: Parameters<typeof navigate>[0]) => {
      navigate(view);
      
      if (pathname !== "/") {
        router.push("/");
      }
      
      // Use requestAnimationFrame to ensure navigation renders before Sheet closes
      // This prevents the visual glitch where the old view is visible behind the closing Sheet
      requestAnimationFrame(() => {
        setMobileOpen(false);
      });
    },
    [navigate, pathname, router]
  );

  const handleExperienceNav = useCallback(
    (section: ExperienceSectionId) => {
      navigate("plans", section);

      if (pathname !== "/") {
        router.push("/");
      }

      requestAnimationFrame(() => {
        setMobileOpen(false);
      });
    },
    [navigate, pathname, router]
  );

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300",
        content.campaign?.active && isHome && !scrolled ? "top-[36px]" : "top-0",
        showOpaque
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNav("home")}
            className="flex items-center group"
          >
            <img               src={showOpaque ? "/logos/vive-travel-original.png" : "/logos/vive-travel-white.png"}
              alt="Vive Travel"
              width={120}
              height={48}
              className="h-10 sm:h-12 w-auto transition-all duration-300"
             onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {content.navbar.navItems.map((item) => {
              if (item.key === "plans") {
                return (
                  <DropdownMenu key="plans">
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "px-2.5 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-colors duration-200 flex items-center gap-1.5",
                          isItemActive("plans", currentView)
                            ? showOpaque
                              ? "bg-ocean text-white"
                              : "bg-white/20 backdrop-blur-sm text-white"
                            : showOpaque
                            ? "text-muted-foreground hover:bg-muted hover:text-ocean-dark"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {item.label}
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="min-w-52">
                      {EXPERIENCE_SECTIONS.map((section) => (
                        <DropdownMenuItem
                          key={section.id}
                          onClick={() => handleExperienceNav(section.id)}
                          className="cursor-pointer"
                        >
                          {section.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.key as any)}
                  className={cn(
                    "px-2.5 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-colors duration-200",
                    isItemActive(item.key, currentView)
                      ? showOpaque
                        ? "bg-ocean text-white"
                        : "bg-white/20 backdrop-blur-sm text-white"
                      : showOpaque
                      ? "text-muted-foreground hover:bg-muted hover:text-ocean-dark"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* CTA + Favorites + Mobile */}
          <div className="flex items-center gap-2">
            {/* Favorites */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNav("favorites")}
              className={cn(
                "rounded-full h-10 w-10 sm:h-9 sm:w-9 transition-colors duration-200",
                currentView === "favorites"
                  ? showOpaque
                    ? "bg-ocean/10 text-ocean"
                    : "bg-white/20 text-white"
                  : showOpaque
                  ? "text-muted-foreground hover:text-ocean hover:bg-ocean/5"
                  : "text-white/50 hover:text-white hover:bg-white/10"
              )}
              aria-label="Mis favoritos"
            >
              <Heart className={cn(
                "w-4 h-4",
                currentView === "favorites" && "fill-current"
              )} />
            </Button>

            {/* Reservar CTA */}
            <Button
              onClick={() => handleNav("contact")}
              className={cn(
                "hidden sm:flex items-center gap-2 rounded-full transition-colors duration-200",
                showOpaque
                  ? "bg-ocean hover:bg-ocean-dark text-white"
                  : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20"
              )}
            >
              <Phone className="w-4 h-4" />
              {content.navbar.ctaButton}
            </Button>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "md:hidden h-10 w-10",
                    showOpaque ? "text-ocean-dark" : "text-white"
                  )}
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <img                       src="/logos/vive-travel-original.png"
                      alt="Vive Travel"
                      width={90}
                      height={36}
                      className="h-9 w-auto"
                     onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
                  </div>
                  <nav className="flex flex-col p-4 gap-1.5 overflow-y-auto">
                    <div className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {content.navbar.navItems.find(i => i.key === "plans")?.label || "Experiencias y viajes"}
                    </div>
                    {EXPERIENCE_SECTIONS.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => handleExperienceNav(section.id)}
                        className="px-4 py-3.5 rounded-xl text-left text-sm font-medium transition-colors duration-150 min-h-[44px] flex items-center text-muted-foreground hover:bg-muted hover:text-ocean"
                      >
                        {section.label}
                      </button>
                    ))}
                    {content.navbar.navItems.filter(i => i.key !== "plans").map((item) => (
                      <button
                        key={item.key}
                        onClick={() => handleNav(item.key as any)}
                        className={cn(
                          "px-4 py-3.5 rounded-xl text-left text-sm font-medium transition-colors duration-150 min-h-[44px] flex items-center",
                          isItemActive(item.key, currentView)
                            ? "bg-ocean/10 text-ocean font-semibold"
                            : "text-muted-foreground hover:bg-muted hover:text-ocean"
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                    <button
                      onClick={() => handleNav("favorites")}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-left text-sm font-medium transition-colors duration-150 min-h-[44px]",
                        currentView === "favorites"
                          ? "bg-ocean/10 text-ocean font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-ocean"
                      )}
                    >
                      <Heart className={cn(
                        "w-4 h-4",
                        currentView === "favorites" && "fill-current"
                      )} />
                      Mi Colección
                    </button>
                  </nav>
                  <div className="mt-auto p-4 border-t">
                    <Button
                      onClick={() => handleNav("contact")}
                      className="w-full bg-ocean hover:bg-ocean-dark text-white rounded-full"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {content.navbar.ctaButtonMobile}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

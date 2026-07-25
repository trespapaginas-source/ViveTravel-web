"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useNavigation, type ViewType, getUrlForView } from "@/lib/store";
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

function isItemActive(key: string, currentView: ViewType): boolean {
  if (key === "home") return currentView === "home";
  if (key === "plans") return currentView === "plans" || currentView === "plan-detail";
  if (key === "cabins") return currentView === "cabins" || currentView === "cabin-detail";
  if (key === "transports") return currentView === "transports";
  if (key === "team") return currentView === "team";
  if (key === "contact") return currentView === "contact";
  if (key === "policies") return currentView === "policies";
  return false;
}

export function Navbar() {
  const { currentView, navigate, favoritesPulseActive, setFavoritesPulseActive } = useNavigation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [experiencesOpen, setExperiencesOpen] = useState(false);

  const pathname = usePathname();
  const { content } = useSiteContent();

  const isHome = currentView === "home" || pathname === "/";
  const showOpaque = scrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = useCallback(
    (view: Parameters<typeof navigate>[0]) => {
      if (view === "plans") {
        navigate("plans", null, { viewMode: "3" });
      } else {
        navigate(view);
      }
      
      requestAnimationFrame(() => {
        setMobileOpen(false);
      });
    },
    [navigate]
  );

  const handleExperienceNav = useCallback(
    (section: ExperienceSectionId) => {
      navigate("plans", section, { viewMode: "3" });

      requestAnimationFrame(() => {
        setMobileOpen(false);
      });
    },
    [navigate]
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-200 border-b border-transparent",
        showOpaque
          ? "bg-white/80 backdrop-blur-lg border-zinc-100/80 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)]"
          : "bg-transparent"
      )}
    >
      {/* Campaign Banner inside the header */}
      {content.campaign?.active && isHome && (
        <div
          className={cn(
            "bg-ocean text-white text-center text-xs font-semibold transition-all duration-200 ease-in-out overflow-hidden relative z-50 flex items-center justify-center",
            scrolled ? "h-0 opacity-0" : "h-[36px] opacity-100"
          )}
        >
          <div className="py-2.5 px-4">
            {content.campaign.bannerText}{" "}
            <span className="underline ml-1 cursor-pointer hover:text-white/90">
              {content.campaign.ctaText}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300",
            scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={() => handleNav("home")}
            className="flex items-center group relative cursor-pointer"
          >
            <img
              src="/logos/vive-travel-original.png"
              alt="Vive Travel"
              width={120}
              height={48}
              className={cn(
                "h-10 sm:h-12 w-auto transition-opacity duration-300",
                showOpaque ? "opacity-100" : "opacity-0"
              )}
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }}
            />
            <img
              src="/logos/vive-travel-white.png"
              alt="Vive Travel"
              width={120}
              height={48}
              className={cn(
                "absolute inset-0 h-10 sm:h-12 w-auto transition-opacity duration-300",
                showOpaque ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {content.navbar.navItems.map((item) => {
              if (item.key === "plans") {
                return (
                  <div key="plans" className="relative flex items-center">
                    <Link
                      href="/planes"
                      onClick={() => handleNav("plans")}
                      className={cn(
                        "px-3.5 py-2 rounded-l-full text-sm font-medium transition-all duration-200 flex items-center gap-1",
                        isItemActive("plans", currentView)
                          ? showOpaque
                            ? "bg-zinc-900 text-white shadow-xs"
                            : "bg-white/20 backdrop-blur-sm text-white"
                          : showOpaque
                          ? "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                          : "text-white/90 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {item.label}
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            "py-2 pr-2.5 pl-0.5 rounded-r-full text-sm font-medium transition-all duration-200 cursor-pointer border-none bg-transparent flex items-center",
                            isItemActive("plans", currentView)
                              ? showOpaque
                                ? "bg-zinc-900 text-white shadow-xs"
                                : "bg-white/20 backdrop-blur-sm text-white"
                              : showOpaque
                              ? "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                              : "text-white/90 hover:bg-white/10 hover:text-white"
                          )}
                          aria-label="Opciones de experiencias"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="min-w-52">
                        {EXPERIENCE_SECTIONS.map((section) => (
                          <DropdownMenuItem
                            key={section.id}
                            asChild
                          >
                            <Link
                              href={`/planes?categoria=${encodeURIComponent(section.id)}`}
                              onClick={() => handleExperienceNav(section.id)}
                              className="w-full cursor-pointer"
                            >
                              {section.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              }
              return (
                <Link
                  key={item.key}
                  href={getUrlForView(item.key as any)}
                  onClick={() => handleNav(item.key as any)}
                  className={cn(
                    "px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isItemActive(item.key, currentView)
                      ? showOpaque
                        ? "bg-zinc-900 text-white shadow-xs"
                        : "bg-white/20 backdrop-blur-sm text-white"
                      : showOpaque
                      ? "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + Favorites + Mobile */}
          <div className="flex items-center gap-2">
            {/* Favorites */}
            <Link
              href="/favoritos"
              onClick={() => {
                setFavoritesPulseActive(false);
                handleNav("favorites");
              }}
              className={cn(
                "rounded-full h-10 w-10 sm:h-9 sm:w-9 flex items-center justify-center transition-colors duration-200",
                favoritesPulseActive && "animate-heartbeat text-ocean bg-ocean/10 hover:bg-ocean/10",
                currentView === "favorites"
                  ? showOpaque
                    ? "bg-ocean/10 text-ocean font-semibold"
                    : "bg-white/20 text-white"
                  : showOpaque
                  ? favoritesPulseActive ? "" : "text-zinc-600 hover:text-ocean hover:bg-ocean/5"
                  : favoritesPulseActive ? "" : "text-white/90 hover:text-white hover:bg-white/10"
              )}
              aria-label="Mis favoritos"
            >
              <Heart className={cn(
                "w-4 h-4",
                favoritesPulseActive ? "fill-ocean text-ocean" : (currentView === "favorites" && "fill-current")
              )} />
            </Link>

            {/* Reservar CTA */}
            <Button
              asChild
              className={cn(
                "hidden sm:flex items-center gap-2 rounded-full transition-colors duration-200 font-medium px-5",
                showOpaque
                  ? "bg-zinc-900 hover:bg-black text-white shadow-xs"
                  : "bg-white hover:bg-zinc-100 text-zinc-900 shadow-xs"
              )}
            >
              <Link href="/contacto" onClick={() => handleNav("contact")}>
                <Phone className="w-4 h-4" />
                {content.navbar.ctaButton}
              </Link>
            </Button>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "md:hidden h-10 w-10 hover:bg-transparent",
                    showOpaque ? "text-zinc-800" : "text-white"
                  )}
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <img
                      src="/logos/vive-travel-original.png"
                      alt="Vive Travel"
                      width={90}
                      height={36}
                      className="h-9 w-auto"
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }}
                    />
                  </div>
                  <nav className="flex flex-col p-4 gap-1 overflow-y-auto">
                    {content.navbar.navItems.map((item) => {
                      if (item.key === "plans") {
                        return (
                          <div key="plans" className="flex flex-col">
                            <div className="flex items-center justify-between w-full">
                              <Link
                                href="/planes"
                                onClick={() => handleNav("plans")}
                                className={cn(
                                  "flex-1 px-4 py-3 rounded-l-xl text-left text-sm font-medium transition-colors duration-150 min-h-[44px] flex items-center",
                                  isItemActive("plans", currentView)
                                    ? "bg-ocean/10 text-ocean font-semibold"
                                    : "text-zinc-600 hover:bg-zinc-50 hover:text-ocean"
                                )}
                              >
                                {item.label}
                              </Link>
                              <button
                                onClick={() => setExperiencesOpen((o) => !o)}
                                className={cn(
                                  "px-3 py-3 rounded-r-xl text-sm font-medium transition-colors duration-150 min-h-[44px] flex items-center justify-center",
                                  isItemActive("plans", currentView)
                                    ? "bg-ocean/10 text-ocean"
                                    : "text-zinc-600 hover:bg-zinc-50 hover:text-ocean"
                                )}
                                aria-expanded={experiencesOpen}
                                aria-label="Desplegar experiencias"
                              >
                                <ChevronDown
                                  className={cn(
                                    "w-4 h-4 shrink-0 transition-transform duration-200",
                                    experiencesOpen && "rotate-180"
                                  )}
                                />
                              </button>
                            </div>
                            <div
                              className={cn(
                                "grid transition-all duration-200 ease-out",
                                experiencesOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                              )}
                            >
                              <div className="overflow-hidden flex flex-col gap-0.5 pl-3">
                                {EXPERIENCE_SECTIONS.map((section) => (
                                  <Link
                                    key={section.id}
                                    href={`/planes?categoria=${encodeURIComponent(section.id)}`}
                                    onClick={() => handleExperienceNav(section.id)}
                                    className="px-4 py-2.5 rounded-lg text-left text-sm transition-colors duration-150 min-h-[40px] flex items-center text-zinc-500 hover:bg-zinc-50 hover:text-ocean"
                                  >
                                    {section.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <Link
                          key={item.key}
                          href={getUrlForView(item.key as any)}
                          onClick={() => handleNav(item.key as any)}
                          className={cn(
                            "px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors duration-150 min-h-[44px] flex items-center",
                            isItemActive(item.key, currentView)
                              ? "bg-ocean/10 text-ocean font-semibold"
                              : "text-zinc-600 hover:bg-zinc-50 hover:text-ocean"
                          )}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                    <div className="h-px bg-zinc-100 my-2" />
                    <Link
                      href="/favoritos"
                      onClick={() => {
                        setFavoritesPulseActive(false);
                        handleNav("favorites");
                      }}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors duration-150 min-h-[44px]",
                        favoritesPulseActive && "animate-heartbeat text-ocean bg-ocean/10",
                        currentView === "favorites"
                          ? "bg-ocean/10 text-ocean font-semibold"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-ocean"
                      )}
                    >
                      <Heart className={cn(
                        "w-4 h-4",
                        favoritesPulseActive ? "fill-ocean text-ocean" : (currentView === "favorites" && "fill-current")
                      )} />
                      Mi Colección
                    </Link>
                  </nav>
                  <div className="mt-auto p-4 border-t">
                    <Button
                      asChild
                      className="w-full bg-zinc-900 hover:bg-black text-white rounded-xl h-11 font-semibold"
                    >
                      <Link href="/contacto" onClick={() => handleNav("contact")}>
                        <Phone className="w-4 h-4 mr-2" />
                        {content.navbar.ctaButtonMobile}
                      </Link>
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

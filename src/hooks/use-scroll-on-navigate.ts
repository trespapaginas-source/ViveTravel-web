"use client";

import { useEffect } from "react";
import { useNavigation, type ViewType } from "@/lib/store";

export function getViewFromPathname(pathname: string): { view: ViewType; itemId: string | null } {
  if (!pathname || pathname === "/") {
    return { view: "home", itemId: null };
  }
  if (pathname.startsWith("/planes")) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { view: "plan-detail", itemId: parts[1] };
    }
    return { view: "plans", itemId: null };
  }
  if (pathname.startsWith("/cabanas")) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { view: "cabin-detail", itemId: parts[1] };
    }
    return { view: "cabins", itemId: null };
  }
  if (pathname.startsWith("/transporte")) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { view: "transports", itemId: parts[1] };
    }
    return { view: "transports", itemId: null };
  }
  if (pathname.startsWith("/visas")) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { view: "visas", itemId: parts[1] };
    }
    return { view: "visas", itemId: null };
  }
  if (pathname.startsWith("/contacto")) {
    return { view: "contact", itemId: null };
  }
  if (pathname.startsWith("/equipo")) {
    return { view: "team", itemId: null };
  }
  if (pathname.startsWith("/politicas")) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { view: "policies", itemId: parts[1] };
    }
    return { view: "policies", itemId: null };
  }
  if (pathname.startsWith("/favoritos")) {
    return { view: "favorites", itemId: null };
  }
  return { view: "home", itemId: null };
}

/**
 * Scrolls to top whenever the active view or selected item changes,
 * and synchronizes state on browser history popstate (Back/Forward).
 */
export function useScrollOnNavigate() {
  const currentView = useNavigation((s) => s.currentView);
  const selectedItemId = useNavigation((s) => s.selectedItemId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView, selectedItemId]);

  useEffect(() => {
    const handlePopState = () => {
      const { view, itemId } = getViewFromPathname(window.location.pathname);
      useNavigation.setState({
        currentView: view,
        selectedItemId: itemId,
      });
    };

    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      const { view, itemId } = getViewFromPathname(window.location.pathname);
      useNavigation.setState({
        currentView: view,
        selectedItemId: itemId,
      });
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
}

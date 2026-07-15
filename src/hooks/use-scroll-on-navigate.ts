"use client";

import { useEffect } from "react";
import { useNavigation } from "@/lib/store";

/**
 * Scrolls to top whenever the active view or selected item changes.
 *
 * Previously this side effect lived inside the Zustand store (`window.scrollTo`
 * inside `set`), which coupled global state to a browser global and broke under
 * SSR. Moved here so the store stays pure and the scroll only runs on the client.
 */
export function useScrollOnNavigate() {
  const currentView = useNavigation((s) => s.currentView);
  const selectedItemId = useNavigation((s) => s.selectedItemId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView, selectedItemId]);
}

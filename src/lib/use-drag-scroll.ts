"use client";

import { useCallback, useRef } from "react";

/**
 * Enables click-and-drag horizontal scrolling (mouse) on a container that
 * already scrolls via `overflow-x-auto`. Native overflow scroll only
 * responds to touch swipe or trackpad/wheel gestures — plain mouse users
 * have no way to reach content past the visible edge without this.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const moved = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    isDown.current = true;
    moved.current = false;
    startX.current = e.pageX;
    startScrollLeft.current = el.scrollLeft;
  }, []);

  const stop = useCallback(() => {
    isDown.current = false;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!isDown.current || !el) return;
    e.preventDefault();
    const delta = e.pageX - startX.current;
    if (Math.abs(delta) > 4) moved.current = true;
    el.scrollLeft = startScrollLeft.current - delta;
  }, []);

  // Suppress the click that fires right after a drag so it doesn't
  // accidentally trigger the button underneath the cursor.
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (moved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return {
    ref,
    onMouseDown,
    onMouseMove,
    onMouseUp: stop,
    onMouseLeave: stop,
    onClickCapture,
  };
}

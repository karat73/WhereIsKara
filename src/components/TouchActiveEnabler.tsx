"use client";

import { useEffect } from "react";

// iOS Safari only applies :active styles on elements if a touch listener is
// present somewhere on the page - otherwise taps skip straight from
// pointerdown to pointerup with no visible pressed state at all.
export function TouchActiveEnabler() {
  useEffect(() => {
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => document.removeEventListener("touchstart", noop);
  }, []);

  return null;
}

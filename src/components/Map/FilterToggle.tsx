"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MapFilterMode } from "./MapView";

type Props = {
  mode: MapFilterMode;
  onChange: (mode: MapFilterMode) => void;
};

// Sliding-fill toggle: the mustard fill is one element that measures and
// animates to whichever button is selected, rather than each button owning
// its own background - that's what lets it slide/resize instead of
// stretching across both options first.
export function FilterToggle({ mode, onChange }: Props) {
  const sabbaticalRef = useRef<HTMLButtonElement>(null);
  const allTimeRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [pressing, setPressing] = useState(false);

  const snapTo = useCallback((btn: HTMLButtonElement | null) => {
    if (!btn || !fillRef.current) return;
    fillRef.current.style.width = `${btn.offsetWidth}px`;
    fillRef.current.style.transform = `translateX(${btn.offsetLeft}px)`;
  }, []);

  useEffect(() => {
    snapTo(mode === "sabbatical" ? sabbaticalRef.current : allTimeRef.current);
  }, [mode, snapTo]);

  useEffect(() => {
    const handleResize = () => snapTo(mode === "sabbatical" ? sabbaticalRef.current : allTimeRef.current);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mode, snapTo]);

  return (
    <div
      className="relative inline-flex overflow-hidden rounded-[2px] border border-line bg-surface select-none"
      onPointerDown={() => setPressing(true)}
      onPointerUp={() => setPressing(false)}
      onPointerLeave={() => setPressing(false)}
      onPointerCancel={() => setPressing(false)}
    >
      <div
        ref={fillRef}
        className={`absolute top-0 bottom-0 left-0 rounded-[1px] transition-[transform,width] duration-[420ms] ease-[cubic-bezier(.4,0,.2,1)] ${
          pressing ? "bg-accent-hover" : "bg-accent"
        }`}
      />
      <button
        ref={sabbaticalRef}
        type="button"
        aria-pressed={mode === "sabbatical"}
        onClick={() => onChange("sabbatical")}
        className={`relative z-10 px-3 py-1.5 text-[13px] transition-colors duration-200 active:translate-y-px ${
          mode === "sabbatical" ? "text-white" : "text-text-secondary hover:text-text-primary"
        }`}
      >
        Sabbatical
      </button>
      <button
        ref={allTimeRef}
        type="button"
        aria-pressed={mode === "all-time"}
        onClick={() => onChange("all-time")}
        className={`relative z-10 px-3 py-1.5 text-[13px] transition-colors duration-200 active:translate-y-px ${
          mode === "all-time" ? "text-white" : "text-text-secondary hover:text-text-primary"
        }`}
      >
        All time
      </button>
    </div>
  );
}

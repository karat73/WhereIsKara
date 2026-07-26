"use client";

import { useEffect, useState } from "react";

export function useLocalClock(timezone: string) {
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
    });

    const tick = () => setLabel(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timezone]);

  return label;
}

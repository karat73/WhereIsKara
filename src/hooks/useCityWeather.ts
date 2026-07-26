"use client";

import { useEffect, useState } from "react";

export function useCityWeather(lat: number, lng: number) {
  const [tempC, setTempC] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setTempC(null);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.current?.temperature_2m != null) {
          setTempC(Math.round(data.current.temperature_2m));
        }
      })
      .catch(() => {
        /* silently fall back to no temperature */
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  return tempC;
}

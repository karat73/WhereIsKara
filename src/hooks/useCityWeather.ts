"use client";

import { useEffect, useState } from "react";

export function useCityWeather(lat: number, lng: number) {
  const [tempC, setTempC] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) {
          setTempC(data?.current?.temperature_2m != null ? Math.round(data.current.temperature_2m) : null);
        }
      })
      .catch(() => {
        if (!cancelled) setTempC(null);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  return tempC;
}

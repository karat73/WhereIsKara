"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { MapView, type MapFilterMode } from "./MapView";
import { CityPopup } from "./CityPopup";
import { FilterToggle } from "./FilterToggle";
import type { CityWithVisits, DailyUpdate, Trip } from "@/lib/types";

const SIXTY_HOURS_MS = 60 * 60 * 60 * 1000;

type Props = {
  cities: CityWithVisits[];
  latestUpdateByVisit: Record<string, DailyUpdate>;
  trip: Trip | null;
};

export function MapExperience({ cities, latestUpdateByVisit, trip }: Props) {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [mode, setMode] = useState<MapFilterMode>("sabbatical");

  const handleSelectCity = useCallback((city: CityWithVisits) => {
    setSelectedCityId(city.id);
  }, []);

  const selectedCity = cities.find((c) => c.id === selectedCityId) ?? null;

  const checkedInValue = trip?.last_checked_in
    ? formatDistanceToNowStrict(new Date(trip.last_checked_in), { addSuffix: true })
    : null;

  // Date.now() is impure, so it can't be called directly during render - a
  // lazily-initialized "now" tracked in state (refreshed periodically via a
  // callback, not synchronously in the effect body) stands in for it.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const checkedInStale = trip?.last_checked_in
    ? now - new Date(trip.last_checked_in).getTime() > SIXTY_HOURS_MS
    : false;

  return (
    <div className="absolute inset-0">
      <MapView
        cities={cities}
        trip={trip}
        mode={mode}
        onSelectCity={handleSelectCity}
        selectedCityId={selectedCityId}
      />

      <div className="absolute left-4 top-[calc(3.5rem+0.75rem)] z-10">
        <FilterToggle mode={mode} onChange={setMode} />
      </div>

      {checkedInValue && (
        <div className="absolute right-4 top-[calc(3.5rem+0.75rem)] z-10 rounded-[2px] border border-line bg-surface px-3 py-1.5 text-right leading-tight">
          <p className="text-[11px] uppercase text-text-secondary">Check-in</p>
          <p
            className={`font-mono-num text-[13px] whitespace-nowrap ${
              checkedInStale ? "text-text-secondary" : "text-text-primary"
            }`}
          >
            {checkedInValue}
          </p>
        </div>
      )}

      {selectedCity && (
        <CityPopup
          city={selectedCity}
          latestUpdateByVisit={latestUpdateByVisit}
          onClose={() => setSelectedCityId(null)}
        />
      )}
    </div>
  );
}

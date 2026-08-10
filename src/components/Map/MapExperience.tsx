"use client";

import { useCallback, useState } from "react";
import { MapView, type MapFilterMode } from "./MapView";
import { CityPopup } from "./CityPopup";
import type { CityWithVisits, DailyUpdate, Trip } from "@/lib/types";

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

  return (
    <div className="absolute inset-0">
      <MapView
        cities={cities}
        trip={trip}
        mode={mode}
        onSelectCity={handleSelectCity}
        selectedCityId={selectedCityId}
      />

      <div className="absolute left-4 bottom-16 z-10 flex rounded-[2px] border border-line overflow-hidden bg-surface">
        <button
          onClick={() => setMode("sabbatical")}
          className={`px-3 py-1.5 text-[13px] transition-colors ${
            mode === "sabbatical"
              ? "bg-accent text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Sabbatical
        </button>
        <button
          onClick={() => setMode("all-time")}
          className={`px-3 py-1.5 text-[13px] transition-colors border-l border-line ${
            mode === "all-time"
              ? "bg-accent text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          All time
        </button>
      </div>

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

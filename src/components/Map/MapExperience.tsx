"use client";

import { useCallback, useState } from "react";
import { MapView } from "./MapView";
import { CityPopup } from "./CityPopup";
import type { City, DailyUpdate } from "@/lib/types";

type Props = {
  cities: City[];
  latestUpdateByCity: Record<string, DailyUpdate>;
};

export function MapExperience({ cities, latestUpdateByCity }: Props) {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  const handleSelectCity = useCallback((city: City) => {
    setSelectedCityId(city.id);
  }, []);

  const selectedCity = cities.find((c) => c.id === selectedCityId) ?? null;

  return (
    <div className="absolute inset-0">
      <MapView cities={cities} onSelectCity={handleSelectCity} selectedCityId={selectedCityId} />
      {selectedCity && (
        <CityPopup
          city={selectedCity}
          latestUpdate={latestUpdateByCity[selectedCity.id] ?? null}
          onClose={() => setSelectedCityId(null)}
        />
      )}
    </div>
  );
}

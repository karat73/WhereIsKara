import { getCities, getLatestUpdateByCity } from "@/lib/data";
import { MapExperience } from "@/components/Map/MapExperience";

// This page shows live status (current city, latest check-ins) that changes
// independently of deploys, so it must never be served from a stale build cache.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [cities, latestUpdateByCity] = await Promise.all([
    getCities(),
    getLatestUpdateByCity(),
  ]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <MapExperience cities={cities} latestUpdateByCity={latestUpdateByCity} />
    </div>
  );
}

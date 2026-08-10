import { getCitiesWithVisits, getLatestUpdateByVisit, getTrip } from "@/lib/data";
import { MapExperience } from "@/components/Map/MapExperience";

// This page shows live status (current city, latest check-ins) that changes
// independently of deploys, so it must never be served from a stale build cache.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [cities, latestUpdateByVisit, trip] = await Promise.all([
    getCitiesWithVisits(),
    getLatestUpdateByVisit(),
    getTrip(),
  ]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <MapExperience cities={cities} latestUpdateByVisit={latestUpdateByVisit} trip={trip} />
    </div>
  );
}

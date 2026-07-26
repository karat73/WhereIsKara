import { getCities, getLatestUpdateByCity } from "@/lib/data";
import { MapExperience } from "@/components/Map/MapExperience";

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

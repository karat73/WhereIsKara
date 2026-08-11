import { getAllDailyUpdates, getCitiesWithVisits, getTrip } from "@/lib/data";
import { getVisitStatus, pickRepresentativeVisit, tripDay } from "@/lib/status";
import { haversineMiles } from "@/lib/geo";
import { countryToContinent } from "@/lib/continents";
import { TripStats } from "@/components/About/TripStats";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [cities, updates, trip] = await Promise.all([
    getCitiesWithVisits(),
    getAllDailyUpdates(),
    getTrip(),
  ]);

  const now = new Date();
  const traveledCities = cities
    .filter((c) => c.pin_type === "trip")
    .map((c) => ({ city: c, visit: pickRepresentativeVisit(c.visits, c.timezone, now) }))
    .filter((x) => x.visit && getVisitStatus(x.visit, x.city.timezone, now) !== "upcoming")
    .sort((a, b) => a.visit!.start_date.localeCompare(b.visit!.start_date))
    .map((x) => x.city);

  const citiesCount = traveledCities.length;
  const countriesCount = new Set(traveledCities.map((c) => c.country)).size;
  let miles = 0;
  for (let i = 1; i < traveledCities.length; i++) {
    miles += haversineMiles(
      traveledCities[i - 1].lat,
      traveledCities[i - 1].lng,
      traveledCities[i].lat,
      traveledCities[i].lng
    );
  }
  const dayLabel = trip ? tripDay(trip.start_date, trip.end_date, now) : null;

  // All-time: every city with at least one visit, sabbatical or historic.
  const everVisitedCities = cities.filter((c) => c.pin_type === "trip" && c.visits.length > 0);
  const allTimeCitiesCount = everVisitedCities.length;
  const allTimeCountries = new Set(everVisitedCities.map((c) => c.country));
  const allTimeCountriesCount = allTimeCountries.size;
  const allTimeContinentsCount = new Set(
    Array.from(allTimeCountries).map(countryToContinent)
  ).size;

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 sm:px-6">
      <article className="max-w-xl mx-auto prose-none">
        <h1 className="font-display text-[39px] mb-6">About</h1>

        {dayLabel && (
          <TripStats
            citiesCount={citiesCount}
            countriesCount={countriesCount}
            miles={miles}
            updatesCount={updates.length}
            day={dayLabel.day}
            totalDays={dayLabel.totalDays}
            allTimeCitiesCount={allTimeCitiesCount}
            allTimeCountriesCount={allTimeCountriesCount}
            allTimeContinentsCount={allTimeContinentsCount}
          />
        )}

        <h2 className="font-display text-[25px] mt-10 mb-3">Why</h2>
        <p className="text-text-secondary leading-relaxed">
          I&rsquo;m away for six+ months, this is the easiest way to keep people in the loop.
          The Check-in badge in the header shows the last time I marked myself safe. Will try
          to update this every few days but who knows. If I haven&rsquo;t marked myself as safe
          in a while feel free to panic.
        </p>

        <h2 className="font-display text-[25px] mt-10 mb-3">Decisions for V1</h2>
        <ul className="space-y-3 text-text-secondary leading-relaxed list-disc pl-5">
          <li>Mapbox &gt; OpenStreetMap due to the ease of styling.</li>
          <li>
            The early plan included blog entries and photo uploads but once sketched out felt
            v 2009. Check-ins do the work instead, kind of like IG stories without using a
            Meta product. Aiming for this site to be a live pin board, not a blog.
          </li>
          <li>
            The timeline is there to collate daily updates and will be expanded on in later
            updates.
          </li>
        </ul>

        <h2 className="font-display text-[25px] mt-10 mb-3">Changelog</h2>
        <ul className="space-y-4 text-text-secondary leading-relaxed">
          <li>
            <p className="text-text-primary font-medium">v1.1 &ndash; 10 August 2026</p>
            <p>
              Visits data model (repeat stays), historic trips mapped in, a Sabbatical/All-time
              map filter, &ldquo;I&rsquo;m safe&rdquo; check-in, redesigned popup and timeline,
              trip stats, new design system.
            </p>
            <p className="text-text-muted text-[13px] mt-1">
              Note: All time stats and places visited is not complete, will populate when I have
              time.
            </p>
          </li>
          <li>
            <p className="text-text-primary font-medium">v1.0 &ndash; 26 July 2026</p>
            <p>Map, current location, check-ins, popup content, route lines.</p>
          </li>
        </ul>

        <h2 className="font-display text-[25px] mt-10 mb-3">Still to come</h2>
        <ul className="space-y-2 text-text-secondary leading-relaxed list-disc pl-5">
          <li>Pixel-Arina and Pixel-Kate.</li>
          <li>A little wave animation before the map settles.</li>
        </ul>

        <h2 className="font-display text-[25px] mt-10 mb-3">Built with</h2>
        <p className="text-text-secondary leading-relaxed">
          Next.js, Supabase, Mapbox, Vercel. Designed in Figma, built with Claude Code.
        </p>

        <p className="mt-10 text-sm text-text-muted">
          Bugs, ideas, anything -{" "}
          <a
            href="mailto:feedback@whereiskara.com"
            className="text-accent hover:text-accent-hover underline"
          >
            feedback@whereiskara.com
          </a>
        </p>
      </article>
    </div>
  );
}

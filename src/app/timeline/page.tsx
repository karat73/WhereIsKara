import { getAllDailyUpdates, getCities } from "@/lib/data";
import { formatFullDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const [updates, cities] = await Promise.all([getAllDailyUpdates(), getCities()]);
  const cityById = Object.fromEntries(cities.map((c) => [c.id, c]));

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-4xl mb-2">Timeline</h1>
        <p className="text-text-secondary mb-10">Every update, most recent first.</p>

        {updates.length === 0 && (
          <p className="text-text-muted">No updates posted yet — check back soon.</p>
        )}

        <ol className="space-y-8">
          {updates.map((update) => {
            const city = cityById[update.city_id];
            return (
              <li key={update.id} className="border-l-2 border-border pl-5 relative">
                <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-accent" />
                <p className="text-xs text-text-muted mb-1">
                  {formatFullDate(update.date)}
                  {city ? ` · ${city.name}` : ""}
                </p>
                <p className="font-display italic text-lg text-text-primary leading-snug">
                  &ldquo;{update.caption}&rdquo;
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

import {
  getAllDailyUpdates,
  getCitiesWithVisits,
  getTrip,
} from "@/lib/data";
import {
  formatDayMonth,
  formatYear,
  ordinalStayLabel,
  tripDayNumber,
} from "@/lib/format";
import type { Visit } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const [updates, cities, trip] = await Promise.all([
    getAllDailyUpdates(),
    getCitiesWithVisits(),
    getTrip(),
  ]);

  const visitById: Record<string, Visit> = {};
  const cityByVisitId: Record<string, (typeof cities)[number]> = {};
  const visitOrdinalById: Record<string, number> = {};

  for (const city of cities) {
    const sortedVisits = [...city.visits].sort((a, b) => a.start_date.localeCompare(b.start_date));
    sortedVisits.forEach((visit, index) => {
      visitById[visit.id] = visit;
      cityByVisitId[visit.id] = city;
      visitOrdinalById[visit.id] = index + 1;
    });
  }

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-[39px] mb-8">Timeline</h1>

        {updates.length === 0 && (
          <p className="text-text-muted">No updates posted yet, check back soon.</p>
        )}

        <ol className="divide-y divide-border">
          {updates.map((update) => {
            const visit = visitById[update.visit_id];
            const city = cityByVisitId[update.visit_id];
            if (!visit || !city) return null;

            const ordinal = visitOrdinalById[visit.id];
            const showStayTag = city.visits.length > 1 && ordinal > 1;
            // created_at is when the update was first posted and never
            // changes on edit - date is a legacy field, no longer used for
            // display, so an old entry can't move or re-date itself.
            const dayNumber = trip ? tripDayNumber(trip.start_date, update.created_at) : null;
            // Day trips list in date order alongside stays rather than
            // nesting under their parent - simpler, spec allows it as the
            // fallback - but get a small tag so they still read distinctly.

            return (
              <li key={update.id} className="py-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="tabular-nums">
                      <span className="text-[20px] font-semibold text-text-primary">
                        {formatDayMonth(update.created_at)}
                      </span>{" "}
                      <span className="text-[16px] text-text-secondary">
                        {formatYear(update.created_at)}
                      </span>
                    </p>
                    {dayNumber != null && (
                      <span className="font-mono-num shrink-0 text-[13px] uppercase border rounded-[2px] px-2 py-0.5 text-blue border-blue">
                        DAY {String(dayNumber).padStart(3, "0")}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 font-display italic text-[16px] text-text-primary flex items-center gap-2 flex-wrap">
                    {city.name}
                    {showStayTag && (
                      <span className="not-italic font-sans text-[11px] uppercase text-blue">
                        {ordinalStayLabel(ordinal)}
                      </span>
                    )}
                    {visit.is_day_trip && (
                      <span className="not-italic font-sans text-[11px] uppercase text-text-muted">
                        Day trip
                      </span>
                    )}
                  </p>

                  <p className="mt-2 font-display italic text-[20px] text-text-primary leading-snug">
                    &ldquo;{update.caption}&rdquo;
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

import type { City, PinStatus, Trip, Visit, VisitStatus } from "./types";

// visit.start_date/end_date are plain local calendar dates for the city
// they belong to (e.g. "2026-08-10"), not UTC instants. Comparing them
// against a raw UTC "now" causes status to flip a day early or late
// depending on the city's offset from UTC - so "now" has to be converted
// to that city's local calendar date first.
function localDateString(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date); // en-CA gives YYYY-MM-DD
}

// end_date is exclusive: a visit is current through the night before
// end_date, and "visited" starting on end_date itself (the day Kara
// leaves). This is what keeps back-to-back stays from both reading as
// current on the changeover day.
export function getVisitStatus(
  visit: Visit,
  timezone: string,
  now: Date = new Date()
): VisitStatus {
  const nowLocal = localDateString(now, timezone);
  if (nowLocal < visit.start_date) return "upcoming";
  if (visit.end_date && nowLocal >= visit.end_date) return "visited";
  return "current";
}

// A single item in a chronological run of stays (e.g. one representative
// visit per city on the current trip), classified against "now".
export type StaySequenceItem<T> = { data: T; visit: Visit; status: VisitStatus };

// Positions "current" and "upcoming" within a sorted sequence of stays,
// rather than deriving them independently per item. "Upcoming" is
// whichever stay comes right after the current one - not just any visit
// whose start_date is in the future - so the arrow/route never skips a
// city because an earlier boundary bug misclassified it. Day trips should
// be excluded from `items` by the caller before calling this.
export function getStaySequence<T>(
  items: { data: T; visit: Visit; timezone: string }[],
  now: Date = new Date()
): {
  current: StaySequenceItem<T> | null;
  upcoming: StaySequenceItem<T> | null;
  visited: StaySequenceItem<T>[];
  future: StaySequenceItem<T>[];
  sequence: StaySequenceItem<T>[];
} {
  const sequence: StaySequenceItem<T>[] = [...items]
    .sort((a, b) => a.visit.start_date.localeCompare(b.visit.start_date))
    .map((x) => ({
      data: x.data,
      visit: x.visit,
      status: getVisitStatus(x.visit, x.timezone, now),
    }));

  const currentIndex = sequence.findIndex((x) => x.status === "current");
  const current = currentIndex >= 0 ? sequence[currentIndex] : null;

  const visited = current
    ? sequence.slice(0, currentIndex)
    : sequence.filter((x) => x.status === "visited");
  const future = current
    ? sequence.slice(currentIndex + 1)
    : sequence.filter((x) => x.status === "upcoming");
  const upcoming = future[0] ?? null;

  return { current, upcoming, visited, future, sequence };
}

// A city can have multiple visits. The one badge/pin needs a single
// representative visit: current first, else the most recent past visit
// that was with a partner (if any - a later solo revisit shouldn't bury
// that memory), else just the most recent past visit, else the nearest
// upcoming one.
export function pickRepresentativeVisit(
  visits: Visit[],
  timezone: string,
  now: Date = new Date()
): Visit | null {
  if (visits.length === 0) return null;

  const withStatus = visits.map((v) => ({ v, status: getVisitStatus(v, timezone, now) }));

  const current = withStatus.find((x) => x.status === "current");
  if (current) return current.v;

  const byMostRecent = (a: { v: Visit }, b: { v: Visit }) =>
    (b.v.end_date ?? b.v.start_date).localeCompare(a.v.end_date ?? a.v.start_date);

  const past = withStatus.filter((x) => x.status === "visited").sort(byMostRecent);
  const partneredPast = past.filter((x) => x.v.visited_with_partner);
  if (partneredPast.length > 0) return partneredPast[0].v;
  if (past.length > 0) return past[0].v;

  const upcoming = withStatus
    .filter((x) => x.status === "upcoming")
    .sort((a, b) => a.v.start_date.localeCompare(b.v.start_date));
  if (upcoming.length > 0) return upcoming[0].v;

  return visits[0];
}

export const statusColor: Record<PinStatus, string> = {
  current: "var(--color-mustard)",
  upcoming: "var(--color-blue)",
  visited: "var(--color-stone)",
  personal: "var(--color-oxblood)",
};

// Pin colour: personal cities are always oxblood regardless of their
// visit's dates; everything else is coloured by its representative visit.
export function getPinStatus(
  city: City,
  representativeVisit: Visit | null,
  now: Date = new Date()
): PinStatus {
  if (city.pin_type === "personal") return "personal";
  if (!representativeVisit) return "upcoming";
  return getVisitStatus(representativeVisit, city.timezone, now);
}

// A visit "belongs to" the sabbatical if it starts within the trip's date
// range. Historic (pre-sabbatical) visits fail this, which is what keeps
// the route line and the map's auto-flyTo scoped to just this trip even
// when a city (e.g. one visited long ago) is shown in "all time" mode.
export function isWithinTrip(visit: Visit, trip: Trip | null): boolean {
  if (!trip) return true;
  return visit.start_date >= trip.start_date && visit.start_date <= trip.end_date;
}

export function tripDay(startDate: string, endDate: string, now: Date = new Date()) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.round((end.getTime() - start.getTime()) / msPerDay) + 1;
  const dayNumber = Math.floor((now.getTime() - start.getTime()) / msPerDay) + 1;
  const clamped = Math.min(Math.max(dayNumber, 1), totalDays);
  return { day: clamped, totalDays };
}

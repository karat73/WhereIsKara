import type { City, PinStatus, Trip, Visit, VisitStatus } from "./types";

export function getVisitStatus(visit: Visit, now: Date = new Date()): VisitStatus {
  const start = new Date(visit.start_date);
  if (now < start) return "upcoming";

  if (visit.end_date) {
    const end = new Date(visit.end_date);
    end.setUTCHours(23, 59, 59, 999); // end_date is a plain date, so "visited" only once that day has fully passed
    if (now > end) return "visited";
  }

  return "current";
}

// A city can have multiple visits. The one badge/pin needs a single
// representative visit: current first, else the most recent past visit,
// else the nearest upcoming one.
export function pickRepresentativeVisit(visits: Visit[], now: Date = new Date()): Visit | null {
  if (visits.length === 0) return null;

  const withStatus = visits.map((v) => ({ v, status: getVisitStatus(v, now) }));

  const current = withStatus.find((x) => x.status === "current");
  if (current) return current.v;

  const past = withStatus
    .filter((x) => x.status === "visited")
    .sort((a, b) => (b.v.end_date ?? b.v.start_date).localeCompare(a.v.end_date ?? a.v.start_date));
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
export function getPinStatus(city: City, representativeVisit: Visit | null): PinStatus {
  if (city.pin_type === "personal") return "personal";
  if (!representativeVisit) return "upcoming";
  return getVisitStatus(representativeVisit);
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

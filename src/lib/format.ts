const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// end_date is exclusive (the day Kara leaves), so the last day actually
// shown is one day before it. A visit whose window is a single day (e.g.
// a day trip: start 29 Sep, end 30 Sep) collapses to just that one date.
function lastInclusiveDay(startISO: string, endISOExclusive: string | null): Date {
  const start = new Date(startISO);
  if (!endISOExclusive) return start;
  const last = new Date(new Date(endISOExclusive).getTime() - 24 * 60 * 60 * 1000);
  return last.getTime() > start.getTime() ? last : start;
}

// Badge date, e.g. "25 JUL – 30 JUL 2026" (same year) or
// "25 JUL 2026 – 31 JAN 2027" (crossing years), or just "29 SEP 2026" for
// a single-day visit. Plex Mono, uppercase.
export function formatBadgeDate(startISO: string, endISOExclusive: string | null) {
  const a = new Date(startISO);
  const d = lastInclusiveDay(startISO, endISOExclusive);

  if (d.getTime() === a.getTime()) {
    return `${a.getUTCDate()} ${MONTHS[a.getUTCMonth()].toUpperCase()} ${a.getUTCFullYear()}`;
  }

  const sameYear = a.getUTCFullYear() === d.getUTCFullYear();
  const startPart = sameYear
    ? `${a.getUTCDate()} ${MONTHS[a.getUTCMonth()].toUpperCase()}`
    : `${a.getUTCDate()} ${MONTHS[a.getUTCMonth()].toUpperCase()} ${a.getUTCFullYear()}`;
  const endPart = `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].toUpperCase()} ${d.getUTCFullYear()}`;

  return `${startPart} – ${endPart}`;
}

// Compact range for the "Also here" / "Back here" line, e.g.
// "12–17 Jan 2027" (same month) or "28 Dec 2026 – 2 Jan 2027" (crossing).
export function formatCompactRange(startISO: string, endISOExclusive: string | null) {
  const a = new Date(startISO);
  const d = lastInclusiveDay(startISO, endISOExclusive);

  if (d.getTime() === a.getTime()) {
    return `${a.getUTCDate()} ${MONTHS[a.getUTCMonth()]} ${a.getUTCFullYear()}`;
  }

  const sameMonthYear =
    a.getUTCMonth() === d.getUTCMonth() && a.getUTCFullYear() === d.getUTCFullYear();

  if (sameMonthYear) {
    return `${a.getUTCDate()}–${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  }
  return `${a.getUTCDate()} ${MONTHS[a.getUTCMonth()]} ${a.getUTCFullYear()} – ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatFullDate(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// Day + month at large size, year separately at small size (timeline entries).
export function formatDayMonth(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

export function formatYear(iso: string) {
  return String(new Date(iso).getUTCFullYear());
}

const ORDINAL_WORDS = [
  "FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH",
  "SIXTH", "SEVENTH", "EIGHTH", "NINTH", "TENTH",
];

export function ordinalStayLabel(n: number) {
  const word = ORDINAL_WORDS[n - 1] ?? `${n}TH`;
  return `${word} STAY`;
}

export function tripDayNumber(tripStartISO: string, dateISO: string) {
  const start = new Date(tripStartISO);
  const date = new Date(dateISO);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((date.getTime() - start.getTime()) / msPerDay) + 1;
}

export function formatRelativeTime(iso: string, now: Date = new Date()) {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  return formatFullDate(iso);
}

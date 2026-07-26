const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDateRangePill(arrivalISO: string, departureISO: string) {
  const a = new Date(arrivalISO);
  const d = new Date(departureISO);
  const ay = String(a.getUTCFullYear()).slice(2);
  const dy = String(d.getUTCFullYear()).slice(2);

  return `${a.getUTCDate()} ${MONTHS[a.getUTCMonth()]} ${ay} - ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${dy}`;
}

export function formatFullDate(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
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

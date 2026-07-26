import type { City, CityStatus } from "./types";

export function getCityStatus(city: City, now: Date = new Date()): CityStatus {
  if (city.pin_type === "personal") return "personal";

  const arrival = new Date(city.arrival_datetime);
  const departure = new Date(city.departure_datetime);

  if (now < arrival) return "upcoming";
  if (now > departure) return "visited";
  return "current";
}

export const statusColor: Record<CityStatus, string> = {
  current: "var(--color-pin-current)",
  upcoming: "var(--color-pin-upcoming)",
  visited: "var(--color-pin-visited)",
  personal: "var(--color-pin-personal)",
};

export function tripDay(startDate: string, endDate: string, now: Date = new Date()) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.round((end.getTime() - start.getTime()) / msPerDay) + 1;
  const dayNumber = Math.floor((now.getTime() - start.getTime()) / msPerDay) + 1;
  const clamped = Math.min(Math.max(dayNumber, 1), totalDays);
  return { day: clamped, totalDays };
}

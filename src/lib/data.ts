import { supabase } from "./supabase/client";
import type { City, CityWithVisits, DailyUpdate, Trip, Visit } from "./types";

// Supabase has had intermittent timeouts. Retry once, then fall back to the
// last good result this server instance saw, so a blip doesn't take the page
// down. A cold instance with nothing cached still throws.
const lastGood = new Map<string, unknown>();

async function resilient<T>(key: string, fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await fn();
      lastGood.set(key, result);
      return result;
    } catch (err) {
      lastError = err;
    }
  }
  if (lastGood.has(key)) return lastGood.get(key) as T;
  throw lastError;
}

export function getTrip(): Promise<Trip | null> {
  return resilient("trip", async () => {
    const { data, error } = await supabase.from("trip").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return data;
  });
}

export function getCities(): Promise<City[]> {
  return resilient("cities", async () => {
    const { data, error } = await supabase
      .from("cities")
      .select("*")
      .order("arrival_datetime", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => ({ ...row, id: String(row.id) }));
  });
}

export function getVisits(): Promise<Visit[]> {
  return resilient("visits", async () => {
    const { data, error } = await supabase
      .from("visits")
      .select("*")
      .order("start_date", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => ({
      ...row,
      id: String(row.id),
      city_id: String(row.city_id),
      parent_visit_id: row.parent_visit_id != null ? String(row.parent_visit_id) : null,
    }));
  });
}

export async function getCitiesWithVisits(): Promise<CityWithVisits[]> {
  const [cities, visits] = await Promise.all([getCities(), getVisits()]);
  const visitsByCity: Record<string, Visit[]> = {};
  for (const visit of visits) {
    (visitsByCity[visit.city_id] ??= []).push(visit);
  }
  return cities.map((city) => ({ ...city, visits: visitsByCity[city.id] ?? [] }));
}

export function getAllDailyUpdates(): Promise<DailyUpdate[]> {
  return resilient("daily_updates", async () => {
    const { data, error } = await supabase
      .from("daily_updates")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => ({ ...row, id: String(row.id), visit_id: String(row.visit_id) }));
  });
}

export async function getLatestUpdateByVisit(): Promise<Record<string, DailyUpdate>> {
  const updates = await getAllDailyUpdates();
  const latest: Record<string, DailyUpdate> = {};
  for (const update of updates) {
    if (!latest[update.visit_id]) {
      latest[update.visit_id] = update;
    }
  }
  return latest;
}

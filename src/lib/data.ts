import { supabase } from "./supabase/client";
import type { City, CityWithVisits, DailyUpdate, Trip, Visit } from "./types";

export async function getTrip(): Promise<Trip | null> {
  const { data, error } = await supabase.from("trip").select("*").limit(1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .order("arrival_datetime", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({ ...row, id: String(row.id) }));
}

export async function getVisits(): Promise<Visit[]> {
  const { data, error } = await supabase
    .from("visits")
    .select("*")
    .order("start_date", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({ ...row, id: String(row.id), city_id: String(row.city_id) }));
}

export async function getCitiesWithVisits(): Promise<CityWithVisits[]> {
  const [cities, visits] = await Promise.all([getCities(), getVisits()]);
  const visitsByCity: Record<string, Visit[]> = {};
  for (const visit of visits) {
    (visitsByCity[visit.city_id] ??= []).push(visit);
  }
  return cities.map((city) => ({ ...city, visits: visitsByCity[city.id] ?? [] }));
}

export async function getAllDailyUpdates(): Promise<DailyUpdate[]> {
  const { data, error } = await supabase
    .from("daily_updates")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({ ...row, id: String(row.id), visit_id: String(row.visit_id) }));
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

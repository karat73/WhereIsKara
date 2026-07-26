import { supabase } from "./supabase/client";
import type { City, DailyUpdate, Trip } from "./types";

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

export async function getAllDailyUpdates(): Promise<DailyUpdate[]> {
  const { data, error } = await supabase
    .from("daily_updates")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({ ...row, id: String(row.id), city_id: String(row.city_id) }));
}

export async function getLatestUpdateByCity(): Promise<Record<string, DailyUpdate>> {
  const updates = await getAllDailyUpdates();
  const latest: Record<string, DailyUpdate> = {};
  for (const update of updates) {
    if (!latest[update.city_id]) {
      latest[update.city_id] = update;
    }
  }
  return latest;
}

export type PinType = "trip" | "personal";

export type City = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
  arrival_datetime: string;
  departure_datetime: string;
  pin_type: PinType;
  verb: string;
  suggested_activities: string | null;
  suggested_foods: string | null;
  local_animal_name: string | null;
  city_image_url: string | null;
};

export type Visit = {
  id: string;
  city_id: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  is_day_trip: boolean;
  parent_visit_id: string | null;
  visited_with_partner: boolean;
};

export type CityWithVisits = City & { visits: Visit[] };

export type DailyUpdate = {
  id: string;
  visit_id: string;
  date: string;
  caption: string;
  photo_urls: string[] | null;
  mood_tag: string | null;
  created_at: string;
};

export type Trip = {
  id: string;
  title: string;
  tagline: string | null;
  start_date: string;
  end_date: string;
  last_checked_in: string | null;
};

// Visit-level status, derived from dates, never stored.
export type VisitStatus = "upcoming" | "current" | "visited";

// Pin-level status: same as VisitStatus, plus "personal" which is a
// property of the city, not something derived from a visit's dates.
export type PinStatus = VisitStatus | "personal";

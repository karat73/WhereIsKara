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

export type DailyUpdate = {
  id: string;
  city_id: string;
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
};

export type CityStatus = "upcoming" | "current" | "visited" | "personal";

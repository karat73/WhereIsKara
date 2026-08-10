-- v1.1: historic (pre-sabbatical) cities and visits, from Kara's flight log.
-- Run this ONCE in the Supabase SQL editor. There's no unique constraint on
-- cities.name, so running it twice will create duplicate rows - it is not
-- safe to re-run.
--
-- New cities get minimal content (name/country/lat/lng/timezone only -
-- suggested_activities/foods/animal/image stay null, which the popup
-- already handles gracefully by just not rendering those rows).
-- arrival_datetime/departure_datetime are set to match the visit dates
-- for schema completeness, but are no longer used for status logic
-- (visits.start_date/end_date is the source of truth for that).

insert into cities (name, country, lat, lng, timezone, arrival_datetime, departure_datetime, pin_type, verb) values
  ('Edinburgh', 'UK', 55.9533, -3.1883, 'Europe/London', '2016-08-17', '2016-08-18', 'trip', 'Visited'),
  ('New York', 'USA', 40.7128, -74.0060, 'America/New_York', '2016-08-25', '2016-08-30', 'trip', 'Visited'),
  ('Niagara Falls', 'Canada', 43.0896, -79.0849, 'America/Toronto', '2016-08-30', '2016-08-31', 'trip', 'Visited'),
  ('Toronto', 'Canada', 43.6532, -79.3832, 'America/Toronto', '2016-08-31', '2016-09-04', 'trip', 'Visited'),
  ('Paris', 'France', 48.8566, 2.3522, 'Europe/Paris', '2019-01-06', '2019-01-10', 'trip', 'Visited'),
  ('Rome', 'Italy', 41.9028, 12.4964, 'Europe/Rome', '2019-04-01', '2019-04-15', 'trip', 'Visited'),
  ('Naples', 'Italy', 40.8518, 14.2681, 'Europe/Rome', '2019-04-01', '2019-04-15', 'trip', 'Visited'),
  ('Positano', 'Italy', 40.6280, 14.4849, 'Europe/Rome', '2019-04-01', '2019-04-15', 'trip', 'Visited'),
  ('Milan', 'Italy', 45.4642, 9.1900, 'Europe/Rome', '2019-04-01', '2019-04-15', 'trip', 'Visited'),
  ('Florence', 'Italy', 43.7696, 11.2558, 'Europe/Rome', '2019-04-01', '2019-04-15', 'trip', 'Visited'),
  ('Jeju', 'South Korea', 33.4996, 126.5312, 'Asia/Seoul', '2019-12-12', '2019-12-15', 'trip', 'Visited'),
  ('Portimao', 'Portugal', 37.1364, -8.5378, 'Europe/Lisbon', '2019-05-18', '2019-05-25', 'trip', 'Visited'),
  ('Amsterdam', 'Netherlands', 52.3676, 4.9041, 'Europe/Amsterdam', '2020-01-17', '2020-01-21', 'trip', 'Visited'),
  ('Athens', 'Greece', 37.9838, 23.7275, 'Europe/Athens', '2022-12-01', '2022-12-04', 'trip', 'Visited'),
  ('Seville', 'Spain', 37.3891, -5.9845, 'Europe/Madrid', '2022-05-31', '2022-06-03', 'trip', 'Visited'),
  ('Valencia', 'Spain', 39.4699, -0.3763, 'Europe/Madrid', '2022-06-03', '2022-06-06', 'trip', 'Visited'),
  ('Barcelona', 'Spain', 41.3874, 2.1686, 'Europe/Madrid', '2022-06-06', '2022-06-13', 'trip', 'Visited'),
  ('Lisbon', 'Portugal', 38.7223, -9.1393, 'Europe/Lisbon', '2023-04-19', '2023-04-23', 'trip', 'Visited'),
  ('Porto', 'Portugal', 41.1579, -8.6291, 'Europe/Lisbon', '2023-04-23', '2023-04-26', 'trip', 'Visited'),
  ('Washington DC', 'USA', 38.9072, -77.0369, 'America/New_York', '2024-05-10', '2024-05-18', 'trip', 'Visited'),
  ('Palma de Mallorca', 'Spain', 39.5696, 2.6502, 'Europe/Madrid', '2024-09-09', '2024-09-15', 'trip', 'Visited'),
  ('Chicago', 'USA', 41.8781, -87.6298, 'America/Chicago', '2024-09-28', '2024-10-05', 'trip', 'Visited'),
  ('Berlin', 'Germany', 52.5200, 13.4050, 'Europe/Berlin', '2024-11-14', '2024-11-17', 'trip', 'Visited'),
  ('Los Angeles', 'USA', 34.0522, -118.2437, 'America/Los_Angeles', '2025-03-23', '2025-03-29', 'trip', 'Visited'),
  ('Siena', 'Italy', 43.3188, 11.3308, 'Europe/Rome', '2024-03-22', '2024-03-23', 'trip', 'Visited'),
  ('Clarksdale', 'USA', 34.2001, -90.5698, 'America/Chicago', '2026-04-16', '2026-04-19', 'trip', 'Visited');

insert into visits (city_id, start_date, end_date) values
  ((select id from cities where name = 'Edinburgh'), '2016-08-17', '2016-08-18'),
  ((select id from cities where name = 'New York'), '2016-08-25', '2016-08-30'),
  ((select id from cities where name = 'New York'), '2023-03-20', '2023-03-26'),
  ((select id from cities where name = 'New York'), '2025-03-10', '2025-03-16'),
  ((select id from cities where name = 'Niagara Falls'), '2016-08-30', '2016-08-31'),
  ((select id from cities where name = 'Toronto'), '2016-08-31', '2016-09-04'),
  ((select id from cities where name = 'Paris'), '2019-01-06', '2019-01-10'),
  ((select id from cities where name = 'Rome'), '2019-04-01', '2019-04-15'),
  ((select id from cities where name = 'Naples'), '2019-04-01', '2019-04-15'),
  ((select id from cities where name = 'Positano'), '2019-04-01', '2019-04-15'),
  ((select id from cities where name = 'Milan'), '2019-04-01', '2019-04-15'),
  ((select id from cities where name = 'Florence'), '2019-04-01', '2019-04-15'),
  ((select id from cities where name = 'Florence'), '2024-03-23', '2024-03-27'),
  ((select id from cities where name = 'Jeju'), '2019-12-12', '2019-12-15'),
  ((select id from cities where name = 'Portimao'), '2019-05-18', '2019-05-25'),
  ((select id from cities where name = 'Amsterdam'), '2020-01-17', '2020-01-21'),
  ((select id from cities where name = 'Amsterdam'), '2024-12-28', '2025-01-02'),
  ((select id from cities where name = 'Athens'), '2022-12-01', '2022-12-04'),
  ((select id from cities where name = 'Seville'), '2022-05-31', '2022-06-03'),
  ((select id from cities where name = 'Valencia'), '2022-06-03', '2022-06-06'),
  ((select id from cities where name = 'Valencia'), '2023-05-25', '2023-06-01'),
  ((select id from cities where name = 'Barcelona'), '2022-06-06', '2022-06-13'),
  ((select id from cities where name = 'Lisbon'), '2023-04-19', '2023-04-23'),
  ((select id from cities where name = 'Porto'), '2023-04-23', '2023-04-26'),
  ((select id from cities where name = 'Washington DC'), '2024-05-10', '2024-05-18'),
  ((select id from cities where name = 'Washington DC'), '2025-03-21', '2025-03-23'),
  ((select id from cities where name = 'Palma de Mallorca'), '2024-09-09', '2024-09-15'),
  ((select id from cities where name = 'Chicago'), '2024-09-28', '2024-10-05'),
  ((select id from cities where name = 'Chicago'), '2025-03-16', '2025-03-21'),
  ((select id from cities where name = 'Chicago'), '2025-07-04', '2025-07-09'),
  ((select id from cities where name = 'Berlin'), '2024-11-14', '2024-11-17'),
  ((select id from cities where name = 'Los Angeles'), '2025-03-23', '2025-03-29'),
  ((select id from cities where name = 'Los Angeles'), '2026-03-20', '2026-03-29'),
  ((select id from cities where name = 'Siena'), '2024-03-22', '2024-03-23'),
  ((select id from cities where name = 'Clarksdale'), '2026-04-16', '2026-04-19'),
  ((select id from cities where name = 'Seoul' limit 1), '2019-08-23', '2020-07-20');

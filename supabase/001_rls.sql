-- Run this once in the Supabase SQL editor (Project > SQL Editor).
-- Enables RLS and sets public read-only access on cities/daily_updates/trip.
-- All writes go through the admin API route, which uses the service-role key
-- and therefore bypasses RLS entirely -- no INSERT/UPDATE policies are defined
-- for the anon role on purpose.

grant usage on schema public to anon, authenticated, service_role;
grant select on public.trip to anon, authenticated;
grant select on public.cities to anon, authenticated;
grant select on public.daily_updates to anon, authenticated;

-- service_role is used only by the admin check-in API route (server-side,
-- never exposed to the browser) to insert new daily updates.
grant select, insert, update, delete on public.trip to service_role;
grant select, insert, update, delete on public.cities to service_role;
grant select, insert, update, delete on public.daily_updates to service_role;

alter table public.trip enable row level security;
alter table public.cities enable row level security;
alter table public.daily_updates enable row level security;

drop policy if exists "public read trip" on public.trip;
create policy "public read trip"
  on public.trip for select
  to anon, authenticated
  using (true);

drop policy if exists "public read cities" on public.cities;
create policy "public read cities"
  on public.cities for select
  to anon, authenticated
  using (true);

drop policy if exists "public read daily_updates" on public.daily_updates;
create policy "public read daily_updates"
  on public.daily_updates for select
  to anon, authenticated
  using (true);

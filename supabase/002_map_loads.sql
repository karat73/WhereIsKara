-- Run this once in the Supabase SQL editor.
-- Tracks Mapbox "map load" events ourselves so we get an early warning
-- before hitting Mapbox's billed usage tiers (25k/mo free, then billed).
-- Fully locked down: no RLS policies, so only the service-role key
-- (used server-side only, in /api/track/map-load and /api/cron/check-map-loads)
-- can read or write this table.

create table if not exists public.map_loads (
  month text primary key, -- 'YYYY-MM'
  count integer not null default 0,
  notified_25k boolean not null default false,
  notified_40k boolean not null default false
);

alter table public.map_loads enable row level security;

grant usage on schema public to service_role;
grant select, insert, update on public.map_loads to service_role;

-- Atomic increment-or-create, avoids a race between concurrent map loads.
create or replace function public.increment_map_loads(p_month text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  insert into public.map_loads (month, count)
  values (p_month, 1)
  on conflict (month) do update set count = map_loads.count + 1
  returning count into new_count;
  return new_count;
end;
$$;

grant execute on function public.increment_map_loads(text) to service_role;

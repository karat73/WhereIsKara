-- v1.1 migration: visits table.
-- Run STEP 1 first, then run the verification query and confirm the
-- counts match before running STEP 2. STEP 2 is the irreversible part
-- (drops daily_updates.city_id) - do not run it until you've checked.

-- ============================================================
-- STEP 1: create visits, backfill, add + populate visit_id
-- ============================================================

create table if not exists visits (
  id int8 generated always as identity primary key,
  city_id int8 references cities(id) on delete cascade,
  start_date date not null,
  end_date date,
  created_at timestamptz default now()
);
create index if not exists visits_city_id_idx on visits (city_id);
create index if not exists visits_start_date_idx on visits (start_date);

alter table visits enable row level security;
grant usage on schema public to anon, authenticated, service_role;
grant select on visits to anon, authenticated;
grant select, insert, update, delete on visits to service_role;

drop policy if exists "public read visits" on visits;
create policy "public read visits"
  on visits for select
  to anon, authenticated
  using (true);

-- One visit per existing city, from its current dates.
insert into visits (city_id, start_date, end_date)
select id, arrival_datetime::date, departure_datetime::date
from cities;

-- Link daily_updates to visits instead of cities directly.
alter table daily_updates add column if not exists visit_id int8 references visits(id);

update daily_updates du
set visit_id = v.id
from visits v
where v.city_id = du.city_id
  and du.visit_id is null;

grant select, insert, update, delete on visits to service_role;

-- ============================================================
-- VERIFY before running STEP 2:
--   1. Every row below should show a match (no NULL visit_id, and
--      total row count should equal daily_updates' full row count).
--   2. visits row count should equal cities row count.
-- ============================================================
-- select count(*) as total_updates,
--        count(visit_id) as updates_with_visit
-- from daily_updates;
--
-- select (select count(*) from visits) as visit_count,
--        (select count(*) from cities) as city_count;

-- ============================================================
-- STEP 2: only after verifying the above, drop the old column.
-- (cities.arrival_datetime / departure_datetime are left in place
-- on purpose - not touched by this migration.)
-- ============================================================
-- alter table daily_updates drop column city_id;

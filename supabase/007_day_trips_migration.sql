-- Section 3 (build spec 21 Sep): day trips.
-- A day trip is a visits row that hangs off a parent stay - it gets its
-- own map marker and popup but never changes where Kara "is".
--
-- Also adds visited_with_partner (section 4) since both sections touch
-- the visits table and share one migration per the spec.

alter table visits
  add column if not exists is_day_trip boolean not null default false,
  add column if not exists parent_visit_id int8 references visits(id) on delete cascade,
  add column if not exists visited_with_partner boolean not null default false;

-- A day trip must have a parent; a stay must not.
alter table visits drop constraint if exists day_trip_parent_check;
alter table visits add constraint day_trip_parent_check
  check ((is_day_trip and parent_visit_id is not null)
      or (not is_day_trip and parent_visit_id is null));

create index if not exists visits_parent_visit_id_idx on visits (parent_visit_id);

-- No RLS changes needed: policies are row-level, not column-level, and
-- visits already grants public select / service-role-only writes.

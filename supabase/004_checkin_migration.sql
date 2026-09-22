-- v1.1: "I'm safe" check-in feature.
-- Low-risk, single column add. Writes go through the service-role key only
-- (via /api/checkin), so no RLS write policy is added for anon/authenticated.

alter table trip add column if not exists last_checked_in timestamptz;

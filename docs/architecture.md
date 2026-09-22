# Architecture

## Stack

- **Next.js 16** (App Router): Server Components fetch data, Client Components handle map interaction and forms
- **Supabase (Postgres)**: public reads via the anon key under RLS, all writes go through the service-role key from server-only code
- **Mapbox GL JS**: globe projection, custom Studio style
- **Vercel**: hosting, plus a cron job that emails a usage-alert once map loads cross a threshold
- **IBM Plex Sans / Mono** via `next/font`

## Data model

```
cities          one row per place
  pin_type        "trip" | "personal"

visits          one row per stay at a city - a city can have several
                (repeat stops, plus day trips)
  start_date, end_date    end_date is exclusive: the day of departure,
                          not the last day present
  is_day_trip             excluded from route/arrow/day-count logic,
                          shares a plain status-coloured pin + spur line
                          back to its parent stay
  parent_visit_id         set only when is_day_trip is true
  visited_with_partner    per-visit, not inherited from the parent stay

daily_updates   one row per visit holding the latest caption/photo
  created_at              set once on insert, never touched again -
                          the timeline sorts and dates by this, not by
                          whatever the row was last edited

trip            single row: the sabbatical's date range + last_checked_in
```

## Status derivation

A visit is `current` when `start_date <= today < end_date`. `today` is
computed in the *city's own local timezone*, not a raw UTC instant -
comparing UTC "now" against a plain calendar date is what caused an
earlier bug where a city could flip status a day early or late depending
on its offset from UTC.

`current` / `upcoming` / `visited` are derived **positionally** from a
sorted sequence of a city's stays, not independently per row. That
matters on a changeover day: if one stay's `end_date` equals the next
stay's `start_date`, deriving status per-row in isolation could make
both look current (or neither). Sorting the whole sequence first and
walking it once avoids that.

When a city has multiple visits (a repeat stop), the one shown is picked
in this order: current, else the most recent visit that was with another person
(so a later solo revisit doesn't bury an earlier shared one), else the
most recent past visit, else the nearest upcoming one.

## Notable decisions

- **Mapbox over OpenStreetMap**, for styling control over the custom
  paper/ink look.
- **Day trips are `visits` rows**, not a separate table - they reuse
  the existing status/popup/timeline machinery and only need an
  `is_day_trip` flag plus a parent reference, rather than a parallel
  code path.
- **No admin UI for creating visits or day trips yet.** New stays are
  inserted directly against the service-role client. The `supabase/`
  folder's migrations are numbered in the order they were run.
- **One `daily_updates` row per visit** (upsert on repost), not an
  accumulating log - editing a caption never creates a duplicate, and
  `created_at` is what pins it in place on the timeline.

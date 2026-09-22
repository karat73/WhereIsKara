# Feature spec: day trips

*One of the specs this project was built from, lightly edited for the public repo. Included as an example of how features were scoped before implementation: written as a spec like this one, then handed to an AI pair-programmer with acceptance criteria it could check its own work against.*

## Problem

The map's pin model treats every visit as "where Kara is right now."
That's the wrong model for a day trip: a one-day excursion (e.g. Ha Long
Bay from Hanoi) shouldn't change the current-city pin, shouldn't get its
own entry in the day counter, and shouldn't interrupt the route line
between real stays. But it should still be visible on the map and get
its own popup, since it's a part of the trip.

## Solution

A day trip is a `visits` row that hangs off a parent stay. It gets its
own map marker and popup, but doesn't change where Kara "is."

## Schema

```sql
alter table visits
  add column is_day_trip boolean not null default false,
  add column parent_visit_id int8 null references visits(id) on delete cascade;

-- A day trip must have a parent; a stay must not.
alter table visits add constraint day_trip_parent_check
  check ((is_day_trip and parent_visit_id is not null)
      or (not is_day_trip and parent_visit_id is null));
```

Day trips still link to `daily_updates` via `visit_id` like any other
visit. No separate content model needed.

## Status logic

- Excluded from current/upcoming/visited derivation and from the
  upcoming route's arrow sequence.
- Excluded from the "Day X of N" counter and any "current city" copy.
- While a day trip is happening, the parent stay stays current.

## Map marker

- Same pin as a regular stay, coloured by its own status (current /
  upcoming / visited), since day trips are real, dated visits and follow
  the same visual language as everything else on the map.
- A dashed spur line runs from the parent stay's pin to the day trip's
  pin, styled to match the upcoming route (so it reads as "a leg out
  from here," not a separate kind of line).
- Tap or click opens the popup, same as any pin.

## Popup

Reuse the existing popup component unchanged, in its existing position
(right-hand panel on desktop, bottom sheet on mobile). Otherwise it has the city name, date, and any linked update and photo, same as a stay.

## Timeline

Day trips list in date order alongside stays, with a small "Day trip"
tag next to the city name.

## Acceptance criteria

- [x] A day trip never changes the current-city pin or the day counter.
- [x] The route/arrow sequence skips day trips entirely.
- [x] The parent stay's spur line connects correctly to the day trip's
      pin, and doesn't cover other markers.
- [x] The popup shows full content (photo, caption) for a day trip
      exactly as it would for a stay.
- [x] A city whose only visit is a day trip doesn't appear at all once
      that visit is deleted (a real bug caught during review: an
      "All time" filter was showing every city row regardless of
      whether it had any visits left).

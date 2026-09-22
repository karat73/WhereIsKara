# Where in the world is Kara?

A live pin board tracking a 6-month sabbatical. **[whereiskara.com](https://whereiskara.com)**

## What this is

Medium term: A single place for friends, family and well-wishers to see where I am during a 6 month sabbatical.
Long term: A travel pin board map that shows where I am right now, where I've been, and where I'm
headed next.

## Key features

- **Live status, derived not stored.** Whether a city is current,
  upcoming, or already visited is computed from its dates every time
  the page loads, in that city's own timezone. Nothing is manually
  flipped when Kara moves on to a new place.
- **Repeat visits.** A city can have more than one stay (e.g. Hanoi in
  July and again in September); the map picks whichever one is most
  relevant to show.
- **Day trips.** A one-day excursion off a longer stay gets its own pin
  and popup without changing where the "current" pin sits or bumping
  the day counter. See [`docs/feature-spec-day-trips.md`](docs/feature-spec-day-trips.md)
  for how this one was scoped before it was built.
- **"I'm safe" check-in**, visible on the map.
- **A timeline** of every posted update, ordered by when it was first
  posted. Editing an old caption can't move it or change its date.

## How this was built

Most features here started as a written spec (problem statement,
schema, behaviour rules, acceptance criteria) before any code was
written. Figma designs were created the old fashioned way, then spec + designs were handed to an AI pair-programmer (Claude Code) a section
at a time, checking each one against its own criteria before moving on.
[`docs/feature-spec-day-trips.md`](docs/feature-spec-day-trips.md) is a
real example, lightly cleaned up for this repo.

[`docs/architecture.md`](docs/architecture.md) covers the data model
and a few of the less obvious implementation decisions (why status is
derived positionally rather than per-row, why day trips are a `visits`
row rather than a separate table, and so on).

## Tech stack

- [Next.js](https://nextjs.org) (App Router) on [Vercel](https://vercel.com)
- [Supabase](https://supabase.com) (Postgres), public reads under RLS,
  writes through a service-role key from server-only routes
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) for the globe
  map, on a custom Studio style
- IBM Plex Sans / Mono, via `next/font`

## Project structure

```
src/
  app/            routes (home map, timeline, about, admin, API routes)
  components/     grouped by feature (Map/, Admin/, About/)
  lib/            data access, status derivation, formatting
  hooks/          small client-side hooks (local clock, weather)
supabase/         SQL migrations, numbered in the order they were run
docs/             architecture notes and an example feature spec
```

## Getting started

```bash
git clone https://github.com/karat73/WhereIsKara.git
cd WhereIsKara
npm install
```

Add a `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`RESEND_API_KEY`, `ALERT_EMAIL_TO`, `CRON_SECRET` and `CHECKIN_SECRET`
are optional, only needed for the map-usage alert emails and an
external check-in trigger.

## License

MIT, see [LICENSE](LICENSE).

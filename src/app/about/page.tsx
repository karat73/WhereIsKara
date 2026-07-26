export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-24 px-4 sm:px-6">
      <article className="max-w-xl mx-auto prose-none">
        <h1 className="font-display text-4xl mb-4">Behind the build</h1>

        <p className="text-text-secondary leading-relaxed">
          Where in the world is Kara? is a live map of my six-month sabbatical, built so friends and
          family can see where I am and what I&rsquo;m up to without a group chat full of
          &ldquo;wait, where are you again?&rdquo; It&rsquo;s also a small portfolio piece —
          a chance to show what building with an AI pair-programmer actually looks like,
          warts and all.
        </p>

        <h2 className="font-display text-2xl mt-10 mb-3">Decisions & tradeoffs</h2>
        <ul className="space-y-3 text-text-secondary leading-relaxed list-disc pl-5">
          <li>
            <span className="text-text-primary font-medium">City-level location only.</span>{" "}
            Pins use city-center coordinates, not exact GPS. It&rsquo;s a safety choice —
            nobody needs my precise location, just roughly where I am.
          </li>
          <li>
            <span className="text-text-primary font-medium">No blog or photo galleries.</span>{" "}
            A running caption per city keeps the update habit lightweight. A full gallery or
            blog would&rsquo;ve turned &ldquo;post a quick update&rdquo; into a chore I&rsquo;d
            eventually stop doing.
          </li>
          <li>
            <span className="text-text-primary font-medium">Timeline is de-emphasized.</span>{" "}
            The map is the point. The timeline exists for anyone who wants the reverse-chron
            feed, but it&rsquo;s a footer link, not a tab competing for attention.
          </li>
          <li>
            <span className="text-text-primary font-medium">One shared admin login.</span>{" "}
            Posting updates only needs to keep out randoms, not manage multiple accounts — a
            single password gate is proportionate to the actual risk.
          </li>
        </ul>

        <h2 className="font-display text-2xl mt-10 mb-3">Changelog</h2>
        <ul className="space-y-2 text-text-secondary leading-relaxed">
          <li>
            <span className="text-text-muted">2026-07-26</span> — Initial build: globe map,
            city popups, timeline, admin check-in.
          </li>
        </ul>

        <h2 className="font-display text-2xl mt-10 mb-3">What&rsquo;s next</h2>
        <ul className="space-y-2 text-text-secondary leading-relaxed list-disc pl-5">
          <li>A custom domain</li>
          <li>A distance-traveled counter</li>
          <li>Postcard export for individual cities</li>
          <li>A small set of animated pixel-Kara poses instead of one static icon</li>
          <li>Weather-reactive popup tint</li>
        </ul>

        <h2 className="font-display text-2xl mt-10 mb-3">Stack</h2>
        <p className="text-text-secondary leading-relaxed">
          Next.js on Vercel, Supabase (Postgres) for data, Mapbox GL JS for the globe, and
          Fraunces + Karla for type.
        </p>

      </article>
    </div>
  );
}

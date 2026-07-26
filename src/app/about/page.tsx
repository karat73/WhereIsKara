export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-24 px-4 sm:px-6">
      <article className="max-w-xl mx-auto prose-none">
        <h1 className="font-display text-4xl mb-4">About</h1>

        <h2 className="font-display text-2xl mt-10 mb-3">Why</h2>
        <p className="text-text-secondary leading-relaxed">
          I&rsquo;m away for six+ months, this is the easiest way to keep people in the loop.
        </p>

        <h2 className="font-display text-2xl mt-10 mb-3">Decisions for V1</h2>
        <ul className="space-y-3 text-text-secondary leading-relaxed list-disc pl-5">
          <li>Mapbox &gt; OpenStreetMap due to the ease of styling.</li>
          <li>
            The early plan included blog entries and photo uploads but once sketched out felt
            v 2009. Check-ins do the work instead, kind of like IG stories without using a
            Meta product. Aiming for this site to be a live pin board, not a blog.
          </li>
          <li>
            The timeline is there to collate daily updates and will be expanded on in later
            updates.
          </li>
        </ul>

        <h2 className="font-display text-2xl mt-10 mb-3">Changelog</h2>
        <ul className="space-y-4 text-text-secondary leading-relaxed">
          <li>
            <p className="text-text-primary font-medium">v1.0 &ndash; 26 July 2026</p>
            <p>Map, current location, check-ins, popup content, route lines.</p>
          </li>
        </ul>

        <h2 className="font-display text-2xl mt-10 mb-3">Still to come</h2>
        <ul className="space-y-2 text-text-secondary leading-relaxed list-disc pl-5">
          <li>Pixel-Arina and Pixel-Kate.</li>
          <li>A little wave animation before the map settles.</li>
          <li>Running distance tally.</li>
          <li>Trips from before this sabbatical, mapped in.</li>
        </ul>

        <h2 className="font-display text-2xl mt-10 mb-3">Built with</h2>
        <p className="text-text-secondary leading-relaxed">
          Next.js, Supabase, Mapbox, Vercel. Designed in Figma, built with Claude Code.
        </p>

        <p className="mt-10 text-sm text-text-muted">
          Bugs, ideas, anything -{" "}
          <a
            href="mailto:feedback@whereiskara.com"
            className="text-accent hover:text-accent-hover underline"
          >
            feedback@whereiskara.com
          </a>
        </p>
      </article>
    </div>
  );
}

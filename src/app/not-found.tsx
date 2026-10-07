import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 pt-14 pb-11 text-center">
      <h1 className="font-display text-[39px] mb-3">Not here</h1>
      <p className="text-[16px] text-text-secondary mb-6">That page doesn&rsquo;t exist.</p>
      <Link href="/" className="text-[14px] text-accent hover:text-accent-hover underline underline-offset-4">
        Back to the map
      </Link>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { getTrip } from "@/lib/data";

const SIXTY_HOURS_MS = 60 * 60 * 60 * 1000;

export async function Header() {
  const trip = await getTrip().catch(() => null);

  const checkedInValue = trip?.last_checked_in
    ? formatDistanceToNowStrict(new Date(trip.last_checked_in), { addSuffix: true })
    : null;
  const checkedInStale = trip?.last_checked_in
    ? Date.now() - new Date(trip.last_checked_in).getTime() > SIXTY_HOURS_MS
    : false;

  return (
    <header className="fixed top-0 inset-x-0 z-30 h-14 flex items-center justify-between px-4 sm:px-6 bg-bg/95 backdrop-blur border-b border-border">
      <Link href="/" className="flex items-center gap-2 min-w-0">
        <Image
          src="/kara/header-logo.png"
          alt=""
          width={28}
          height={28}
          className="rounded-full shrink-0"
          priority
        />
        <span className="font-bold text-lg sm:text-xl text-text-primary truncate">
          Where in the world is Kara?
        </span>
      </Link>
      {checkedInValue && (
        <div className="shrink-0 text-right leading-tight">
          <p className="text-[11px] uppercase text-text-secondary">Check-in</p>
          <p
            className={`font-mono-num text-[13px] ${
              checkedInStale ? "text-text-secondary" : "text-text-primary"
            }`}
          >
            {checkedInValue}
          </p>
        </div>
      )}
    </header>
  );
}

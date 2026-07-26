import Image from "next/image";
import Link from "next/link";
import { getTrip } from "@/lib/data";
import { tripDay } from "@/lib/status";

export async function Header() {
  const trip = await getTrip().catch(() => null);
  const dayLabel = trip ? tripDay(trip.start_date, trip.end_date) : null;

  return (
    <header className="fixed top-0 inset-x-0 z-30 h-14 flex items-center justify-between px-4 sm:px-6 bg-bg/95 backdrop-blur border-b border-border">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/kara/header-logo.png"
          alt=""
          width={28}
          height={28}
          className="rounded-full"
          priority
        />
        <span className="font-title font-bold text-lg sm:text-xl text-text-primary">
          Where in the world is Kara?
        </span>
      </Link>
      {dayLabel && (
        <span className="text-sm font-bold text-text-primary bg-surface-muted rounded-full px-4 py-1.5">
          Day {dayLabel.day}
        </span>
      )}
    </header>
  );
}

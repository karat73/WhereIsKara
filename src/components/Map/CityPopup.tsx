"use client";

import Image from "next/image";
import { useLocalClock } from "@/hooks/useLocalClock";
import { useCityWeather } from "@/hooks/useCityWeather";
import { formatDateRangePill, formatRelativeTime } from "@/lib/format";
import { getCityStatus, statusColor } from "@/lib/status";
import type { City, DailyUpdate } from "@/lib/types";

type Props = {
  city: City;
  latestUpdate: DailyUpdate | null;
  onClose: () => void;
};

const pillTextColor: Record<string, string> = {
  current: "#FFFFFF",
  upcoming: "#FFFFFF",
  visited: "#FFFFFF",
  personal: "#FFFFFF",
};

export function CityPopup({ city, latestUpdate, onClose }: Props) {
  const status = getCityStatus(city);
  const localTime = useLocalClock(city.timezone);
  const tempC = useCityWeather(city.lat, city.lng);

  const showUpdate = status !== "upcoming" && latestUpdate;
  const metaParts = [city.country, tempC != null ? `${tempC}°C` : null, localTime || null].filter(
    Boolean
  );

  return (
    <div
      className="
        fixed z-40 bg-surface border-border shadow-2xl overflow-y-auto
        inset-x-0 bottom-0 h-[68vh] rounded-t-2xl border-t
        pb-[env(safe-area-inset-bottom)]
        sm:inset-x-auto sm:right-0 sm:top-14 sm:bottom-11 sm:h-auto
        sm:w-[42%] sm:min-w-[380px] sm:max-w-[560px] sm:rounded-none sm:border-t-0 sm:border-l
        animate-[slideIn_0.25s_ease-out]
      "
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-display text-3xl text-text-primary">{city.name}</h2>
            <span
              className="text-xs font-medium rounded-full px-3 py-1"
              style={{ backgroundColor: statusColor[status], color: pillTextColor[status] }}
            >
              {formatDateRangePill(city.arrival_datetime, city.departure_datetime)}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            &times;
          </button>
        </div>

        <p className="mt-2 text-sm text-text-secondary">{metaParts.join(" · ")}</p>

        <dl className="mt-5 divide-y divide-border border-y border-border">
          {city.suggested_foods && (
            <div className="flex items-center justify-between py-2.5 text-sm">
              <dt className="text-text-secondary">Eating</dt>
              <dd className="font-medium text-text-primary">{city.suggested_foods}</dd>
            </div>
          )}
          {city.suggested_activities && (
            <div className="flex items-center justify-between py-2.5 text-sm">
              <dt className="text-text-secondary">{city.verb || "Seeing"}</dt>
              <dd className="font-medium text-text-primary">{city.suggested_activities}</dd>
            </div>
          )}
          {city.local_animal_name && (
            <div className="flex items-center justify-between py-2.5 text-sm">
              <dt className="text-text-secondary">Befriending</dt>
              <dd className="font-medium text-text-primary">{city.local_animal_name}</dd>
            </div>
          )}
        </dl>

        <div className="mt-5 relative aspect-[16/10] rounded-xl overflow-hidden bg-surface-muted">
          {city.city_image_url ? (
            <Image
              src={city.city_image_url}
              alt={city.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm">
              Photo coming soon
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-[80%] flex justify-center items-end pointer-events-none">
            <div className="relative h-full aspect-square">
              <Image src="/kara/kara-overlay.png" alt="" fill className="object-contain drop-shadow-md" />
            </div>
          </div>
        </div>

        {showUpdate && (
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs tracking-wide uppercase text-text-muted mb-2">
              Kara&rsquo;s update
            </p>
            <p className="font-display italic text-xl text-text-primary leading-snug">
              &ldquo;{latestUpdate!.caption}&rdquo;
            </p>
            <p className="mt-2 text-xs text-text-muted">{formatRelativeTime(latestUpdate!.date)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

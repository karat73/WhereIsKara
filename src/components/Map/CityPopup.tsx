"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useLocalClock } from "@/hooks/useLocalClock";
import { useCityWeather } from "@/hooks/useCityWeather";
import { formatBadgeDate, formatCompactRange, formatRelativeTime } from "@/lib/format";
import { getPinStatus, getVisitStatus, pickRepresentativeVisit, statusColor } from "@/lib/status";
import type { CityWithVisits, DailyUpdate, VisitStatus } from "@/lib/types";

type Props = {
  city: CityWithVisits;
  latestUpdateByVisit: Record<string, DailyUpdate>;
  onClose: () => void;
};

const CLOSE_ANIMATION_MS = 250;

const badgeStyle: Record<VisitStatus, { bg: string; border: string; text: string }> = {
  current: {
    bg: "var(--color-mustard)",
    border: "var(--color-mustard)",
    text: "#FFFFFF",
  },
  visited: { bg: "transparent", border: "var(--color-stone)", text: "var(--color-ink)" },
  upcoming: { bg: "transparent", border: "var(--color-blue)", text: "var(--color-blue)" },
};

export function CityPopup({ city, latestUpdateByVisit, onClose }: Props) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(onClose, reduceMotion ? 0 : CLOSE_ANIMATION_MS);
  }, [isClosing, onClose]);

  const now = new Date();
  const representativeVisit = pickRepresentativeVisit(city.visits, city.timezone, now);
  const visitStatus: VisitStatus = representativeVisit
    ? getVisitStatus(representativeVisit, city.timezone, now)
    : "upcoming";
  const pinStatus = getPinStatus(city, representativeVisit, now);

  const localTime = useLocalClock(city.timezone);
  const tempC = useCityWeather(city.lat, city.lng);

  const latestUpdate = representativeVisit ? latestUpdateByVisit[representativeVisit.id] : null;
  const showUpdate = visitStatus !== "upcoming" && !!latestUpdate;
  const withPartner = representativeVisit?.visited_with_partner ?? false;

  const metaParts = [city.country, tempC != null ? `${tempC}°C` : null, localTime || null].filter(
    Boolean
  );

  const otherVisits = city.visits
    .filter((v) => v.id !== representativeVisit?.id)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
  const pastOthers = otherVisits.filter((v) => getVisitStatus(v, city.timezone, now) === "visited");
  const futureOthers = otherVisits.filter(
    (v) => getVisitStatus(v, city.timezone, now) === "upcoming"
  );
  const alsoHereParts = [
    pastOthers.length > 0
      ? `Also here: ${pastOthers.map((v) => formatCompactRange(v.start_date, v.end_date)).join(", ")}`
      : null,
    futureOthers.length > 0
      ? `Back here: ${futureOthers.map((v) => formatCompactRange(v.start_date, v.end_date)).join(", ")}`
      : null,
  ].filter(Boolean);

  const badge = badgeStyle[visitStatus];

  return (
    <>
      {/* Mobile only: the exposed map strip above the sheet. Sits below the
          sheet's own z-index, so taps on the sheet itself never reach it -
          only taps on the map above it do. */}
      <div className="fixed inset-0 z-30 sm:hidden" onClick={handleClose} aria-hidden="true" />
      <div
        className={`
          fixed z-40 bg-surface overflow-y-auto overscroll-contain
          inset-x-0 bottom-0 max-h-[85dvh] rounded-t-[14px] border-t-[3px]
          pb-[env(safe-area-inset-bottom)]
          sm:inset-x-auto sm:right-0 sm:top-14 sm:bottom-11 sm:max-h-none sm:h-auto
          sm:w-[42%] sm:min-w-[380px] sm:max-w-[560px] sm:rounded-none
          sm:border-t-0 sm:border-l-[3px]
          ${isClosing ? "animate-[slideOut_250ms_ease-in_forwards]" : "animate-[slideIn_250ms_ease-out]"}
        `}
        style={{ borderColor: statusColor[pinStatus] }}
      >
        <div className="sticky top-0 z-10 bg-surface flex items-start justify-between gap-3 px-6 pt-6 sm:px-8 sm:pt-8">
          <h2 className="font-display italic font-semibold text-[31px] text-text-primary">
            {city.name}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="shrink-0 w-9 h-9 rounded-full border border-[var(--color-line)] bg-[var(--color-card)] flex items-center justify-center transition-[background-color] duration-[80ms] ease-out active:translate-y-px active:bg-[var(--color-line)]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="var(--color-ink)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
        {representativeVisit && (
          <span
            className="font-mono-num inline-block mt-3 text-[13px] font-medium uppercase rounded-[2px] px-3 py-1 border"
            style={{ backgroundColor: badge.bg, borderColor: badge.border, color: badge.text }}
          >
            {formatBadgeDate(representativeVisit.start_date, representativeVisit.end_date)}
          </span>
        )}

        {alsoHereParts.length > 0 && (
          <p className="mt-2 text-[13px] text-text-secondary">{alsoHereParts.join(" · ")}</p>
        )}

        <p className="mt-3 text-[16px] text-text-secondary tabular-nums">{metaParts.join(" · ")}</p>

        <dl className="mt-5 divide-y divide-border border-y border-border">
          {city.suggested_foods && (
            <div className="flex items-center justify-between py-2.5 text-[16px]">
              <dt className="text-text-secondary">Eating</dt>
              <dd className="font-medium text-text-primary">{city.suggested_foods}</dd>
            </div>
          )}
          {city.suggested_activities && (
            <div className="flex items-center justify-between py-2.5 text-[16px]">
              <dt className="text-text-secondary">{city.verb || "Seeing"}</dt>
              <dd className="font-medium text-text-primary">{city.suggested_activities}</dd>
            </div>
          )}
          {city.local_animal_name && (
            <div className="flex items-center justify-between py-2.5 text-[16px]">
              <dt className="text-text-secondary">Befriending</dt>
              <dd className="font-medium text-text-primary">{city.local_animal_name}</dd>
            </div>
          )}
        </dl>

        <div className="mt-5 relative aspect-[16/10] overflow-hidden bg-surface-muted">
          {city.city_image_url ? (
            <Image
              src={city.city_image_url}
              alt={city.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-text-muted text-[13px]">
              Photo coming soon
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-[80%] flex justify-center items-end pointer-events-none">
            {/* Positioned as a pair when visited with a partner, not a
                fixed slot plus a toggle: two sprites are narrower each so
                the centred group fits, and slightly overlap (Kara drawn
                last, so she's in front) rather than just sitting side by
                side. */}
            {withPartner && (
              <div
                className="relative h-full w-[45%] -mr-8"
                style={{ imageRendering: "pixelated" }}
              >
                <Image
                  src="/kara/arina-overlay.png"
                  alt=""
                  fill
                  className="object-contain object-bottom"
                  unoptimized
                />
              </div>
            )}
            <div
              className={`relative h-full ${withPartner ? "w-[45%]" : "aspect-square"}`}
              style={{ imageRendering: "pixelated" }}
            >
              <Image
                src="/kara/kara-overlay.png"
                alt=""
                fill
                className="object-contain object-bottom"
                unoptimized
              />
            </div>
          </div>
        </div>

        {showUpdate && (
          <div className="mt-6 pt-5 border-t border-border">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[13px] tracking-wide uppercase text-text-muted">Last update</p>
              <p className="font-mono-num text-[13px] text-text-muted">
                {formatRelativeTime(latestUpdate!.created_at)}
              </p>
            </div>
            <p className="mt-2 font-display italic text-[20px] text-text-primary leading-snug">
              &ldquo;{latestUpdate!.caption}&rdquo;
            </p>
            <Link
              href="/timeline"
              className="mt-3 inline-block text-[13px] text-blue border-b border-blue pb-px hover:opacity-80"
            >
              See all updates
            </Link>
          </div>
        )}
        </div>
      </div>
    </>
  );
}

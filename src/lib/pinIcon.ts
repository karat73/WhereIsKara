import type { CityStatus } from "./types";

// Teardrop pin for trip/current/upcoming/visited cities; a rotated diamond for personal pins.
export function pinSvg(status: CityStatus, color: string) {
  if (status === "personal") {
    return `
      <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="7" width="16" height="16" rx="3" transform="rotate(45 15 15)"
          fill="${color}" stroke="white" stroke-width="1.5" />
        <circle cx="15" cy="15" r="3.5" fill="white" />
      </svg>`;
  }
  return `
    <svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.3 21.7 0 14 0z"
        fill="${color}" stroke="white" stroke-width="1.5" />
      <circle cx="14" cy="14" r="5" fill="white" />
    </svg>`;
}

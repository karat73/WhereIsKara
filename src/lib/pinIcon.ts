import type { CityStatus } from "./types";

// Teardrop pin for trip/current/upcoming/visited cities; the same teardrop
// with a house glyph (instead of a dot) for personal pins.
export function pinSvg(status: CityStatus, color: string) {
  if (status === "personal") {
    return `
      <svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.3 21.7 0 14 0z"
          fill="${color}" stroke="white" stroke-width="1.5" />
        <path d="M9 18.75V13.25L14 9.25L19 13.25V18.75H15.5V15.25H12.5V18.75H9Z"
          fill="white" stroke="white" stroke-width="0.5" stroke-linejoin="round" />
      </svg>`;
  }
  return `
    <svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.3 21.7 0 14 0z"
        fill="${color}" stroke="white" stroke-width="1.5" />
      <circle cx="14" cy="14" r="5" fill="white" />
    </svg>`;
}

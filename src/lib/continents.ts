// Country -> continent, for the About page's all-time stats. Not stored in
// the DB since it never changes per-country; just covers every country
// that appears in the cities table (sabbatical + historic).
const COUNTRY_CONTINENT: Record<string, string> = {
  UK: "Europe",
  Vietnam: "Asia",
  Japan: "Asia",
  "Korea (South)": "Asia",
  "South Korea": "Asia",
  Thailand: "Asia",
  Cambodia: "Asia",
  PRC: "Asia",
  China: "Asia",
  Singapore: "Asia",
  "Hong Kong": "Asia",
  Macau: "Asia",
  Taiwan: "Asia",
  India: "Asia",
  USA: "North America",
  Canada: "North America",
  France: "Europe",
  Italy: "Europe",
  Portugal: "Europe",
  Netherlands: "Europe",
  Greece: "Europe",
  Spain: "Europe",
  Germany: "Europe",
  Sweden: "Europe",
  Switzerland: "Europe",
  "United Arab Emirates": "Asia",
};

export function countryToContinent(country: string): string {
  return COUNTRY_CONTINENT[country] ?? "Unknown";
}

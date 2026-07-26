"use client";

import { useState } from "react";
import type { City } from "@/lib/types";

type Props = {
  cities: City[];
  captionsByCity: Record<string, string>;
};

export function CheckInForm({ cities, captionsByCity }: Props) {
  const initialCityId = String(cities[0]?.id ?? "");
  const [cityId, setCityId] = useState(initialCityId);
  const [caption, setCaption] = useState(captionsByCity[initialCityId] ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function handleCityChange(newCityId: string) {
    setCityId(newCityId);
    setCaption(captionsByCity[newCityId] ?? "");
    setStatus("idle");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const res = await fetch("/api/admin/updates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cityId, caption }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      setStatus("error");
      return;
    }

    setStatus("success");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm text-text-secondary mb-1.5">City</label>
        <select
          value={cityId}
          onChange={(e) => handleCityChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-1.5">Caption</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={4}
          placeholder="Buffet hopping in search of vegan pork"
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}
      {status === "success" && (
        <p className="text-sm text-text-secondary">Saved — it&rsquo;s live on the map.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !caption.trim() || !cityId}
        className="rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium px-5 py-2.5 transition-colors"
      >
        {status === "loading" ? "Saving…" : "Save update"}
      </button>
    </form>
  );
}

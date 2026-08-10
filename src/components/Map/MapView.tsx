"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { CityWithVisits, PinStatus, Trip } from "@/lib/types";
import {
  getPinStatus,
  getVisitStatus,
  isWithinTrip,
  pickRepresentativeVisit,
  statusColor,
} from "@/lib/status";
import { pinSvg } from "@/lib/pinIcon";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export type MapFilterMode = "sabbatical" | "all-time";

type Props = {
  cities: CityWithVisits[];
  trip: Trip | null;
  mode: MapFilterMode;
  onSelectCity: (city: CityWithVisits) => void;
  selectedCityId: string | null;
};

export function MapView({ cities, trip, mode, onSelectCity, selectedCityId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Record<string, mapboxgl.Marker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/kt7373/cmrsbvkcy008y01qk68g6h7c1",
      projection: "globe",
      zoom: 1.4,
      center: [20, 20],
      preserveDrawingBuffer: true,
    });
    mapRef.current = map;

    // Self-tracked map load count, so we get an early warning before
    // hitting Mapbox's billed usage tiers. Fire-and-forget, non-blocking.
    fetch("/api/track/map-load", { method: "POST" }).catch(() => {});

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    // The route line and the initial flyTo are always scoped to the
    // sabbatical, regardless of which pins are currently shown - drawing a
    // line across 20 years of unrelated trips would be meaningless.
    const now = new Date();
    const tripCities = cities.filter((c) => c.pin_type === "trip");

    const withRepVisit = tripCities.map((city) => ({
      city,
      visit: pickRepresentativeVisit(
        city.visits.filter((v) => isWithinTrip(v, trip)),
        now
      ),
    }));

    const currentEntry = withRepVisit.find(
      (x) => x.visit && getVisitStatus(x.visit, now) === "current"
    );

    const traveled = withRepVisit
      .filter((x) => x.visit && getVisitStatus(x.visit, now) !== "upcoming")
      .sort((a, b) => a.visit!.start_date.localeCompare(b.visit!.start_date))
      .map((x) => x.city);

    const allUpcoming = withRepVisit
      .filter((x) => x.visit && getVisitStatus(x.visit, now) === "upcoming")
      .sort((a, b) => a.visit!.start_date.localeCompare(b.visit!.start_date))
      .map((x) => x.city);
    const upcomingPath = currentEntry ? [currentEntry.city, ...allUpcoming] : allUpcoming;

    map.on("load", () => {
      map.addSource("route-traveled", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: traveled.map((c) => [c.lng, c.lat]) },
        },
      });
      map.addLayer({
        id: "route-traveled",
        type: "line",
        source: "route-traveled",
        paint: {
          "line-color": "#B7AD95",
          "line-width": 1.75,
        },
      });

      map.addSource("route-upcoming", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: upcomingPath.map((c) => [c.lng, c.lat]) },
        },
      });
      map.addLayer({
        id: "route-upcoming",
        type: "line",
        source: "route-upcoming",
        paint: {
          "line-color": "#2C4A7C",
          "line-width": 1.75,
          "line-dasharray": [0, 4, 3],
        },
      });

      // Small triangular arrow icon, repeated along the dashed line to show direction of travel.
      const arrowSize = 20;
      const arrowCanvas = document.createElement("canvas");
      arrowCanvas.width = arrowSize;
      arrowCanvas.height = arrowSize;
      const arrowCtx = arrowCanvas.getContext("2d")!;
      arrowCtx.fillStyle = "#2C4A7C";
      arrowCtx.beginPath();
      arrowCtx.moveTo(3, 5);
      arrowCtx.lineTo(17, 10);
      arrowCtx.lineTo(3, 15);
      arrowCtx.closePath();
      arrowCtx.fill();
      if (!map.hasImage("route-arrow")) {
        map.addImage("route-arrow", arrowCtx.getImageData(0, 0, arrowSize, arrowSize), {
          pixelRatio: 2,
        });
      }

      map.addLayer({
        id: "route-upcoming-arrows",
        type: "symbol",
        source: "route-upcoming",
        layout: {
          "symbol-placement": "line",
          "symbol-spacing": 60,
          "icon-image": "route-arrow",
          "icon-size": 1.4,
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      });

      if (currentEntry) {
        map.flyTo({
          center: [currentEntry.city.lng, currentEntry.city.lat],
          zoom: 4,
          duration: 4000,
          essential: true,
        });
      }
    });

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    const now = new Date();

    // In "sabbatical" mode, only show cities with a visit inside the trip
    // window (plus the personal/home pin, which is always shown). In
    // "all-time" mode, every city with any visit shows, using its overall
    // representative visit (which may be historic).
    const visibleCities = cities.filter((city) => {
      if (city.pin_type === "personal") return true;
      if (mode === "all-time") return true;
      return city.visits.some((v) => isWithinTrip(v, trip));
    });

    visibleCities.forEach((city) => {
      const visitsForStatus =
        mode === "sabbatical" && city.pin_type !== "personal"
          ? city.visits.filter((v) => isWithinTrip(v, trip))
          : city.visits;
      const representativeVisit = pickRepresentativeVisit(visitsForStatus, now);
      const status: PinStatus = getPinStatus(city, representativeVisit);
      const el = document.createElement("div");
      el.className = "kara-pin";
      el.innerHTML = pinSvg(status, statusColor[status]);
      el.style.width = "28px";

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectCity(city);
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([city.lng, city.lat])
        .addTo(map);

      markersRef.current[city.id] = marker;
    });

    return () => {
      Object.values(markersRef.current).forEach((m) => m.remove());
    };
  }, [cities, trip, mode, onSelectCity]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedCityId) return;
    const city = cities.find((c) => c.id === selectedCityId);
    if (!city) return;
    map.flyTo({ center: [city.lng, city.lat], zoom: Math.max(map.getZoom(), 4), speed: 0.8 });
  }, [selectedCityId, cities]);

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

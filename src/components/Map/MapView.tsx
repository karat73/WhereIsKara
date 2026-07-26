"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { City, CityStatus } from "@/lib/types";
import { getCityStatus, statusColor } from "@/lib/status";
import { pinSvg } from "@/lib/pinIcon";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

type Props = {
  cities: City[];
  onSelectCity: (city: City) => void;
  selectedCityId: string | null;
};

export function MapView({ cities, onSelectCity, selectedCityId }: Props) {
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

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    const now = new Date();
    const tripCities = cities.filter((c) => c.pin_type === "trip");
    const currentCity = tripCities.find((c) => getCityStatus(c, now) === "current");

    const traveled = tripCities
      .filter((c) => {
        const s = getCityStatus(c, now);
        return s === "visited" || s === "current";
      })
      .sort((a, b) => a.arrival_datetime.localeCompare(b.arrival_datetime));

    const allUpcoming = tripCities
      .filter((c) => getCityStatus(c, now) === "upcoming")
      .sort((a, b) => a.arrival_datetime.localeCompare(b.arrival_datetime));
    const upcomingPath = currentCity ? [currentCity, ...allUpcoming] : allUpcoming;

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
          "line-color": "#948E7E",
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
          "line-color": "#8B9199",
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
      arrowCtx.fillStyle = "#8B9199";
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

      if (currentCity) {
        map.flyTo({
          center: [currentCity.lng, currentCity.lat],
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
    cities.forEach((city) => {
      const status: CityStatus = getCityStatus(city, now);
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
  }, [cities, onSelectCity]);

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

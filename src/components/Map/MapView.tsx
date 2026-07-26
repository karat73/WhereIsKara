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
      style: "mapbox://styles/mapbox/light-v11",
      projection: "globe",
      zoom: 1.4,
      center: [20, 20],
    });
    mapRef.current = map;

    map.on("style.load", () => {
      map.setFog({
        color: "#E9E6DD",
        "high-color": "#c9d6e0",
        "horizon-blend": 0.02,
        "space-color": "#1E2320",
        "star-intensity": 0.15,
      });
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    const now = new Date();
    const currentCity = cities.find((c) => getCityStatus(c, now) === "current");
    const visited = cities
      .filter((c) => c.pin_type === "trip")
      .filter((c) => getCityStatus(c, now) !== "upcoming")
      .sort((a, b) => a.arrival_datetime.localeCompare(b.arrival_datetime));

    map.on("load", () => {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: visited.map((c) => [c.lng, c.lat]),
          },
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#948E7E",
          "line-width": 1.75,
          "line-dasharray": [0, 4, 3],
        },
      });

      // Marching-ants dash animation.
      const dashSequence = [
        [0, 4, 3],
        [1, 4, 2],
        [2, 4, 1],
        [3, 4, 0],
        [0, 1, 3, 3],
        [0, 2, 3, 2],
        [0, 3, 3, 1],
      ];
      let step = 0;
      const animateDash = () => {
        if (!mapRef.current || !mapRef.current.getLayer("route-line")) return;
        step = (step + 1) % dashSequence.length;
        mapRef.current.setPaintProperty("route-line", "line-dasharray", dashSequence[step]);
        window.setTimeout(animateDash, 90);
      };
      animateDash();

      if (currentCity) {
        map.flyTo({ center: [currentCity.lng, currentCity.lat], zoom: 4, duration: 0 });
      }
    });

    return () => {
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
      el.style.width = status === "personal" ? "30px" : "28px";

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectCity(city);
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: status === "personal" ? "center" : "bottom" })
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

  return <div ref={containerRef} className="absolute inset-0" />;
}

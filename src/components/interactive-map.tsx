"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { TownInfo, WardFeature } from "@/components/leaflet-map";
import { towns as staticTowns } from "@/data/towns";

// Create a dynamic map component to avoid SSR issues
const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-wiki-card animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-wiki-muted text-sm">Loading map…</p>
    </div>
  ),
});

// Refined, muted tone mapping for Okun LGAs
const lgaColors: { [key: string]: string } = {
  "Kabba/Bunu": "#2d5948",
  "Yagba West": "#4a8b71",
  "Yagba East": "#e09920",
  "Mopa-Muro": "#9a5715",
  Ijumu: "#386f59",
  Lokoja: "#c17816",
};

const OKUN_LGAS = ["Kabba/Bunu", "Yagba West", "Yagba East", "Mopa-Muro", "Ijumu", "Lokoja"];

export default function InteractiveMap() {
  const router = useRouter();
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [towns] = useState<TownInfo[]>(
    () =>
      staticTowns.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        lga: t.lga,
        coordinates: t.coordinates ? t.coordinates.split(",").map(Number) : [0, 0],
        featured: t.featured,
        tagline: t.tagline,
        population: t.population,
      })) as unknown as TownInfo[],
  );
  const [wardGeoJSON, setWardGeoJSON] = useState<object | null>(null);
  const [loadingMap, setLoadingMap] = useState(true);

  // Fetch ward GeoJSON from public directory (not bundled)
  useEffect(() => {
    fetch("/data/ward.json")
      .then((res) => res.json())
      .then((data: { features: WardFeature[] }) => {
        const okunWards = data.features.filter(
          (f) =>
            f.properties.statename === "Kogi" &&
            OKUN_LGAS.some(
              (lga) => f.properties.lganame.includes(lga) || lga.includes(f.properties.lganame),
            ),
        );
        setWardGeoJSON({ type: "FeatureCollection", features: okunWards });
        setLoadingMap(false);
      })
      .catch((err) => {
        console.error("Failed to load ward GeoJSON:", err);
        setLoadingMap(false);
      });
  }, []);

  const onWardClick = (feature: WardFeature) => {
    setSelectedWard(feature.properties.wardname);
    router.push(`/communities/ward/${feature.properties.wardcode}`);
  };

  if (loadingMap || !wardGeoJSON) {
    return (
      <div className="h-full w-full bg-wiki-card animate-pulse rounded-lg flex items-center justify-center">
        <p className="text-wiki-muted text-sm">Loading map data…</p>
      </div>
    );
  }

  return (
    <LeafletMap
      wardGeoJSON={wardGeoJSON}
      townData={towns}
      lgaColors={lgaColors}
      onWardClick={onWardClick}
      selectedWard={selectedWard}
      onClearSelection={() => setSelectedWard(null)}
    />
  );
}

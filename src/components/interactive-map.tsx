"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import wardData from "@/lib/ward.json";

interface WardFeature {
  type: "Feature";
  properties: {
    FID: number;
    wardname: string;
    lganame: string;
    statename: string;
    statecode: string;
    wardcode: string;
    lgacode: string;
    population?: string;
    urban: string;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

// Create a dynamic map component to avoid SSR issues
const LeafletMap = dynamic(() => import('@/components/leaflet-map'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
});

// Remove unused generic townData here since we fetch it.
// Leaving only structure if it is needed, but it seems we fetch from API.

// Refined, muted tone mapping for LGAs to match elegant aesthetic
const lgaColors: { [key: string]: string } = {
  "Kabba/Bunu": "#2d5948", // Forest 700
  "Yagba West": "#4a8b71", // Forest 500
  "Yagba East": "#e09920", // Gold 500
  "Mopa-Muro": "#9a5715",  // Gold 700
  "Ijumu": "#386f59",      // Forest 600
  "Lokoja": "#c17816"      // Gold 600
};

export default function InteractiveMap() {
  const router = useRouter();
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [towns, setTowns] = useState<import('@/components/leaflet-map').TownInfo[]>([]);

  useEffect(() => {
    fetch("/api/map/towns")
      .then((res) => res.json())
      .then((data) => setTowns(data))
      .catch((err) => console.error("Failed to fetch towns:", err));
  }, []);

  // Filter ward data to only show Okun LGAs
  const okunLGAs = [
    "Kabba/Bunu",
    "Yagba West", 
    "Yagba East",
    "Mopa-Muro",
    "Ijumu",
    "Lokoja"
  ];

  const typedWardData = wardData as { features: WardFeature[] };

  const okunWards = typedWardData.features.filter(
    (feature: WardFeature) => feature.properties.statename === "Kogi" && 
    okunLGAs.some(lga => feature.properties.lganame.includes(lga) || lga.includes(feature.properties.lganame))
  );

  // Create GeoJSON for ward boundaries
  const wardGeoJSON = {
    type: "FeatureCollection",
    features: okunWards
  };

  // Handle ward click
  const onWardClick = (feature: WardFeature) => {
    setSelectedWard(feature.properties.wardname);
    router.push(`/communities/ward/${feature.properties.wardcode}`);
  };

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
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

// Color mapping for LGAs
const lgaColors: { [key: string]: string } = {
  "Kabba/Bunu": "#3b82f6",
  "Yagba West": "#ef4444", 
  "Yagba East": "#10b981",
  "Mopa-Muro": "#f59e0b",
  "Ijumu": "#8b5cf6",
  "Lokoja": "#ec4899"
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
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

// Town data for the Okun region
const townData = [
  { name: "Lokoja", lga: "Lokoja", coordinates: [7.8023, 6.7333], type: "State Capital", population: "195,261" },
  { name: "Kabba", lga: "Kabba/Bunu", coordinates: [7.8267, 7.8267], type: "LGA HQ", population: "45,000" },
  { name: "Egbe", lga: "Yagba West", coordinates: [8.0833, 7.7833], type: "LGA HQ", population: "35,000" },
  { name: "Isanlu", lga: "Yagba East", coordinates: [8.1667, 7.9167], type: "LGA HQ", population: "28,000" },
  { name: "Mopa", lga: "Mopa-Muro", coordinates: [7.4167, 8.0833], type: "LGA HQ", population: "22,000" },
  { name: "Iyara", lga: "Ijumu", coordinates: [7.8500, 7.9500], type: "LGA HQ", population: "30,000" },
  { name: "Bunu", lga: "Kabba/Bunu", coordinates: [7.7500, 7.8000], type: "Town", population: "18,000" },
  { name: "Ayetoro", lga: "Yagba West", coordinates: [8.0000, 7.7500], type: "Town", population: "25,000" },
  { name: "Ejuku", lga: "Yagba East", coordinates: [8.1000, 7.8500], type: "Town", population: "15,000" },
  { name: "Kpata", lga: "Lokoja", coordinates: [7.7500, 6.7000], type: "Town", population: "12,000" },
  { name: "Odo-Ere", lga: "Yagba West", coordinates: [7.9500, 7.8000], type: "Town", population: "20,000" },
  { name: "Okoro", lga: "Ijumu", coordinates: [7.8000, 7.9000], type: "Town", population: "14,000" }
];

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
      townData={townData}
      lgaColors={lgaColors}
      onWardClick={onWardClick}
      selectedWard={selectedWard}
      onClearSelection={() => setSelectedWard(null)}
    />
  );
}
"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface WardFeature {
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

export interface TownInfo {
  name: string;
  lga: string;
  coordinates: number[];
  type: string;
  population: string;
}

interface LeafletMapProps {
  wardGeoJSON: unknown;
  townData: TownInfo[];
  lgaColors: { [key: string]: string };
  onWardClick: (feature: WardFeature) => void;
  selectedWard: string | null;
  onClearSelection: () => void;
}

export default function LeafletMap({ 
  wardGeoJSON, 
  townData, 
  lgaColors, 
  onWardClick, 
  selectedWard, 
  onClearSelection 
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up existing map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      console.log('Leaflet loaded successfully');
      console.log('Ward GeoJSON:', wardGeoJSON);
      console.log('Town data:', townData);
      console.log('Map container ref:', mapRef.current);

      // Fix for default markers in Next.js
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Initialize map only if container is available and not already initialized
      if (mapRef.current && !mapInstanceRef.current) {
        console.log('Initializing map...');
        const map = L.map(mapRef.current).setView([7.8, 7.5], 9);
        mapInstanceRef.current = map;
        console.log('Map initialized:', map);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Style function for ward boundaries
        const wardStyle = (feature: unknown) => {
          const lgaName = (feature as WardFeature).properties.lganame;
          return {
            fillColor: lgaColors[lgaName] || '#6b7280',
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.4
          };
        };

        // Add ward boundaries
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wardLayer = L.geoJSON(wardGeoJSON as any, {
          style: wardStyle,
          onEachFeature: (feature, layer) => {
            const wardFeature = feature as WardFeature;
            layer.bindPopup(`
              <div class="p-2">
                <h3 class="font-semibold text-blue-600">${wardFeature.properties.wardname}</h3>
                <p class="text-sm text-gray-600">LGA: ${wardFeature.properties.lganame}</p>
                <p class="text-sm text-gray-600">State: ${wardFeature.properties.statename}</p>
                <button class="text-xs text-blue-500 underline mt-1" onclick="window.location.href='/communities/ward/${wardFeature.properties.wardcode}'">
                  Explore Community
                </button>
              </div>
            `);
            
            layer.on('click', () => onWardClick(wardFeature));
          }
        }).addTo(map);

        // Create custom icons for different town types
        const createCustomIcon = (type: string) => {
          const color = type === "State Capital" ? '#ef4444' : 
                        type === "LGA HQ" ? '#3b82f6' : '#10b981';
          
          return L.divIcon({
            html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            className: 'custom-marker',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });
        };

        // Add town markers
        townData.forEach((town) => {
          const marker = L.marker([town.coordinates[0], town.coordinates[1]], {
            icon: createCustomIcon(town.type)
          }).addTo(map);

          marker.bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-blue-600">${town.name}</h3>
              <p class="text-sm text-gray-600">LGA: ${town.lga}</p>
              <p class="text-sm text-gray-600">Type: ${town.type}</p>
              <p class="text-sm text-gray-600">Population: ${town.population}</p>
            </div>
          `);
        });

        // Fit map to ward boundaries
        if (wardLayer.getBounds().isValid()) {
          map.fitBounds(wardLayer.getBounds());
        }
      }
    }).catch((err) => {
      console.error('Error loading Leaflet:', err);
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [wardGeoJSON, townData, lgaColors, onWardClick]);

  return (
    <div className="relative w-full h-full bg-gray-50 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 z-[1000]">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Okun LGAs</h3>
        {Object.entries(lgaColors).map(([lga, color]) => (
          <div key={lga} className="flex items-center mb-1">
            <div 
              className="w-4 h-4 rounded mr-2 border border-gray-300"
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-xs text-gray-700">{lga}</span>
          </div>
        ))}
        
        <div className="mt-3 pt-2 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-1">Towns</h4>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white mr-2"></div>
            <span className="text-xs text-gray-600">State Capital</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white mr-2"></div>
            <span className="text-xs text-gray-600">LGA HQ</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white mr-2"></div>
            <span className="text-xs text-gray-600">Town</span>
          </div>
        </div>
      </div>

      {/* Map info */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 z-[1000]">
        <div className="text-xs text-gray-600 mb-2">Map Features</div>
        <div className="text-xs text-gray-500">
          • Interactive ward boundaries<br/>
          • Major towns & cities<br/>
          • Click wards to explore<br/>
          • Zoom and pan enabled
        </div>
      </div>

      {/* Selected ward info */}
      {selectedWard && (
        <div className="absolute bottom-4 left-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg z-[1000]">
          <div className="text-sm font-medium">Selected: {selectedWard}</div>
          <button 
            onClick={onClearSelection}
            className="text-xs underline mt-1"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}
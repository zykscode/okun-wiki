"use client";

import { useEffect, useRef } from 'react';

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
  slug: string;
  tagline: string | null;
  lga: string;
  coordinates: number[];
  population: number | null;
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

        // Create custom icons for town markers
        const createCustomIcon = () => {
          const color = '#10b981'; // Default green for all database towns
          
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
            icon: createCustomIcon()
          }).addTo(map);

          marker.bindPopup(`
            <div class="p-3 font-sans">
              <h3 class="font-display font-medium text-lg text-wiki-text tracking-tight mb-1">${town.name}</h3>
              ${town.tagline ? `<p class="text-xs italic text-wiki-muted mb-2">${town.tagline}</p>` : ""}
              <div class="border-t border-wiki-border pt-2 mt-2">
                <p class="text-xs text-wiki-secondary mb-1"><span class="font-medium">LGA:</span> ${town.lga}</p>
                ${town.population ? `<p class="text-xs text-wiki-secondary mb-2"><span class="font-medium">Pop.</span>: ${town.population.toLocaleString()}</p>` : ""}
              </div>
              <a href="/towns/${town.slug}" class="text-xs font-medium text-forest-600 hover:text-forest-400 mt-2 inline-flex items-center gap-1 group">
                View History
                <span class="transition-transform group-hover:translate-x-1">→</span>
              </a>
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
      <div className="absolute top-4 left-4 bg-wiki-card-strong border border-wiki-border rounded-xl shadow-lg p-3 z-[1000] backdrop-blur-md">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-wiki-text mb-3 border-b border-wiki-border pb-2">Okun LGAs</h3>
        {Object.entries(lgaColors).map(([lga, color]) => (
          <div key={lga} className="flex items-center mb-1.5">
            <div 
              className="w-3.5 h-3.5 rounded-sm mr-2.5 opacity-80"
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-xs font-medium text-wiki-secondary">{lga}</span>
          </div>
        ))}
        
        <div className="mt-3 pt-3 border-t border-wiki-border">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-forest-500 mr-2.5 outline outline-2 outline-white dark:outline-wiki-bg outline-offset-[-1px]"></div>
            <span className="text-xs font-medium text-wiki-secondary">Registered Town</span>
          </div>
        </div>
      </div>

      {/* Map info */}
      <div className="absolute bottom-4 right-4 bg-wiki-card border border-wiki-border rounded-lg shadow-sm p-3 z-[1000] backdrop-blur-sm max-w-[200px]">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-wiki-muted mb-1.5">Features</div>
        <div className="text-[11px] text-wiki-secondary leading-relaxed">
          • Interactive boundaries<br/>
          • Historical towns<br/>
          • Click maps to explore
        </div>
      </div>

      {/* Selected ward info */}
      {selectedWard && (
        <div className="absolute bottom-4 left-4 bg-forest-600/95 text-white p-4 rounded-xl shadow-xl z-[1000] backdrop-blur-md border border-forest-500/30">
          <div className="text-xs uppercase tracking-wider text-forest-200/80 mb-1 font-medium">Selected Ward</div>
          <div className="text-base font-display font-medium mb-1">{selectedWard}</div>
          <button 
            onClick={onClearSelection}
            className="text-xs text-forest-200 hover:text-white transition-colors"
          >
            Clear selection ✕
          </button>
        </div>
      )}
    </div>
  );
}
import { MapPin, Calendar, Users, Globe } from "lucide-react";

interface TownInfoboxProps {
  town: {
    name: string;
    state: string;
    lga: string;
    population: number | null;
    founded: string | null;
    coordinates: string | null;
  };
}

export function TownInfobox({ town }: TownInfoboxProps) {
  return (
    <div className="infobox">
      <div className="infobox-header">{town.name}</div>
      <div>
        {[
          { icon: MapPin, label: "State", value: town.state },
          { icon: MapPin, label: "LGA", value: town.lga },
          town.population
            ? { icon: Users, label: "Population", value: town.population.toLocaleString() }
            : null,
          town.founded ? { icon: Calendar, label: "Founded", value: town.founded } : null,
          town.coordinates ? { icon: Globe, label: "Coordinates", value: town.coordinates } : null,
        ]
          .filter(Boolean)
          .map((row) => (
            <div key={row!.label} className="infobox-row">
              <div className="infobox-label">
                <div className="flex items-center gap-1">
                  {row && <row.icon className="h-3 w-3" />} {row!.label}
                </div>
              </div>
              <div className="infobox-value">{row!.value}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

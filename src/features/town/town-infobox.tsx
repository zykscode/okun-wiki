import { MapPin, Calendar, Users, Globe, Building } from "lucide-react";

interface TownInfoboxProps {
  town: {
    name: string;
    state: string;
    lga: string;
    population: number | null;
    founded: string | null;
    coordinates: string | null;
    images?: { url: string; caption: string | null }[];
    tagline?: string | null;
  };
}

export function TownInfobox({ town }: TownInfoboxProps) {
  const primaryImage = town.images?.[0];

  const rows = [
    { icon: Building, label: "State", value: town.state },
    { icon: MapPin, label: "LGA", value: `${town.lga} LGA` },
    town.population
      ? { icon: Users, label: "Population", value: town.population.toLocaleString() }
      : null,
    town.founded ? { icon: Calendar, label: "Founded", value: town.founded } : null,
    town.coordinates ? { icon: Globe, label: "Coordinates", value: town.coordinates } : null,
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  return (
    <aside
      aria-label={`Information about ${town.name}`}
      className="rounded-2xl border border-wiki-border overflow-hidden theme-transition shadow-sm"
      style={{ background: "var(--color-wiki-card)", backdropFilter: "blur(12px)" }}
    >
      {/* Cover image */}
      {primaryImage ? (
        <div className="w-full h-40 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage.url}
            alt={primaryImage.caption || town.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-32 bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center">
          <span className="text-5xl font-display font-bold text-white/30 select-none">
            {town.name.charAt(0)}
          </span>
        </div>
      )}

      {/* Town name header */}
      <div className="px-4 pt-4 pb-2 border-b border-wiki-border">
        <h2 className="text-lg font-display font-bold text-wiki-text">{town.name}</h2>
        {town.tagline && <p className="text-sm text-wiki-muted italic mt-0.5">{town.tagline}</p>}
      </div>

      {/* Data rows */}
      <dl className="divide-y divide-wiki-border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-3 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs font-semibold text-wiki-muted uppercase tracking-wide min-w-[80px] pt-0.5">
              <row.icon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              {row.label}
            </dt>
            <dd className="text-sm text-wiki-text font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

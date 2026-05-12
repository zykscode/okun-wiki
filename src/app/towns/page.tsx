import Link from "next/link";
import { towns } from "@/data/towns";
import { TownCard } from "@/features/town/town-card";
import { Search, MapPin } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Towns",
  description: "Browse all documented Okun towns in Kogi State, Nigeria.",
};

interface TownsPageProps {
  searchParams: Promise<{ q?: string; lga?: string }>;
}

export default async function TownsPage({ searchParams }: TownsPageProps) {
  const params = await searchParams;
  const query = params.q?.toLowerCase();

  let filteredTowns = query
    ? towns.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.lga.toLowerCase().includes(query) ||
          t.overview.toLowerCase().includes(query),
      )
    : towns;

  // Get unique LGAs for filter from all towns
  const lgas = [...new Set(towns.map((t) => t.lga))].sort();

  if (params.lga) {
    filteredTowns = filteredTowns.filter((t) => t.lga === params.lga);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-wiki-text">Okun Towns</h1>
        <p className="text-wiki-muted mt-2">
          Browse and explore the towns of Okun land in Kogi State
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form className="flex-1 relative" action="/towns">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-wiki-muted" />
          <input
            name="q"
            type="text"
            placeholder="Search towns..."
            defaultValue={query}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-wiki-border bg-wiki-input text-sm text-wiki-text focus:outline-none focus:ring-2 focus:ring-primary-500 theme-transition"
          />
        </form>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/towns"
            className={`px-3 py-2 rounded-lg text-sm no-underline transition-colors ${
              !params.lga
                ? "bg-primary-500 text-white"
                : "bg-wiki-card border border-wiki-border text-wiki-muted hover:bg-wiki-hover"
            }`}
          >
            All
          </Link>
          {lgas.map((lga) => (
            <Link
              key={lga}
              href={`/towns?lga=${encodeURIComponent(lga)}`}
              className={`px-3 py-2 rounded-lg text-sm no-underline transition-colors ${
                params.lga === lga
                  ? "bg-primary-500 text-white"
                  : "bg-wiki-card border border-wiki-border text-wiki-muted hover:bg-wiki-hover"
              }`}
            >
              {lga}
            </Link>
          ))}
        </div>
      </div>

      {/* Town Grid */}
      {filteredTowns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTowns.map((town) => (
            <TownCard key={town.id} town={town} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <MapPin className="h-12 w-12 text-wiki-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-wiki-text">No towns found</h3>
          <p className="text-wiki-muted mt-1">
            {query
              ? `No results for "${query}". Try a different search.`
              : "No towns have been published yet."}
          </p>
        </div>
      )}
    </div>
  );
}

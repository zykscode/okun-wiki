import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTownBySlug } from "@/lib/actions/town";
import { TownInfobox } from "@/components/town/town-infobox";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Music, Users } from "lucide-react";

interface TownPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TownPageProps): Promise<Metadata> {
  const { slug } = await params;
  const town = await getTownBySlug(slug);
  if (!town) return { title: "Town not found" };
  return {
    title: town.name,
    description: town.metaDescription || town.overview.substring(0, 160),
  };
}

export default async function TownDetailPage({ params }: TownPageProps) {
  const { slug } = await params;
  const town = await getTownBySlug(slug);

  if (!town) notFound();

  const pages = town.pages.map((p) => ({
    slug: p.slug,
    title: p.title,
    type: p.type,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <Sidebar townSlug={town.slug} pages={pages} />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-bold text-wiki-text">{town.name}</h1>
              {town.featured && <Badge variant="primary">Featured</Badge>}
            </div>
            {town.tagline && (
              <p className="text-lg text-wiki-muted mt-2">{town.tagline}</p>
            )}
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
            {/* Content */}
            <div className="flex-1 wiki-content">
              <h2>Overview</h2>
              {town.overview.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}

              {/* Festivals */}
              {town.festivals.length > 0 && (
                <>
                  <h2>
                    <Music className="inline h-5 w-5 mr-2" />
                    Festivals & Celebrations
                  </h2>
                  <div className="space-y-4">
                    {town.festivals.map((festival) => (
                      <div
                        key={festival.id}
                        className="border border-wiki-border rounded-lg p-4 bg-white"
                      >
                        <h3 className="text-lg font-semibold">{festival.name}</h3>
                        <Badge variant="earth" className="mt-1">{festival.period}</Badge>
                        <p className="mt-2 text-sm">{festival.description}</p>
                        <p className="mt-1 text-sm text-wiki-muted">
                          <strong>Significance:</strong> {festival.significance}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Prominent People */}
              {town.people.length > 0 && (
                <>
                  <h2>
                    <Users className="inline h-5 w-5 mr-2" />
                    Notable People
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {town.people.map((person) => (
                      <div
                        key={person.id}
                        className="border border-wiki-border rounded-lg p-4 bg-white"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {person.title && (
                            <Badge variant="primary">{person.title}</Badge>
                          )}
                          <Badge variant="outline">{person.role}</Badge>
                        </div>
                        <h3 className="font-semibold">{person.name}</h3>
                        <p className="text-sm text-wiki-muted mt-1">
                          {person.biography.substring(0, 200)}
                          {person.biography.length > 200 ? "..." : ""}
                        </p>
                        {person.birthYear && (
                          <p className="text-xs text-wiki-muted mt-2">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            Born {person.birthYear}
                            {person.deathYear ? ` — Died ${person.deathYear}` : ""}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Infobox */}
            <div className="w-full xl:w-72 shrink-0 order-first xl:order-last">
              <TownInfobox town={town} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

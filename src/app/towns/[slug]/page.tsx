import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTownBySlug } from "@/lib/actions/town";
import { TownInfobox } from "@/components/town/town-infobox";
import { Sidebar } from "@/components/layout/sidebar";
import { CommentSection } from "@/components/town/comment-section";
import { Badge } from "@/components/ui/badge";
import { Calendar, Music, Users, Activity, HeartPulse, Building, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TownPageProps {
  params: Promise<{ slug: string }>;
}

// ISR: regenerate this page every 10 minutes on Vercel
export const revalidate = 600;


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
              <div dangerouslySetInnerHTML={{ __html: town.overview }} />

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
                        {festival.images.length > 0 && (
                          <div className="flex gap-2 overflow-x-auto pb-2 mt-3 no-scrollbar">
                            {festival.images.map((img: any) => (
                              <div key={img.id} className="w-40 h-28 shrink-0 rounded-lg overflow-hidden border border-wiki-border">
                                <img src={img.url} alt={img.caption || festival.name} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="mt-2 text-sm text-wiki-muted">
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

              {/* Bento Box UI for Encyclopedia Data */}
              {(town.amenities.length > 0 || town.needs.length > 0 || town.families.length > 0 || town.neighbors.length > 0) && (
                <div className="mt-12">
                  <h2 className="mb-6">
                    <Activity className="inline h-5 w-5 mr-2" />
                    Town Data & Insights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Amenities */}
                    {town.amenities.length > 0 && (
                      <div className="border border-wiki-border rounded-2xl p-5 bg-white shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <Building className="h-5 w-5 text-blue-500" />
                          <h3 className="font-semibold text-lg m-0">Social Amenities</h3>
                        </div>
                        <ul className="space-y-3">
                          {town.amenities.map(amenity => (
                            <li key={amenity.id} className="flex justify-between items-start border-b border-gray-100 pb-2 last:border-0">
                              <div>
                                <span className="font-medium text-sm block">{amenity.name}</span>
                                <span className="text-xs text-wiki-muted">{amenity.type}</span>
                              </div>
                              <Badge variant={amenity.status === "Available" || amenity.status === "Functional" ? "earth" : "outline"} className="text-[10px]">
                                {amenity.status}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Needs */}
                    {town.needs.length > 0 && (
                      <div className="border border-wiki-border rounded-2xl p-5 bg-white shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <HeartPulse className="h-5 w-5 text-red-500" />
                          <h3 className="font-semibold text-lg m-0">Community Needs</h3>
                        </div>
                        <ul className="space-y-3">
                          {town.needs.map(need => (
                            <li key={need.id} className="border-b border-gray-100 pb-2 last:border-0">
                              <div className="flex justify-between items-center mb-1">
                                <Badge variant="destructive" className="text-[10px]">{need.urgency}</Badge>
                                <span className="text-xs text-wiki-muted font-medium">{need.category}</span>
                              </div>
                              <p className="text-sm">{need.description}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Families */}
                    {town.families.length > 0 && (
                      <div className="border border-wiki-border rounded-2xl p-5 bg-white shadow-sm md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                          <Users className="h-5 w-5 text-purple-500" />
                          <h3 className="font-semibold text-lg m-0">Prominent Families & Lineage</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {town.families.map(family => (
                            <div key={family.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                              <h4 className="font-semibold">{family.name}</h4>
                              <p className="text-xs text-wiki-muted mt-1 mb-2 line-clamp-3">{family.history}</p>
                              {family.headOfFamily && (
                                <p className="text-xs font-medium">Head: <span className="text-wiki-text">{family.headOfFamily}</span></p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Neighbors */}
                    {town.neighbors.length > 0 && (
                      <div className="border border-wiki-border rounded-2xl p-5 bg-white shadow-sm md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="h-5 w-5 text-emerald-500" />
                          <h3 className="font-semibold text-lg m-0">Neighboring Towns</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {town.neighbors.map(n => (
                            <Link key={n.id} href={`/towns/${n.neighbor.slug}`}>
                              <Badge variant="outline" className="px-3 py-1.5 hover:bg-gray-50 cursor-pointer flex items-center gap-1 transition-colors">
                                {n.neighbor.name}
                                {n.distanceKm && <span className="text-wiki-muted ml-1 text-xs">({n.distanceKm}km {n.direction})</span>}
                                <ArrowRight className="h-3 w-3 ml-1 text-wiki-muted" />
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>

            {/* Infobox */}
            <div className="w-full xl:w-72 shrink-0 order-first xl:order-last">
              <TownInfobox town={town} />
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="mt-12">
            <CommentSection townId={town.id} initialComments={town.comments as any} />
          </div>
        </div>
      </div>
    </div>
  );
}

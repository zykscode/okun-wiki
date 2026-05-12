import { notFound } from "next/navigation";
import { Metadata } from "next";
import { towns } from "@/data/towns";
import { TownInfobox } from "@/features/town/town-infobox";
import { CommentSection } from "@/features/town/comment-section";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Music,
  Users,
  Activity,
  HeartPulse,
  Building,
  MapPin,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TownPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return towns.map((town) => ({ slug: town.slug }));
}

export async function generateMetadata({ params }: TownPageProps): Promise<Metadata> {
  const { slug } = await params;
  const town = towns.find((t) => t.slug === slug);
  if (!town) return { title: "Town not found" };
  return {
    title: town.name,
    description: town.metaDescription || town.overview.substring(0, 155),
    openGraph: {
      title: `${town.name} — Okunpedia`,
      description: town.metaDescription || town.overview.substring(0, 155),
      type: "article",
      images: town.images[0] ? [{ url: town.images[0].url }] : [],
    },
  };
}

export default async function TownDetailPage({ params }: TownPageProps) {
  const { slug } = await params;
  const town = towns.find((t) => t.slug === slug);

  if (!town) notFound();

  const pages = town.pages.map((p) => ({
    slug: p.slug,
    title: p.title,
    type: p.type,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-wiki-muted mb-6">
        <Link href="/" className="hover:text-wiki-text no-underline transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <Link href="/towns" className="hover:text-wiki-text no-underline transition-colors">
          Towns
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span className="text-wiki-text font-medium" aria-current="page">
          {town.name}
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <Sidebar townSlug={town.slug} pages={pages} />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Town header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-wiki-text">
                {town.name}
              </h1>
              {town.featured && (
                <Badge variant="primary" className="rounded-full">
                  Featured
                </Badge>
              )}
            </div>
            {town.tagline && <p className="text-lg text-wiki-muted mt-2 italic">{town.tagline}</p>}
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
            {/* Main text content */}
            <div className="flex-1 min-w-0">
              {/* Overview — rendered with ReactMarkdown for proper paragraph handling */}
              <div className="wiki-content bg-wiki-card border border-wiki-border rounded-2xl p-6 sm:p-8 theme-transition mb-8">
                <h2 className="text-2xl font-display font-bold text-wiki-text mb-4">Overview</h2>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {town.overview.replace(/\n\n/g, "\n\n")}
                </ReactMarkdown>
              </div>

              {/* Festivals */}
              {town.festivals.length > 0 && (
                <section aria-labelledby="festivals-heading" className="mb-8">
                  <h2
                    id="festivals-heading"
                    className="text-2xl font-display font-bold text-wiki-text mb-4 flex items-center gap-2"
                  >
                    <Music className="h-5 w-5 text-gold-500" aria-hidden="true" />
                    Festivals &amp; Celebrations
                  </h2>
                  <div className="space-y-4">
                    {town.festivals.map((festival) => (
                      <div key={festival.id} className="glass-card p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-lg font-semibold text-wiki-text">{festival.name}</h3>
                          <Badge variant="earth" className="flex-shrink-0 rounded-full text-xs">
                            {festival.period}
                          </Badge>
                        </div>
                        <p className="text-sm text-wiki-secondary leading-relaxed mb-3">
                          {festival.description}
                        </p>
                        {festival.images.length > 0 && (
                          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {festival.images.map(
                              (img: { id: string; url: string; caption: string | null }) => (
                                <div
                                  key={img.id}
                                  className="w-40 h-28 shrink-0 rounded-xl overflow-hidden border border-wiki-border"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={img.url}
                                    alt={img.caption || festival.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ),
                            )}
                          </div>
                        )}
                        <p className="text-xs text-wiki-muted mt-3 border-t border-wiki-border pt-3">
                          <strong>Significance:</strong> {festival.significance}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Notable People */}
              {town.people.length > 0 && (
                <section aria-labelledby="people-heading" className="mb-8">
                  <h2
                    id="people-heading"
                    className="text-2xl font-display font-bold text-wiki-text mb-4 flex items-center gap-2"
                  >
                    <Users className="h-5 w-5 text-forest-500" aria-hidden="true" />
                    Notable People
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {town.people.map((person) => (
                      <div key={person.id} className="glass-card p-5">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {person.title && (
                            <Badge variant="primary" className="rounded-full text-xs">
                              {person.title}
                            </Badge>
                          )}
                          <Badge variant="outline" className="rounded-full text-xs">
                            {person.role}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-wiki-text mb-1">{person.name}</h3>
                        <p className="text-sm text-wiki-secondary leading-relaxed">
                          {person.biography.substring(0, 200)}
                          {person.biography.length > 200 ? "…" : ""}
                        </p>
                        {person.birthYear && (
                          <p className="text-xs text-wiki-muted mt-2 flex items-center gap-1">
                            <Calendar className="h-3 w-3" aria-hidden="true" />
                            Born {person.birthYear}
                            {person.deathYear ? ` — Died ${person.deathYear}` : ""}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Bento Box — Amenities, Needs, Families, Neighbors */}
              {(town.amenities.length > 0 ||
                town.needs.length > 0 ||
                town.families.length > 0 ||
                town.neighbors.length > 0) && (
                <section aria-labelledby="town-data-heading" className="mb-8">
                  <h2
                    id="town-data-heading"
                    className="text-2xl font-display font-bold text-wiki-text mb-4 flex items-center gap-2"
                  >
                    <Activity className="h-5 w-5 text-blue-500" aria-hidden="true" />
                    Town Data &amp; Insights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Amenities */}
                    {town.amenities.length > 0 && (
                      <div className="glass-card p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Building className="h-5 w-5 text-blue-500" aria-hidden="true" />
                          <h3 className="font-semibold text-wiki-text">Social Amenities</h3>
                        </div>
                        <ul className="space-y-3" role="list">
                          {town.amenities.map((amenity) => (
                            <li
                              key={amenity.id}
                              className="flex justify-between items-start border-b border-wiki-border pb-2 last:border-0"
                            >
                              <div>
                                <span className="font-medium text-sm text-wiki-text block">
                                  {amenity.name}
                                </span>
                                <span className="text-xs text-wiki-muted">{amenity.type}</span>
                              </div>
                              <Badge
                                variant={
                                  amenity.status === "Available" || amenity.status === "Functional"
                                    ? "earth"
                                    : "outline"
                                }
                                className="text-[10px] rounded-full flex-shrink-0"
                              >
                                {amenity.status}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Needs */}
                    {town.needs.length > 0 && (
                      <div className="glass-card p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <HeartPulse className="h-5 w-5 text-red-500" aria-hidden="true" />
                          <h3 className="font-semibold text-wiki-text">Community Needs</h3>
                        </div>
                        <ul className="space-y-3" role="list">
                          {town.needs.map((need) => (
                            <li
                              key={need.id}
                              className="border-b border-wiki-border pb-2 last:border-0"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                  {need.urgency}
                                </span>
                                <span className="text-xs text-wiki-muted">{need.category}</span>
                              </div>
                              <p className="text-sm text-wiki-secondary">{need.description}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Families */}
                    {town.families.length > 0 && (
                      <div className="glass-card p-5 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                          <Users className="h-5 w-5 text-purple-500" aria-hidden="true" />
                          <h3 className="font-semibold text-wiki-text">
                            Prominent Families &amp; Lineage
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {town.families.map((family) => (
                            <div
                              key={family.id}
                              className="bg-wiki-hover rounded-xl p-4 border border-wiki-border"
                            >
                              <h4 className="font-semibold text-wiki-text mb-1">{family.name}</h4>
                              <p className="text-xs text-wiki-muted line-clamp-3 mb-2">
                                {family.history}
                              </p>
                              {family.headOfFamily && (
                                <p className="text-xs font-medium text-wiki-text">
                                  Head:{" "}
                                  <span className="text-wiki-secondary">{family.headOfFamily}</span>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Neighbors */}
                    {town.neighbors.length > 0 && (
                      <div className="glass-card p-5 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                          <h3 className="font-semibold text-wiki-text">Neighboring Towns</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {town.neighbors.map((n) => (
                            <Link key={n.id} href={`/towns/${n.neighbor.slug}`}>
                              <Badge
                                variant="outline"
                                className="px-3 py-1.5 hover:bg-wiki-hover cursor-pointer flex items-center gap-1 transition-colors rounded-full"
                              >
                                {n.neighbor.name}
                                {n.distanceKm && (
                                  <span className="text-wiki-muted ml-1 text-[10px]">
                                    ({n.distanceKm}km {n.direction})
                                  </span>
                                )}
                                <ArrowRight
                                  className="h-3 w-3 ml-1 text-wiki-muted"
                                  aria-hidden="true"
                                />
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Community Comments */}
              <CommentSection townId={town.id} />
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

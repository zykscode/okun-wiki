import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTownBySlug, getTownPage } from "@/lib/actions/town";
import { Sidebar } from "@/components/layout/sidebar";

interface TownSubPageProps {
  params: Promise<{ slug: string; pageSlug: string }>;
}

export async function generateMetadata({ params }: TownSubPageProps): Promise<Metadata> {
  const { slug, pageSlug } = await params;
  const result = await getTownPage(slug, pageSlug);
  if (!result) return { title: "Page not found" };
  return {
    title: `${result.page.title} — ${result.town.name}`,
  };
}

export default async function TownSubPage({ params }: TownSubPageProps) {
  const { slug, pageSlug } = await params;

  const [town, pageResult] = await Promise.all([
    getTownBySlug(slug),
    getTownPage(slug, pageSlug),
  ]);

  if (!town || !pageResult) notFound();

  const pages = town.pages.map((p) => ({
    slug: p.slug,
    title: p.title,
    type: p.type,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar townSlug={slug} currentPage={pageSlug} pages={pages} />

        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <p className="text-sm text-wiki-muted mb-1">
              <a href={`/towns/${slug}`} className="hover:underline">{town.name}</a>
            </p>
            <h1 className="text-3xl font-bold text-wiki-text">
              {pageResult.page.title}
            </h1>
          </div>

          <div className="wiki-content bg-white rounded-lg border border-wiki-border p-6 sm:p-8">
            {pageResult.page.content.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

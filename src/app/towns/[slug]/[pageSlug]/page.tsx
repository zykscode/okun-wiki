import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { towns } from "@/data/towns";
import { Sidebar } from "@/components/layout/sidebar";

interface TownSubPageProps {
  params: Promise<{ slug: string; pageSlug: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string; pageSlug: string }[] = [];
  towns.forEach((town) => {
    town.pages.forEach((page) => {
      params.push({ slug: town.slug, pageSlug: page.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }: TownSubPageProps): Promise<Metadata> {
  const { slug, pageSlug } = await params;
  const town = towns.find((t) => t.slug === slug);
  const page = town?.pages.find((p) => p.slug === pageSlug);

  if (!town || !page) return { title: "Page not found" };
  return {
    title: `${page.title} — ${town.name}`,
  };
}

export default async function TownSubPage({ params }: TownSubPageProps) {
  const { slug, pageSlug } = await params;
  const town = towns.find((t) => t.slug === slug);
  const page = town?.pages.find((p) => p.slug === pageSlug);

  if (!town || !page) notFound();

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
              <a href={`/towns/${slug}`} className="hover:underline">
                {town.name}
              </a>
            </p>
            <h1 className="text-3xl font-bold text-wiki-text">{page.title}</h1>
          </div>

          <div className="wiki-content bg-white dark:bg-wiki-card border border-wiki-border rounded-xl p-6 sm:p-8 theme-transition prose prose-wiki dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

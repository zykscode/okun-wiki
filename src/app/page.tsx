import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFeaturedTowns, getTownStats } from "@/lib/actions/town";
import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { CTASection } from "@/components/home/cta-section";

export default async function HomePage() {
  const [featuredTowns, stats] = await Promise.all([
    getFeaturedTowns(),
    getTownStats(),
  ]);

  return (
    <div>
      <HeroSection />
      <StatsBar stats={stats} />

      {/* Featured Towns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-wiki-text">Featured Towns</h2>
            <p className="text-wiki-muted mt-1">Explore the heart of Ọ̀kun land</p>
          </div>
          <Link href="/towns">
            <Button variant="outline" size="sm">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {featuredTowns.length > 0 ? (
          <FeaturedGrid towns={featuredTowns} />
        ) : (
          <div className="text-center py-12 bg-wiki-card rounded-lg border border-wiki-border theme-transition">
            <BookOpen className="h-12 w-12 text-wiki-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-wiki-text">Coming soon</h3>
            <p className="text-wiki-muted mt-1">
              Featured towns will appear here as the wiki grows.
            </p>
          </div>
        )}
      </section>

      <CTASection />
    </div>
  );
}

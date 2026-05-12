"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search as SearchIcon, MapPin, PenSquare, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { towns as allTowns } from "@/data/towns";

interface PostResult {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
}

interface TownResult {
  name: string;
  slug: string;
  tagline: string | null;
  lga: string;
}

interface SearchResults {
  towns: TownResult[];
  posts: PostResult[];
}

function toTitleCase(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

// Pre-build search index from static towns data
const townIndex: TownResult[] = allTowns.map((t) => ({
  name: t.name,
  slug: t.slug,
  tagline: t.tagline,
  lga: t.lga,
}));

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ towns: [], posts: [] });
  const [postIndex, setPostIndex] = useState<PostResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [indexLoaded, setIndexLoaded] = useState(false);

  // Load blog posts into memory on mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch("/search.json").catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          setPostIndex(data);
        }
      } catch {
        // fail silently — blog search will just not work
      }
      setIndexLoaded(true);
    };
    loadPosts();
  }, []);

  const search = useCallback(
    (q: string) => {
      if (q.length < 2) {
        setResults({ towns: [], posts: [] });
        return;
      }
      setLoading(true);
      const normalized = q.toLowerCase();

      const matchedTowns = townIndex.filter(
        (t) =>
          t.name.toLowerCase().includes(normalized) ||
          t.lga.toLowerCase().includes(normalized) ||
          (t.tagline && t.tagline.toLowerCase().includes(normalized)),
      );

      const matchedPosts = postIndex.filter(
        (p) =>
          p.title.toLowerCase().includes(normalized) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(normalized)) ||
          p.category.toLowerCase().includes(normalized),
      );

      setResults({ towns: matchedTowns, posts: matchedPosts });
      setLoading(false);
    },
    [postIndex],
  );

  useEffect(() => {
    if (!indexLoaded) return;
    const timeout = setTimeout(() => search(query), 200);
    return () => clearTimeout(timeout);
  }, [query, search, indexLoaded]);

  const hasResults = results.towns.length > 0 || results.posts.length > 0;
  const showNoResults = query.length >= 2 && !loading && indexLoaded && !hasResults;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-wiki-text mb-2">Search Okunpedia</h1>
          <p className="text-wiki-muted">
            Find towns, articles, history, and culture from Okun land.
          </p>
        </div>

        {/* Search input */}
        <div className="relative mb-8">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-wiki-muted pointer-events-none"
            aria-hidden="true"
          />
          <label htmlFor="search-input" className="sr-only">
            Search Okunpedia
          </label>
          <input
            id="search-input"
            type="search"
            placeholder="Search towns, articles, culture..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 text-lg rounded-2xl border border-wiki-border bg-wiki-card text-wiki-text placeholder:text-wiki-muted focus:outline-none focus:ring-2 focus:ring-forest-500 theme-transition shadow-sm"
            autoFocus
            autoComplete="off"
            aria-label="Search"
          />
          {loading && (
            <Loader2
              className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-wiki-muted animate-spin"
              aria-hidden="true"
            />
          )}
          {query && !loading && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-wiki-muted hover:text-wiki-text transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick links */}
        {!query && (
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-wiki-muted mb-3">
              Browse
            </p>
            <div className="flex flex-wrap gap-2">
              {["Kabba", "Isanlu", "Mopa", "Egbe", "Culture", "History"].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-full text-sm bg-wiki-card border border-wiki-border text-wiki-muted hover:bg-wiki-hover hover:text-wiki-text transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {hasResults && (
            <motion.div
              key={query}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
              role="region"
              aria-live="polite"
              aria-label="Search results"
            >
              {results.towns.length > 0 && (
                <section>
                  <h2 className="text-xs font-semibold text-wiki-muted uppercase tracking-wider mb-3">
                    Towns ({results.towns.length})
                  </h2>
                  <div className="space-y-2">
                    {results.towns.map((town) => (
                      <Link
                        key={town.slug}
                        href={`/towns/${town.slug}`}
                        className="no-underline block"
                      >
                        <div className="p-4 rounded-xl border border-wiki-border bg-wiki-card hover:bg-wiki-hover hover:border-forest-500/30 transition-all theme-transition">
                          <div className="flex items-center gap-2">
                            <MapPin
                              className="h-4 w-4 text-forest-500 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="font-semibold text-wiki-text">{town.name}</span>
                            <Badge variant="outline" className="text-xs rounded-full">
                              {town.lga}
                            </Badge>
                          </div>
                          {town.tagline && (
                            <p className="text-sm text-wiki-muted mt-1 ml-6 italic">
                              {town.tagline}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {results.posts.length > 0 && (
                <section>
                  <h2 className="text-xs font-semibold text-wiki-muted uppercase tracking-wider mb-3">
                    Articles ({results.posts.length})
                  </h2>
                  <div className="space-y-2">
                    {results.posts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="no-underline block"
                      >
                        <div className="p-4 rounded-xl border border-wiki-border bg-wiki-card hover:bg-wiki-hover hover:border-forest-500/30 transition-all theme-transition">
                          <div className="flex items-center gap-2">
                            <PenSquare
                              className="h-4 w-4 text-forest-500 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="font-semibold text-wiki-text">{post.title}</span>
                            <Badge variant="primary" className="text-xs rounded-full">
                              {toTitleCase(post.category)}
                            </Badge>
                          </div>
                          {post.excerpt && (
                            <p className="text-sm text-wiki-muted mt-1 ml-6 line-clamp-1">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {showNoResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
              role="status"
              aria-live="polite"
            >
              <SearchIcon className="h-10 w-10 text-wiki-muted mx-auto mb-3" aria-hidden="true" />
              <p className="text-wiki-text font-medium mb-1">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="text-sm text-wiki-muted">
                Try a different search term or{" "}
                <Link href="/towns" className="text-forest-600 dark:text-forest-400">
                  browse all towns
                </Link>
                .
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search as SearchIcon, MapPin, PenSquare, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface SearchResults {
  towns: { name: string; slug: string; tagline: string | null; lga: string }[];
  posts: { title: string; slug: string; excerpt: string | null; category: string }[];
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ towns: [], posts: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ towns: [], posts: [] });
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch { /* ignore */ }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const hasResults = results.towns.length > 0 || results.posts.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-wiki-text mb-6 text-center">Search Okunpedia</h1>

        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-wiki-muted" />
          <input
            type="text"
            placeholder="Search towns, articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border border-wiki-border bg-wiki-card text-wiki-text placeholder:text-wiki-muted focus:outline-none focus:ring-2 focus:ring-primary-500 theme-transition"
            autoFocus
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-wiki-muted animate-spin" />
          )}
        </div>

        <AnimatePresence mode="wait">
          {query.length >= 2 && !loading && (
            <motion.div
              key={query}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {hasResults ? (
                <div className="space-y-6">
                  {results.towns.length > 0 && (
                    <div>
                      <h2 className="text-sm font-semibold text-wiki-muted uppercase tracking-wider mb-3">Towns</h2>
                      <div className="space-y-2">
                        {results.towns.map((town) => (
                          <Link key={town.slug} href={`/towns/${town.slug}`} className="no-underline block">
                            <div className="p-4 rounded-lg border border-wiki-border bg-wiki-card hover:bg-wiki-hover transition-colors theme-transition">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary-500" />
                                <span className="font-medium text-wiki-text">{town.name}</span>
                                <Badge variant="outline">{town.lga}</Badge>
                              </div>
                              {town.tagline && <p className="text-sm text-wiki-muted mt-1">{town.tagline}</p>}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.posts.length > 0 && (
                    <div>
                      <h2 className="text-sm font-semibold text-wiki-muted uppercase tracking-wider mb-3">Blog Posts</h2>
                      <div className="space-y-2">
                        {results.posts.map((post) => (
                          <Link key={post.slug} href={`/blog/${post.slug}`} className="no-underline block">
                            <div className="p-4 rounded-lg border border-wiki-border bg-wiki-card hover:bg-wiki-hover transition-colors theme-transition">
                              <div className="flex items-center gap-2">
                                <PenSquare className="h-4 w-4 text-primary-500" />
                                <span className="font-medium text-wiki-text">{post.title}</span>
                                <Badge variant="primary">{post.category.charAt(0) + post.category.slice(1).toLowerCase()}</Badge>
                              </div>
                              {post.excerpt && <p className="text-sm text-wiki-muted mt-1 line-clamp-1">{post.excerpt}</p>}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-wiki-muted">No results found for &ldquo;{query}&rdquo;</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Map, MapPin, FileText, Users, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Real preview cards showing actual platform features
function HeroPreviewCard() {
  return (
    <div className="w-full max-w-sm glass-card relative overflow-hidden p-5 flex flex-col gap-4" style={{ transform: "rotateY(-4deg) rotateX(4deg)" }}>
      {/* Mini header bar */}
      <div className="flex items-center gap-2 pb-3 border-b border-wiki-border">
        <div className="h-2 w-2 rounded-full bg-green-400" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-wiki-muted">Okunpedia Live</span>
      </div>

      {/* Featured town card */}
      <div className="rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 p-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,white,transparent)]" />
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-200 mb-1">Featured Town</p>
            <h3 className="text-lg font-bold leading-tight">Kabba</h3>
            <p className="text-xs text-blue-200 mt-0.5">Capital of Kabba/Bunu LGA</p>
          </div>
          <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <MapPin className="h-4 w-4" />
          </div>
        </div>
        <div className="flex gap-3 text-[10px] text-blue-100">
          <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> 8 wiki pages</span>
          <span className="flex items-center gap-1"><Music className="h-3 w-3" /> 3 festivals</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: MapPin, label: "Towns", value: "24+" },
          { icon: FileText, label: "Pages", value: "120+" },
          { icon: Users, label: "Members", value: "340+" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-wiki-text/5 p-2.5 text-center">
            <p className="text-base font-bold text-wiki-text">{s.value}</p>
            <p className="text-[10px] text-wiki-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Community update */}
      <div className="rounded-xl border border-wiki-border bg-wiki-card/50 p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="flex h-2 w-2 rounded-full bg-green-400 shrink-0" />
          <span className="text-[10px] font-semibold text-wiki-muted uppercase tracking-wider">Community Feed</span>
        </div>
        <p className="text-xs text-wiki-secondary leading-relaxed line-clamp-2">
          New article added: "The History of the Owé Kingdom and its Founding Traditions"
        </p>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between rounded-xl bg-wiki-text/5 px-3 py-2.5 group cursor-pointer">
        <span className="text-xs font-semibold text-wiki-text">Explore Okun Land</span>
        <ArrowRight className="h-3.5 w-3.5 text-wiki-muted group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
      <div className="relative max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Content */}
          <div className="text-left space-y-8 z-10">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-medium text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <BookOpen className="w-4 h-4" />
              <span>Okunpedia — Living encyclopedia</span>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-wiki-text leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Discover the <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
                Heart of Okun
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl leading-relaxed text-wiki-secondary max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Immerse yourself in the history, culture, and heritage of Okun-speaking towns
              through our beautiful, community-driven encyclopedia.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/towns" className="w-full sm:w-auto">
                <Button size="lg" className="w-full rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-base px-8 h-14">
                  Explore Towns <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/map" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full rounded-2xl active:scale-95 transition-all text-base px-8 h-14 bg-wiki-card/50 backdrop-blur-md border-wiki-border">
                  <Map className="mr-2 h-5 w-5 text-wiki-muted" /> View Map
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right — Real Platform Preview */}
          <motion.div
            className="relative lg:h-[520px] flex items-center justify-center lg:justify-end z-0"
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
            style={{ perspective: "1000px" }}
          >
            <HeroPreviewCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #050810 0%, #0a0f1a 50%, var(--color-wiki-bg) 100%)" }}>
      {/* Stars */}
      <div className="absolute inset-0 stars-bg opacity-60 pointer-events-none" />

      {/* Deep forest nebula glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 20%, rgba(45,89,72,0.1), transparent 50%),
          radial-gradient(ellipse 60% 60% at 80% 30%, rgba(224,153,32,0.06), transparent 50%),
          radial-gradient(ellipse 90% 70% at 50% 90%, rgba(45,89,72,0.05), transparent 50%)
        `,
      }} />

      {/* Floating orbs */}
      <motion.div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(45,89,72,0.06)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(224,153,32,0.04)" }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-[860px] mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
        {/* Floating icon */}
        <motion.div
          className="mx-auto mb-8 w-16 h-16 flex items-center justify-center rounded-2xl bg-forest-600/10 text-forest-600 dark:bg-forest-500/20 dark:text-forest-400 border border-forest-500/20 shadow-lg shadow-forest-500/10"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <BookOpen className="h-10 w-10" />
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl lg:text-8xl font-display font-medium mb-6 tracking-tight leading-[1.1] text-wiki-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span>
            Discover Ọ̀kun Land
          </span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-wiki-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          A community-driven encyclopedia documenting the rich history, culture,
          and heritage of Ọ̀kun-speaking towns in Kogi State, Nigeria.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/towns">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg">
                Explore Towns <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </Link>
          <Link href="/auth/register">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="secondary">
                Contribute
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

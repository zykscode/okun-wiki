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

      {/* Nebula glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 20%, rgba(255,77,77,0.1), transparent 50%),
          radial-gradient(ellipse 60% 60% at 80% 30%, rgba(0,229,204,0.06), transparent 50%),
          radial-gradient(ellipse 90% 70% at 50% 90%, rgba(255,77,77,0.05), transparent 50%)
        `,
      }} />

      {/* Floating orbs */}
      <motion.div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(255,77,77,0.06)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(0,229,204,0.04)" }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-[860px] mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
        {/* Floating icon */}
        <motion.div
          className="mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-coral-500 to-coral-700 text-white shadow-lg shadow-coral-500/30"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <BookOpen className="h-10 w-10" />
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 tracking-tight leading-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span
            className="animate-gradient-text"
            style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #ff4d4d 52%, #00e5cc 100%)", backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Discover Ọ̀kun Land
          </span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "#8892b0" }}
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

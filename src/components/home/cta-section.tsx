"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="border-t border-wiki-border theme-transition">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-12">
        <motion.div
          className="text-center p-8 sm:p-12 rounded-2xl border border-wiki-border overflow-hidden relative"
          style={{
            background:
              "linear-gradient(135deg, rgba(45,89,72,0.05) 0%, var(--color-wiki-card-strong) 50%, rgba(224,153,32,0.03) 100%)",
            backdropFilter: "blur(12px)",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-display font-medium text-wiki-text mb-4">
            Know an Okun town?
          </h2>
          <p className="text-wiki-secondary max-w-xl mx-auto mb-8 leading-relaxed text-lg">
            Help us document the heritage of Okun people. Every story, every tradition, every piece
            of history matters.
          </p>
          <Link href="/auth/register">
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg">Start contributing</Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

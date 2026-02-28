"use client";

import { TownCard } from "@/components/town/town-card";
import { motion } from "framer-motion";

interface Town {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  lga: string;
  overview: string;
  images: { url: string; caption: string | null }[];
}

export function FeaturedGrid({ towns }: { towns: Town[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
    >
      {towns.map((town) => (
        <motion.div
          key={town.id}
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.5, ease: "easeOut" },
            },
          }}
        >
          <TownCard town={town} />
        </motion.div>
      ))}
    </motion.div>
  );
}

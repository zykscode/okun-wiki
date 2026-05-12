"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface TownCardProps {
  town: {
    slug: string;
    name: string;
    tagline: string | null;
    lga: string;
    overview: string;
    images: { url: string; caption: string | null }[];
  };
}

export function TownCard({ town }: TownCardProps) {
  const primaryImage = town.images?.[0];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={`/towns/${town.slug}`} className="no-underline group">
        <div className="glass-card overflow-hidden group h-full flex flex-col">
          <div className="h-44 bg-forest-50 dark:bg-forest-900/20 flex items-center justify-center relative overflow-hidden">
            {primaryImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={primaryImage.url} alt={town.name} className="w-full h-full object-cover" />
            ) : (
              <>
                <span className="text-5xl font-display font-medium text-forest-600/20 dark:text-forest-400/20 select-none">
                  {town.name.charAt(0)}
                </span>
              </>
            )}
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-display font-bold text-xl text-wiki-text group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors duration-200">
              {town.name}
            </h3>
            {town.tagline && <p className="text-sm italic text-wiki-muted mt-1">{town.tagline}</p>}
            <div className="flex items-center gap-1 mt-2 mb-4">
              <MapPin className="h-3 w-3 text-wiki-muted" />
              <Badge
                variant="default"
                className="font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-none"
              >
                {town.lga} LGA
              </Badge>
            </div>
            <p className="text-sm text-wiki-secondary leading-relaxed mt-auto border-t border-wiki-border pt-4 line-clamp-2">
              {town.overview.substring(0, 120)}...
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

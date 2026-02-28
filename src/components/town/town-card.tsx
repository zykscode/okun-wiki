"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
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
        <Card className="overflow-hidden hover:border-wiki-border-accent hover:shadow-xl hover:shadow-coral-500/10 transition-all duration-300 h-full">
          <div className="h-40 bg-gradient-to-br from-coral-500/20 to-coral-700/30 flex items-center justify-center relative overflow-hidden">
            {primaryImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={primaryImage.url} alt={town.name} className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="absolute inset-0 stars-bg opacity-30 pointer-events-none" />
                <span className="text-5xl font-bold text-coral-500/30 select-none">{town.name.charAt(0)}</span>
              </>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-semibold text-lg text-wiki-text group-hover:text-coral-500 transition-colors duration-200">
              {town.name}
            </h3>
            {town.tagline && <p className="text-sm text-wiki-muted mt-1">{town.tagline}</p>}
            <div className="flex items-center gap-1 mt-2">
              <MapPin className="h-3 w-3 text-wiki-muted" />
              <Badge variant="outline">{town.lga} LGA</Badge>
            </div>
            <p className="text-sm text-wiki-muted mt-3 line-clamp-2">{town.overview.substring(0, 120)}...</p>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

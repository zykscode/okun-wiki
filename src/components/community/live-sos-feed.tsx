"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface GlobalSOS {
  id: string;
  content: string;
  createdAt: string;
  community: {
    slug: string;
    name: string;
  };
  author: {
    name: string | null;
  };
}

export function LiveSOSFeed() {
  const [sosUpdates, setSosUpdates] = useState<GlobalSOS[]>([]);

  useEffect(() => {
    const fetchSOS = async () => {
      try {
        const res = await fetch("/api/updates/sos?limit=3");
        if (res.ok) {
          const data = await res.json();
          setSosUpdates(data);
        }
      } catch (error) {
        console.error("Failed to fetch SOS", error);
      }
    };

    fetchSOS();
    const interval = setInterval(fetchSOS, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, []);

  if (sosUpdates.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
        <h3 className="text-sm font-bold tracking-wider text-red-500 uppercase">Live Emergency Feed</h3>
      </div>
      
      <div className="relative space-y-3">
        <AnimatePresence>
          {sosUpdates.map((update) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-panel p-4 border-red-500/30 bg-red-500/5 dark:bg-red-500/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
              <Link href={`/communities/${update.community.slug}`} className="block">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-wiki-text opacity-80">
                    {update.community.name}
                  </span>
                  <span className="text-[10px] text-wiki-muted">
                    {new Date(update.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-wiki-text line-clamp-2 leading-relaxed">
                  {update.content}
                </p>
                <div className="mt-2 text-xs text-wiki-muted flex items-center gap-1">
                  <span>Reported by {update.author.name || "Anonymous"}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

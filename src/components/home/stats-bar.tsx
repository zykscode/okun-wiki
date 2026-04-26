"use client";

import { MapPin, FileText, Users } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedNumber({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const stepTime = Math.max(Math.floor((duration * 1000) / Math.max(end, 1)), 20);
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration * 1000 / stepTime));
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

interface StatsBarProps {
  stats: { townCount: number; pageCount: number; userCount: number };
}

export function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { icon: MapPin, value: stats.townCount, label: "Towns documented", color: "text-forest-500" },
    { icon: FileText, value: stats.pageCount, label: "Wiki pages", color: "text-forest-400" },
    { icon: Users, value: stats.userCount, label: "Contributors", color: "text-[#e09920]" }, // Muted gold
  ];

  return (
    <section className="relative z-10 py-12 border-y border-wiki-border/50 bg-wiki-card/30 backdrop-blur-md">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 gap-8 text-center">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex flex-col items-center p-4 rounded-3xl hover:bg-wiki-hover transition-colors"
            >
              <motion.div
                className="flex items-center justify-center mb-3 h-12 w-12 rounded-2xl bg-wiki-text/5 text-blue-600 dark:text-blue-400"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className="h-6 w-6" />
              </motion.div>
              <p className="text-3xl lg:text-4xl font-display font-bold text-wiki-text tracking-tight mb-1">
                <AnimatedNumber value={item.value} />
              </p>
              <p className="text-xs uppercase tracking-wider text-wiki-muted font-semibold">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

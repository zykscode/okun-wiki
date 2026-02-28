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
    <section className="border-b border-wiki-border theme-transition" style={{ background: "var(--color-wiki-card)" }}>
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <motion.div
                className="flex items-center justify-center mb-2"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </motion.div>
              <p className="text-3xl font-display font-medium text-wiki-text tracking-tight mb-1">
                <AnimatedNumber value={item.value} />
              </p>
              <p className="text-xs uppercase tracking-wider text-wiki-muted font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

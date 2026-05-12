"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Map, BookOpen, Activity, Users, MapPin } from "lucide-react";
import Image from "next/image";

export function AppleScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Expanded container height for smoother scrolling
  // Ranges:
  // 0.00 - 0.25: Screen 1 (Hero Landscape)
  // 0.25 - 0.55: Screen 2 (Culture / History)
  // 0.55 - 0.80: Screen 3 (Encyclopedia / Bento)
  // 0.80 - 1.00: Screen 5 (CTA)

  // -- Screen 1: Hero Landscape --
  const s1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]);
  const s1Scale = useTransform(scrollYProgress, [0, 0.25], [1, 1.1]);
  const s1Y = useTransform(scrollYProgress, [0, 0.25], ["0%", "-10%"]);

  // -- Screen 2: Culture & History --
  const s2Opacity = useTransform(scrollYProgress, [0.2, 0.3, 0.5, 0.55], [0, 1, 1, 0]);
  const s2Y = useTransform(scrollYProgress, [0.2, 0.3, 0.5, 0.55], ["10%", "0%", "0%", "-10%"]);
  const s2ImgScale = useTransform(scrollYProgress, [0.2, 0.55], [1.1, 1]);

  // -- Screen 3: Encyclopedia --
  const s3Opacity = useTransform(scrollYProgress, [0.5, 0.6, 0.75, 0.8], [0, 1, 1, 0]);
  const s3Y = useTransform(scrollYProgress, [0.5, 0.6, 0.75, 0.8], ["10%", "0%", "0%", "-10%"]);

  // -- Screen 5: CTA --
  const s5Opacity = useTransform(scrollYProgress, [0.75, 0.9, 1], [0, 1, 1]);
  const s5Scale = useTransform(scrollYProgress, [0.75, 0.9, 1], [0.9, 1, 1]);

  return (
    <div ref={containerRef} className="relative h-[450vh] w-full bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center">
        {/* =======================
            SCREEN 1: HERO LANDSCAPE
        ======================= */}
        <motion.div
          style={{ opacity: s1Opacity, scale: s1Scale, y: s1Y }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/home-tour/landscape.jpeg"
              alt="Okun Landscape"
              fill
              className="object-cover opacity-80 mix-blend-screen"
              priority
            />
            {/* Gradient overlay to make text readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/90" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="z-10 px-4"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 pb-4 drop-shadow-2xl">
              Okunpedia.
            </h1>
            <p className="text-xl md:text-3xl font-medium text-neutral-200 mt-2 tracking-tight drop-shadow-lg">
              Profoundly Okun. Deeply connected.
            </p>
          </motion.div>
        </motion.div>

        {/* =======================
            SCREEN 2: CULTURE & HISTORY
        ======================= */}
        <motion.div
          style={{ opacity: s2Opacity, y: s2Y }}
          className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center gap-12 px-4 md:px-12 w-full max-w-7xl mx-auto"
        >
          <div className="flex-1 text-left space-y-6 z-10">
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-none">
              Rich Heritage. <br />
              <span className="text-neutral-400">Timeless Stories.</span>
            </h2>
            <p className="text-lg md:text-xl text-neutral-300 max-w-md">
              From the ancient artifacts that defined our ancestors to the vibrant festivals we
              celebrate today. Our culture is alive.
            </p>
          </div>
          <div className="flex-1 flex gap-6 relative h-[40vh] lg:h-[60vh] w-full">
            <motion.div
              style={{ scale: s2ImgScale }}
              className="relative w-1/2 h-[80%] mt-[20%] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <Image
                src="/images/home-tour/history.png"
                alt="Ancient Artifact"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              style={{ scale: s2ImgScale }}
              className="relative w-1/2 h-[80%] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <Image
                src="/images/home-tour/culture.png"
                alt="Cultural Festival"
                fill
                className="object-cover"
              />
            </motion.div>
            {/* Gradient glow */}
            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] -z-10" />
          </div>
        </motion.div>

        {/* =======================
            SCREEN 3: ENCYCLOPEDIA BENTO
        ======================= */}
        <motion.div
          style={{ opacity: s3Opacity, y: s3Y }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-12"
        >
          <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left space-y-6">
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-none">
                The Living <br />
                <span className="text-blue-500">Encyclopedia.</span>
              </h2>
              <p className="text-lg md:text-xl text-neutral-400 max-w-md">
                Explore towns, trace family lineages, discover social amenities, and understand the
                needs of our communities.
              </p>
              <div className="flex gap-4 pt-4">
                <Link href="/towns">
                  <Button
                    size="lg"
                    className="rounded-full bg-white text-black hover:bg-neutral-200"
                  >
                    Explore Towns
                  </Button>
                </Link>
                <Link href="/map">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-neutral-700 text-white hover:bg-neutral-800"
                  >
                    <Map className="w-4 h-4 mr-2" /> Map View
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 h-[400px]">
              <div className="col-span-2 rounded-3xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                <BookOpen className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-blue-400 uppercase tracking-widest mb-1">
                    Deep History
                  </p>
                  <p className="text-2xl font-bold text-white">Tracing back centuries.</p>
                </div>
              </div>
              <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between">
                <Users className="w-6 h-6 text-emerald-500" />
                <p className="text-lg font-bold text-white leading-tight mt-4">
                  Family
                  <br />
                  Lineages
                </p>
              </div>
              <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between">
                <MapPin className="w-6 h-6 text-purple-500" />
                <p className="text-lg font-bold text-white leading-tight mt-4">
                  Bordering
                  <br />
                  Towns
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* =======================
            SCREEN 5: FINAL CTA
        ======================= */}
        <motion.div
          style={{ opacity: s5Opacity, scale: s5Scale }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <Activity className="w-16 h-16 text-white mb-8" />
          <h2 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 tracking-tighter mb-8">
            Explore Okunpedia.
          </h2>
          <p className="text-xl text-neutral-400 max-w-xl mx-auto mb-10">
            Discover the history, culture, and communities of Okun land.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/blog">
              <Button
                size="lg"
                className="rounded-full h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-lg"
              >
                Read the Blog
              </Button>
            </Link>
            <Link href="/towns">
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full h-14 px-8 text-white hover:bg-neutral-800 text-lg"
              >
                Browse Towns
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Map, BookOpen, ShieldAlert, ArrowRight, Activity, Users, MapPin } from "lucide-react";
import Image from "next/image";
import { GlobalSosFeed } from "./global-sos-feed";

export function AppleScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Expanded container height for smoother scrolling
  // Ranges:
  // 0.00 - 0.20: Screen 1 (Hero Landscape)
  // 0.20 - 0.45: Screen 2 (Culture / History)
  // 0.45 - 0.70: Screen 3 (Encyclopedia / Bento)
  // 0.70 - 0.90: Screen 4 (Emergency)
  // 0.90 - 1.00: Screen 5 (CTA)

  // -- Screen 1: Hero Landscape --
  const s1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0]);
  const s1Scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const s1Y = useTransform(scrollYProgress, [0, 0.2], ["0%", "-10%"]);

  // -- Screen 2: Culture & History --
  const s2Opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.4, 0.45], [0, 1, 1, 0]);
  const s2Y = useTransform(scrollYProgress, [0.15, 0.25, 0.4, 0.45], ["10%", "0%", "0%", "-10%"]);
  const s2ImgScale = useTransform(scrollYProgress, [0.15, 0.45], [1.1, 1]);

  // -- Screen 3: Encyclopedia --
  const s3Opacity = useTransform(scrollYProgress, [0.4, 0.5, 0.65, 0.7], [0, 1, 1, 0]);
  const s3Y = useTransform(scrollYProgress, [0.4, 0.5, 0.65, 0.7], ["10%", "0%", "0%", "-10%"]);

  // -- Screen 4: Emergency --
  const s4Opacity = useTransform(scrollYProgress, [0.65, 0.75, 0.85, 0.9], [0, 1, 1, 0]);
  const s4Y = useTransform(scrollYProgress, [0.65, 0.75, 0.85, 0.9], ["10%", "0%", "0%", "-10%"]);

  // -- Screen 5: CTA --
  const s5Opacity = useTransform(scrollYProgress, [0.85, 0.95, 1], [0, 1, 1]);
  const s5Scale = useTransform(scrollYProgress, [0.85, 0.95, 1], [0.9, 1, 1]);

  return (
    <div ref={containerRef} className="relative h-[600vh] w-full bg-black">
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
              src="/images/home-tour/landscape.png" 
              alt="Okun Landscape" 
              fill
              className="object-cover opacity-60 mix-blend-screen"
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
              Profoundly Ọ̀kun. Deeply connected.
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
              Rich Heritage. <br/>
              <span className="text-neutral-400">Timeless Stories.</span>
            </h2>
            <p className="text-lg md:text-xl text-neutral-300 max-w-md">
              From the ancient artifacts that defined our ancestors to the vibrant festivals we celebrate today. Our culture is alive.
            </p>
          </div>
          <div className="flex-1 flex gap-6 relative h-[40vh] lg:h-[60vh] w-full">
             <motion.div style={{ scale: s2ImgScale }} className="relative w-1/2 h-[80%] mt-[20%] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image src="/images/home-tour/history.png" alt="Ancient Artifact" fill className="object-cover" />
             </motion.div>
             <motion.div style={{ scale: s2ImgScale }} className="relative w-1/2 h-[80%] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image src="/images/home-tour/culture.png" alt="Cultural Festival" fill className="object-cover" />
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
                The Living <br/>
                <span className="text-blue-500">Encyclopedia.</span>
              </h2>
              <p className="text-lg md:text-xl text-neutral-400 max-w-md">
                Explore towns, trace family lineages, discover social amenities, and understand the needs of our communities.
              </p>
              <div className="flex gap-4 pt-4">
                <Link href="/towns">
                  <Button size="lg" className="rounded-full bg-white text-black hover:bg-neutral-200">
                    Explore Towns
                  </Button>
                </Link>
                <Link href="/map">
                  <Button size="lg" variant="outline" className="rounded-full border-neutral-700 text-white hover:bg-neutral-800">
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
                  <p className="text-sm font-medium text-blue-400 uppercase tracking-widest mb-1">Deep History</p>
                  <p className="text-2xl font-bold text-white">Tracing back centuries.</p>
                </div>
              </div>
              <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between">
                <Users className="w-6 h-6 text-emerald-500" />
                <p className="text-lg font-bold text-white leading-tight mt-4">Family<br/>Lineages</p>
              </div>
              <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between">
                <MapPin className="w-6 h-6 text-purple-500" />
                <p className="text-lg font-bold text-white leading-tight mt-4">Bordering<br/>Towns</p>
              </div>
            </div>
          </div>
        </motion.div>


        {/* =======================
            SCREEN 4: EMERGENCY
        ======================= */}
        <motion.div
          style={{ opacity: s4Opacity, y: s4Y }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
           <div className="max-w-4xl w-full">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-8">
                <ShieldAlert className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6">
                Real-time Situation Reports.
              </h2>
              <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto mb-12">
                A dedicated channel for critical updates and emergency situation reports across all Ọ̀kun towns. Built for safety, not for chat.
              </p>
              
              {/* Live Global SOS Feed */}
              <GlobalSosFeed />
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
            Ready to contribute?
          </h2>
          <p className="text-xl text-neutral-400 max-w-xl mx-auto mb-10">
            Join the community of editors documenting the history, culture, and needs of our towns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="rounded-full h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-lg">
                Become an Editor
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="ghost" className="rounded-full h-14 px-8 text-white hover:bg-neutral-800 text-lg">
                Read our Mission
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

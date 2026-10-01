"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SmoothScroll from "@/components/site/SmoothScroll";
import Cursor from "@/components/site/Cursor";
import Preloader from "@/components/site/Preloader";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import Manifesto from "@/components/site/Manifesto";
import Services from "@/components/site/Services";
import Work from "@/components/site/Work";
import Stats from "@/components/site/Stats";
import CTA from "@/components/site/CTA";
import Footer from "@/components/site/Footer";
import { lenisRef } from "@/lib/scroll";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handleReveal = useCallback(() => {
    setLoaded(true);
    lenisRef.current?.start();
  }, []);

  // lock page scroll while the preloader is on stage
  useEffect(() => {
    if (!loaded) {
      lenisRef.current?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenisRef.current?.start();
      document.body.style.overflow = "";
    }
  }, [loaded]);

  return (
    <main className="relative min-h-screen bg-ink text-paper">
      <SmoothScroll />

      {/* film grain over everything */}
      <div
        aria-hidden
        className="noise pointer-events-none fixed inset-0 z-[95] opacity-[0.05]"
      />

      <Cursor />

      <AnimatePresence>
        {!loaded && (
          <Preloader key="preloader" onReveal={handleReveal} />
        )}
      </AnimatePresence>

      <Nav />

      <Hero started={loaded} />
      <Marquee />
      <Manifesto />
      <Services />
      <Work />
      <Stats />
      <CTA />
      <Footer />
    </main>
  );
}

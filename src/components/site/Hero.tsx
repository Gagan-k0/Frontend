"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Play } from "lucide-react";
import AuroraCanvas from "./AuroraCanvas";
import Magnetic from "./Magnetic";
import { scrollToTarget } from "@/lib/scroll";

const TITLE = ["A", "U", "R", "O", "R", "A"];
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SUBTLE =
  "We craft immersive digital experiences that blur the line between reality and imagination — for brands that refuse to be ordinary.";

export default function Hero({ started }: { started: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const metaY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* ---- backdrop ---- */}
      <div className="absolute inset-0">
        {/* aurora blobs */}
        <div className="absolute -left-[15%] top-[-20%] h-[60vmax] w-[60vmax] animate-blob-a rounded-full bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.13),transparent_62%)] blur-3xl" />
        <div className="absolute -right-[18%] top-[10%] h-[55vmax] w-[55vmax] animate-blob-b rounded-full bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.12),transparent_62%)] blur-3xl" />
        <div className="absolute bottom-[-30%] left-[25%] h-[50vmax] w-[50vmax] animate-blob-a rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.10),transparent_60%)] blur-3xl" />
        {/* particle field */}
        <AuroraCanvas className="absolute inset-0 h-full w-full" />
        {/* faint grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(242,241,234,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(242,241,234,0.025)_1px,transparent_1px)] [background-size:88px_88px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black,transparent)]" />
        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_45%,transparent_55%,rgba(10,10,12,0.9))]" />
      </div>

      {/* ---- content ---- */}
      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 pb-24 pt-32 md:px-10 md:pt-36"
      >
        {/* meta row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.8, ease: EASE }}
          className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.3em] text-paper/50 md:mb-10"
        >
          <span className="flex items-center gap-2.5">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-mint" />
            Available for work
          </span>
          <span className="hidden sm:block">Immersive digital studio</span>
          <span className="hidden lg:block">51.5072° N — Everywhere</span>
        </motion.div>

        {/* display title */}
        <motion.h1
          style={{ y: titleY }}
          className="select-none font-display font-extrabold leading-[0.85] tracking-[-0.03em]"
          aria-label="AURORA"
        >
          <span className="sr-only">AURORA — Immersive Digital Studio</span>
          <span aria-hidden className="flex flex-wrap">
            {TITLE.map((letter, i) => (
              <span key={i} className="overflow-hidden py-[0.06em]">
                <motion.span
                  initial={{ y: "112%", rotate: 6 }}
                  animate={started ? { y: 0, rotate: 0 } : {}}
                  transition={{
                    delay: 0.35 + i * 0.065,
                    duration: 1.15,
                    ease: EASE,
                  }}
                  whileHover={{
                    y: -14,
                    color: "#4ade80",
                    transition: { type: "spring", stiffness: 350, damping: 12 },
                  }}
                  className="inline-block text-[20vw] text-paper md:text-[min(11vw,9rem)] lg:text-[min(9.5vw,9rem)]"
                >
                  {letter}
                </motion.span>
              </span>
            ))}
            <span className="overflow-hidden py-[0.06em]">
              <motion.span
                initial={{ y: "112%" }}
                animate={started ? { y: 0 } : {}}
                transition={{ delay: 0.35 + 6 * 0.065, duration: 1.15, ease: EASE }}
                className="inline-block text-[20vw] text-mint md:text-[min(11vw,9rem)] lg:text-[min(9.5vw,9rem)]"
              >
                .
              </motion.span>
            </span>
          </span>
        </motion.h1>

        {/* sub row */}
        <div className="mt-10 flex flex-col gap-10 md:mt-14 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.95, duration: 0.9, ease: EASE }}
            className="max-w-md text-base leading-relaxed text-paper/65 md:text-lg"
          >
            {SUBTLE.split("blur the line between reality and imagination").map(
              (part, i) =>
                i === 0 ? (
                  <span key={i}>{part}</span>
                ) : (
                  <span key={i}>
                    <span className="text-mint">
                      blur the line between reality and imagination
                    </span>
                    {part}
                  </span>
                )
            )}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1, duration: 0.9, ease: EASE }}
            className="flex flex-wrap items-center gap-4"
          >
            <Magnetic strength={0.3}>
              <button
                onClick={() => scrollToTarget("#work")}
                className="group relative overflow-hidden rounded-full bg-mint px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-paper">
                  Explore work
                </span>
                <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="absolute inset-0 rounded-full border border-mint/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>
            </Magnetic>

            <Magnetic strength={0.3}>
              <button
                onClick={() => scrollToTarget("#manifesto")}
                className="group flex items-center gap-3 rounded-full border border-paper/20 px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-paper/80 transition-colors duration-300 hover:border-mint/60 hover:text-mint"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current">
                  <Play className="h-2.5 w-2.5 fill-current" />
                </span>
                Showreel
              </button>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      {/* ---- bottom bar ---- */}
      <motion.div
        style={{ y: metaY, opacity: fade }}
        className="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 pb-8 md:px-10"
      >
        <motion.button
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
          onClick={() => scrollToTarget("#manifesto")}
          className="group flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/45 transition-colors hover:text-mint"
          aria-label="Scroll down"
        >
          <span className="relative h-10 w-px overflow-hidden bg-paper/20">
            <span className="absolute inset-0 animate-scroll-line bg-mint" />
          </span>
          Scroll
          <ArrowDown className="h-3 w-3 transition-transform duration-300 group-hover:translate-y-1" />
        </motion.button>

        <motion.span
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ delay: 1.6 }}
          className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-paper/45 md:block"
        >
          ©2025 — Made with obsession
        </motion.span>
      </motion.div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";
import SectionHeading from "./SectionHeading";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function OrbitButton() {
  return (
    <Magnetic strength={0.45}>
      <a
        href="mailto:hello@aurora.studio"
        className="group relative flex h-40 w-40 items-center justify-center md:h-52 md:w-52"
        aria-label="Start a project — email us"
      >
        {/* rotating ring text */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full animate-spin-slower"
          aria-hidden
        >
          <defs>
            <path
              id="orbit-circle"
              d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
            />
          </defs>
          <text className="fill-paper/70 font-mono text-[12.5px] uppercase tracking-[3.5px]">
            <textPath href="#orbit-circle">
              Start a project — Start a project —
            </textPath>
          </text>
        </svg>

        {/* center disc */}
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-mint text-ink transition-all duration-500 group-hover:bg-paper md:h-28 md:w-28">
          <ArrowUpRight className="h-8 w-8 transition-transform duration-500 group-hover:rotate-45 md:h-9 md:w-9" />
        </span>

        {/* halo */}
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.22),transparent_65%)] blur-xl transition-opacity duration-500 group-hover:opacity-100" />
      </a>
    </Magnetic>
  );
}

export default function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden py-32 md:py-48">
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.09),transparent_65%)] blur-3xl" />

      <div className="relative mx-auto flex max-w-[1400px] flex-col items-center px-6 text-center md:px-10">
        <SectionHeading index="04" label="Contact" />

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: EASE }}
          className="font-display font-extrabold leading-[0.95] tracking-tight"
        >
          <span className="block text-5xl text-paper md:text-8xl">
            Have an idea?
          </span>
          <span className="mt-2 block text-5xl text-stroke transition-all md:text-8xl">
            Let&rsquo;s build it
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.15, duration: 0.9, ease: EASE }}
          className="mt-8 max-w-md text-sm leading-relaxed text-paper/60 md:text-base"
        >
          One call. Zero slides. Tell us where you want to go and we will show
          you the most immersive way to get there.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.25, duration: 0.9, ease: EASE }}
          className="mt-14"
        >
          <OrbitButton />
        </motion.div>

        <motion.a
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          href="mailto:hello@aurora.studio"
          className="mt-12 border-b border-paper/30 pb-1 font-mono text-sm tracking-[0.2em] text-paper/70 transition-colors hover:border-mint hover:text-mint"
        >
          hello@aurora.studio
        </motion.a>
      </div>
    </section>
  );
}

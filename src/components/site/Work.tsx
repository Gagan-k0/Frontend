"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Project = {
  title: string;
  category: string;
  year: string;
  src: string;
  blurb: string;
  span: string;
};

const PROJECTS: Project[] = [
  {
    title: "Nexus",
    category: "Immersive Installation",
    year: "2025",
    src: "/work/nexus.png",
    blurb: "Liquid-chrome flagship for a synthetic media lab",
    span: "md:col-span-7",
  },
  {
    title: "Pulse",
    category: "Data Experience",
    year: "2024",
    src: "/work/pulse.png",
    blurb: "Living aurora of 1.2M realtime data points",
    span: "md:col-span-5",
  },
  {
    title: "Monolith",
    category: "Brand Experience",
    year: "2024",
    src: "/work/monolith.png",
    blurb: "A brutalist digital home for an architecture house",
    span: "md:col-span-5",
  },
  {
    title: "Prism",
    category: "Product Launch",
    year: "2025",
    src: "/work/prism.png",
    blurb: "Refracting light and story for an optics startup",
    span: "md:col-span-7",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 64 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: EASE }}
      className={`group col-span-1 ${project.span} ${
        index % 2 === 1 ? "md:mt-24" : ""
      }`}
    >
      <div
        data-cursor="view"
        className="relative overflow-hidden rounded-xl border border-paper/10"
      >
        {/* frame for aspect ratio */}
        <div className="relative aspect-[16/9] w-full">
          <motion.div style={{ y }} className="absolute -inset-y-[12%] inset-x-0">
            <Image
              src={project.src}
              alt={`${project.title} — ${project.category}`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
              priority={index === 0}
            />
          </motion.div>

          {/* hover veil */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

          {/* index chip */}
          <span className="absolute left-5 top-5 rounded-full border border-paper/20 bg-ink/40 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-paper/80 backdrop-blur-md">
            0{index + 1}
          </span>

          {/* year chip */}
          <span className="absolute right-5 top-5 rounded-full border border-paper/20 bg-ink/40 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-paper/80 backdrop-blur-md">
            {project.year}
          </span>

          {/* bottom info */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-mint">
                {project.category}
              </p>
              <h3 className="font-display text-3xl font-extrabold tracking-tight text-paper md:text-5xl">
                {project.title}
              </h3>
              <p className="mt-2 max-w-sm text-sm text-paper/65 opacity-0 translate-y-2 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {project.blurb}
              </p>
            </div>
            <span className="mb-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-paper/25 text-paper transition-all duration-500 group-hover:border-mint group-hover:bg-mint group-hover:text-ink md:h-14 md:w-14">
              <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading index="03" label="Selected work" />

        <div className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="max-w-2xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-paper md:text-6xl"
          >
            Work that moves <span className="text-stroke-mint">people</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.12, duration: 0.9, ease: EASE }}
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/45"
          >
            2024 — 2025 · Hover to explore
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8 md:gap-y-4">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

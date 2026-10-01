"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import SectionHeading from "./SectionHeading";

const TEXT =
  "We believe great products are born where design, technology and emotion collide. Every pixel earns its place. Every motion tells a story. We build experiences people feel — not just use.";

const ACCENTS: Record<string, string> = {
  design: "text-lilac",
  technology: "text-teal",
  emotion: "text-mint",
  "feel": "text-gold",
};

const PRINCIPLES = [
  {
    num: "P.01",
    title: "Craft over noise",
    body: "Restraint is a feature. We polish until the interface disappears and only the experience remains.",
  },
  {
    num: "P.02",
    title: "Motion is meaning",
    body: "Animation is not decoration — it is hierarchy, causality and emotion rendered at 60 frames per second.",
  },
  {
    num: "P.03",
    title: "Built to perform",
    body: "Beauty that ships. Every experiment is engineered to load fast, scale cleanly and degrade gracefully.",
  },
];

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const clean = word.replace(/[.,—]/g, "").toLowerCase();
  return (
    <motion.span
      style={{ opacity }}
      className={`mr-[0.28em] inline-block ${ACCENTS[clean] ?? ""}`}
    >
      {word}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "end 0.42"],
  });

  const words = TEXT.split(" ");

  return (
    <section id="manifesto" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading index="01" label="Manifesto" />

        <div className="grid gap-16 lg:grid-cols-12">
          <div ref={ref} className="lg:col-span-9">
            <p className="font-display text-3xl font-semibold leading-[1.25] tracking-tight text-paper md:text-5xl md:leading-[1.18]">
              {words.map((word, i) => (
                <Word
                  key={i}
                  word={word}
                  progress={scrollYProgress}
                  range={[i / words.length, (i + 1) / words.length]}
                />
              ))}
            </p>
          </div>

          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 border-l border-paper/12 pl-6"
            >
              {PRINCIPLES.map((p) => (
                <div key={p.num}>
                  <div className="mb-1.5 flex items-baseline gap-3">
                    <span className="font-mono text-[10px] tracking-[0.25em] text-mint">
                      {p.num}
                    </span>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wide text-paper">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-paper/55">
                    {p.body}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Asterisk } from "lucide-react";

const ITEMS = [
  "Immersive experiences",
  "Creative development",
  "Motion design",
  "Art direction",
  "WebGL & shaders",
  "Brand systems",
  "Interaction design",
  "Spatial interfaces",
];

function Row({ reverse = false }: { reverse?: boolean }) {
  const list = [...ITEMS, ...ITEMS];
  return (
    <div className="flex w-max items-center gap-0" aria-hidden>
      <div
        className={`flex w-max items-center ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}
      >
        {list.map((item, i) => (
          <span key={i} className="flex items-center">
            <span
              className={`whitespace-nowrap px-6 font-display text-3xl font-bold uppercase tracking-tight md:text-5xl ${
                i % 2 === 0 ? "text-paper" : "text-stroke-faint"
              }`}
            >
              {item}
            </span>
            <Asterisk className="h-6 w-6 shrink-0 text-mint md:h-8 md:w-8" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="relative -mx-4 -rotate-1 border-y border-paper/10 bg-ink-soft/80 py-6 backdrop-blur-sm md:py-8">
      <div className="overflow-hidden mask-fade-edges">
        <Row />
      </div>
      <span className="sr-only">
        Immersive experiences, creative development, motion design, art
        direction, WebGL and shaders, brand systems, interaction design,
        spatial interfaces.
      </span>
    </section>
  );
}

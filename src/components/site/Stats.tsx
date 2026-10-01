"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STATS = [
  { value: 120, suffix: "+", label: "Projects shipped" },
  { value: 18, suffix: "", label: "Industry awards" },
  { value: 96, suffix: "%", label: "Client retention" },
  { value: 12, suffix: "", label: "Countries reached" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2.1,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      <span className="text-mint">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative border-y border-paper/10 bg-ink-soft/60 py-16 md:py-24">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-12 px-6 md:grid-cols-4 md:px-10">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: EASE }}
            className="border-l border-paper/12 pl-5 md:pl-8"
          >
            <div className="font-display text-5xl font-extrabold tracking-tight text-paper md:text-7xl">
              <Counter to={stat.value} suffix={stat.suffix} />
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/50 md:text-[11px]">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

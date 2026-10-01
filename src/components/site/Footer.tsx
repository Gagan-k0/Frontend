"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Github, Twitter, Instagram, Dribbble } from "lucide-react";
import Magnetic from "./Magnetic";
import { scrollToTarget } from "@/lib/scroll";

const SOCIALS = [
  { icon: Github, label: "GitHub" },
  { icon: Twitter, label: "Twitter" },
  { icon: Instagram, label: "Instagram" },
  { icon: Dribbble, label: "Dribbble" },
];

const SITEMAP = [
  { label: "Manifesto", href: "#manifesto" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums">{time ?? "00:00:00"}</span>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-paper/10">
      <div className="mx-auto max-w-[1400px] px-6 pb-10 pt-16 md:px-10 md:pt-20">
        {/* top grid */}
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-extrabold tracking-tight text-paper">
                AURORA
              </span>
              <span className="font-mono text-[10px] text-mint">®</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/55">
              An immersive digital studio crafting experiences people feel —
              not just use. Distributed everywhere, obsessed with craft.
            </p>
            <ul className="mt-6 flex gap-3">
              {SOCIALS.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Magnetic strength={0.4}>
                    <a
                      href="#top"
                      onClick={(e) => e.preventDefault()}
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 text-paper/60 transition-all duration-300 hover:border-mint hover:bg-mint hover:text-ink"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
              Sitemap
            </h4>
            <ul className="space-y-3">
              {SITEMAP.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollToTarget(item.href)}
                    className="group flex items-center gap-2 text-sm text-paper/65 transition-colors hover:text-mint"
                  >
                    <span className="h-px w-0 bg-mint transition-all duration-300 group-hover:w-4" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
              Studio
            </h4>
            <p className="text-sm leading-relaxed text-paper/65">
              hello@aurora.studio
              <br />
              +1 (000) 111 — AURORA
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/45">
              Local time — <LocalTime />
            </p>
          </div>
        </div>

        {/* bottom row */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-paper/10 pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/40">
          <span>© 2025 AURORA Studio — All rights reserved</span>
          <span className="hidden md:block">Crafted with obsession</span>
          <button
            onClick={() => scrollToTarget(0)}
            className="group flex items-center gap-2 transition-colors hover:text-mint"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>

      {/* giant watermark */}
      <div aria-hidden className="pointer-events-none relative select-none overflow-hidden">
        <motion.div
          initial={{ y: "42%", opacity: 0 }}
          whileInView={{ y: "12%", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mask-fade-b text-center font-display text-[24vw] font-extrabold leading-[0.78] tracking-[-0.02em] text-stroke-faint"
        >
          AURORA
        </motion.div>
      </div>
    </footer>
  );
}

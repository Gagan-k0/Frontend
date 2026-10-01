"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";
import { scrollToTarget, lenisRef } from "@/lib/scroll";

const LINKS = [
  { label: "Manifesto", href: "#manifesto", num: "01" },
  { label: "Services", href: "#services", num: "02" },
  { label: "Work", href: "#work", num: "03" },
  { label: "Contact", href: "#contact", num: "04" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 60));

  // lock scroll while the overlay menu is open
  useEffect(() => {
    if (open) {
      lenisRef.current?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenisRef.current?.start();
      document.body.style.overflow = "";
    }
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    // wait for the overlay to start closing before scrolling
    window.setTimeout(() => scrollToTarget(href), 350);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-[110] transition-colors duration-500 ${
          scrolled
            ? "border-b border-paper/8 bg-ink/70 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:h-20 md:px-10">
          <button
            onClick={() => go("#top")}
            className="group flex items-baseline gap-1"
            aria-label="AURORA home"
          >
            <span className="font-display text-xl font-extrabold tracking-tight text-paper transition-colors group-hover:text-mint">
              AURORA
            </span>
            <span className="font-mono text-[10px] text-mint">®</span>
          </button>

          <ul className="hidden items-center gap-9 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => go(link.href)}
                  className="group relative font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60 transition-colors hover:text-paper"
                >
                  <span className="mr-1 text-mint/70">{link.num}</span>
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-mint transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <Magnetic strength={0.3}>
                <button
                  onClick={() => go("#contact")}
                  className="group flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-ink transition-colors duration-300 hover:bg-mint"
                >
                  Start a project
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
                </button>
              </Magnetic>
            </div>

            {/* burger */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 md:hidden"
            >
              <span
                className={`absolute h-px w-4 bg-paper transition-all duration-300 ${
                  open ? "rotate-45" : "-translate-y-1"
                }`}
              />
              <span
                className={`absolute h-px w-4 bg-paper transition-all duration-300 ${
                  open ? "-rotate-45" : "translate-y-1"
                }`}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[105] flex flex-col justify-center bg-ink-soft px-8"
          >
            <ul className="space-y-2">
              {LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <button
                    onClick={() => go(link.href)}
                    className="flex items-baseline gap-4 py-2 text-left"
                  >
                    <span className="font-mono text-xs text-mint">{link.num}</span>
                    <span className="font-display text-4xl font-extrabold text-paper">
                      {link.label}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-14 font-mono text-[11px] uppercase tracking-[0.3em] text-paper/40"
            >
              hello@aurora.studio — everywhere, earth
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

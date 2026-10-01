"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const LETTERS = ["A", "U", "R", "O", "R", "A"];

export default function Preloader({ onReveal }: { onReveal: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const revealedRef = useRef(false);

  useEffect(() => {
    const DURATION = 2000;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // ease-out-quart for a satisfying deceleration
      const eased = 1 - Math.pow(1 - t, 4);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          setExiting(true);
          if (!revealedRef.current) {
            revealedRef.current = true;
            onReveal();
          }
        }, 420);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onReveal]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col justify-between overflow-hidden bg-ink px-6 py-8 md:px-12"
      initial={false}
      animate={exiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* top row */}
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-paper/50">
        <span>AURORA® Studio</span>
        <span className="hidden sm:block">Immersive Digital Experiences</span>
        <span>EST. 2025</span>
      </div>

      {/* center wordmark */}
      <div className="flex items-center justify-center">
        <div className="flex overflow-hidden">
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: "115%", rotate: 8 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{
                delay: 0.12 * i,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-display text-[18vw] font-extrabold leading-none tracking-tight text-paper md:text-[11vw]"
            >
              {letter}
              {i === 5 && <span className="text-mint">.</span>}
            </motion.span>
          ))}
        </div>
      </div>

      {/* bottom row: progress */}
      <div className="flex items-end justify-between gap-8">
        <div className="w-full max-w-md">
          <div className="mb-3 flex justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-paper/50">
            <span>Loading experience</span>
            <span className="text-mint">{progress}%</span>
          </div>
          <div className="h-px w-full bg-paper/15">
            <motion.div
              className="h-px bg-gradient-to-r from-teal via-mint to-lilac"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="font-display text-6xl font-bold tabular-nums text-paper/90 md:text-8xl">
          {progress}
        </span>
      </div>
    </motion.div>
  );
}

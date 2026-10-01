"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type CursorVariant = "default" | "hover" | "view" | "hide";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 });
  const dotX = useSpring(x, { stiffness: 1600, damping: 80, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 1600, damping: 80, mass: 0.2 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    // defer enabling to avoid synchronous setState inside the effect
    const enableRaf = requestAnimationFrame(() => setEnabled(true));
    document.body.classList.add("has-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest('[data-cursor="view"]')) setVariant("view");
      else if (t.closest("a, button, [role='button'], [data-cursor='hover']"))
        setVariant("hover");
      else setVariant("default");
    };

    const leaveWindow = () => setVariant("hide");
    const enterWindow = () => setVariant("default");

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leaveWindow);
    document.documentElement.addEventListener("mouseenter", enterWindow);

    return () => {
      cancelAnimationFrame(enableRaf);
      document.body.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leaveWindow);
      document.documentElement.removeEventListener("mouseenter", enterWindow);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {variant !== "hide" && (
        <>
          {/* Trailing ring / label bubble */}
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[120]"
            style={{ x: ringX, y: ringY }}
          >
            <motion.div
              className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${
                variant === "view"
                  ? "bg-mint"
                  : "border border-paper/40 bg-paper/5 backdrop-blur-[2px]"
              }`}
              animate={{
                width: variant === "view" ? 88 : variant === "hover" ? 56 : 34,
                height: variant === "view" ? 88 : variant === "hover" ? 56 : 34,
                opacity: 1,
              }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              <AnimatePresence mode="wait">
                {variant === "view" && (
                  <motion.span
                    key="view-label"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink"
                  >
                    View
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Precision dot */}
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[121]"
            style={{ x: dotX, y: dotY }}
          >
            <motion.div
              className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-mint"
              animate={{
                width: variant === "view" ? 0 : variant === "hover" ? 4 : 7,
                height: variant === "view" ? 0 : variant === "hover" ? 4 : 7,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

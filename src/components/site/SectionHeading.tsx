"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  index: string;
  label: string;
  accent?: ReactNode;
};

export default function SectionHeading({
  index,
  label,
  accent,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-14 flex items-center gap-4 md:mb-20"
    >
      <span className="font-mono text-xs tracking-[0.3em] text-mint">
        {index}
      </span>
      <span className="h-px flex-1 bg-paper/12" />
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-paper/55">
        {label}
        {accent}
      </span>
    </motion.div>
  );
}

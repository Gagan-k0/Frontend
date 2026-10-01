"use client";

import { useRef, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import { Sparkles, Orbit, Layers, PenTool, ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SERVICES = [
  {
    icon: Sparkles,
    title: "Immersive Web",
    body: "Award-grade marketing sites and product moments — WebGL scenes, shader backdrops and scroll choreography engineered on modern React.",
    tags: ["Next.js", "WebGL", "Shaders"],
    glow: "rgba(74,222,128,0.16)",
  },
  {
    icon: Orbit,
    title: "Motion & Interaction",
    body: "Micro-interactions, page transitions and physics-based animation systems that make interfaces feel alive and unmistakably premium.",
    tags: ["Framer Motion", "Springs", "Lottie"],
    glow: "rgba(167,139,250,0.16)",
  },
  {
    icon: Layers,
    title: "Brand Systems",
    body: "Identities built as living systems — type, color and motion rules that flex from a favicon to a full-scale immersive launch.",
    tags: ["Identity", "Art direction", "Guidelines"],
    glow: "rgba(45,212,191,0.16)",
  },
  {
    icon: PenTool,
    title: "Product Design",
    body: "From ambiguous idea to shippable interface — UX architecture, high-fidelity UI and clickable prototypes your team can build from.",
    tags: ["UX", "UI", "Prototyping"],
    glow: "rgba(251,191,36,0.14)",
  },
];

function TiltCard({
  service,
  index,
}: {
  service: (typeof SERVICES)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(ry, { stiffness: 220, damping: 22 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, ${service.glow}, transparent 65%)`;
  const Icon = service.icon;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mx.set(px * 100);
    my.set(py * 100);
    ry.set((px - 0.5) * 9);
    rx.set(-(py - 0.5) * 9);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    mx.set(50);
    my.set(50);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.1, duration: 0.9, ease: EASE }}
      style={{ perspective: 1100 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-full overflow-hidden rounded-2xl border border-paper/10 bg-paper/[0.03] p-8 backdrop-blur-sm transition-colors duration-500 hover:border-mint/30 md:p-10"
      >
        {/* pointer glow */}
        <motion.div
          aria-hidden
          style={{ background: glow }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="relative flex h-full flex-col" style={{ transform: "translateZ(35px)" }}>
          <div className="mb-8 flex items-start justify-between">
            <div className="flex h-13 w-13 items-center justify-center rounded-xl border border-paper/12 bg-ink-soft p-3.5 text-mint transition-all duration-500 group-hover:border-mint/40 group-hover:bg-mint group-hover:text-ink">
              <Icon className="h-6 w-6" strokeWidth={1.6} />
            </div>
            <span className="font-mono text-[10px] tracking-[0.3em] text-paper/35">
              /0{index + 1}
            </span>
          </div>

          <h3 className="mb-3 font-display text-2xl font-bold tracking-tight text-paper">
            {service.title}
          </h3>
          <p className="mb-8 flex-1 text-sm leading-relaxed text-paper/60">
            {service.body}
          </p>

          <div className="flex items-end justify-between">
            <ul className="flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-paper/12 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-paper/55 transition-colors group-hover:border-paper/25"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <ArrowUpRight className="h-5 w-5 text-paper/30 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-mint group-hover:opacity-100 -translate-x-2" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative py-28 md:py-40">
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.06),transparent_70%)] blur-2xl" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading index="02" label="What we do" />

        <div className="mb-14 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="max-w-xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-paper md:text-6xl"
          >
            Capabilities that <span className="text-mint">ship wow</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.12, duration: 0.9, ease: EASE }}
            className="max-w-sm text-sm leading-relaxed text-paper/55"
          >
            Four disciplines, one team. We take projects end-to-end — strategy,
            design, engineering and the motion layer that ties it all together.
          </motion.p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:gap-6">
          {SERVICES.map((service, i) => (
            <TiltCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

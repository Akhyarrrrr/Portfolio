"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function SectionHeading({
  badge,
  heading,
  sub,
  headingAs: HeadingTag = "h2",
}: {
  badge: string;
  heading: ReactNode;
  sub: string;
  headingAs?: "h1" | "h2";
}) {
  return (
    <motion.div
      className="mb-12 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#61DCA3]" />
        <span className="text-xs font-medium uppercase tracking-widest text-[#61DCA3]">
          {badge}
        </span>
      </div>
      <HeadingTag className="text-4xl font-extrabold tracking-tight text-white [&_span]:text-[#61DCA3]">
        {heading}
      </HeadingTag>
      <p className="mx-auto mt-3 max-w-xl text-sm text-white/40">{sub}</p>
    </motion.div>
  );
}

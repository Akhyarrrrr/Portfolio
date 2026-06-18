"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import ScrollVelocity from "../ScrollVelocity/ScrollVelocity";
import { featuredSkills } from "@/lib/tech-stack";

const skillRows = [
  featuredSkills.slice(0, Math.ceil(featuredSkills.length / 2)),
  featuredSkills.slice(Math.ceil(featuredSkills.length / 2)),
];

function SkillBadge({ name, icon }: { name: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03]
                    px-6 py-3.5 hover:border-[#61DCA3]/40 hover:bg-[#61DCA3]/5
                    transition-all duration-200 cursor-default select-none">
      <div className="w-9 h-9 rounded-lg bg-[#61DCA3]/15 border border-[#61DCA3]/20
                      flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="whitespace-nowrap text-sm font-semibold tracking-[0.03em] text-white/80">{name}</span>
    </div>
  );
}

function SkillLine({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className={`flex gap-4 ${reverse ? "flex-row-reverse" : ""}`}>
      {skillRows[reverse ? 1 : 0].map((skill) => (
        <SkillBadge key={skill.label} name={skill.label} icon={skill.icon} />
      ))}
    </div>
  );
}

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function SkillsTape() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* Pause velocity animation on prefers-reduced-motion */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = (reduced: boolean) =>
      wrapper.style.setProperty("--motion-play", reduced ? "paused" : "running");
    const handleMotionChange = (event: MediaQueryListEvent) => {
      apply(event.matches);
    };

    apply(mq.matches);
    mq.addEventListener("change", handleMotionChange);
    return () => mq.removeEventListener("change", handleMotionChange);
  }, []);

  return (
    <section className="relative z-10 bg-[#0B0F15] py-28 overflow-hidden" id="skills">

      {/* Section heading */}
      <motion.div
        className="mx-auto mb-14 max-w-6xl px-4 sm:px-6 text-center"
        initial="hidden" whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#61DCA3]" />
          <span className="text-xs text-[#61DCA3] font-medium uppercase tracking-widest">Tech Stack</span>
        </div>
        <h2 className="text-4xl font-extrabold text-white tracking-tight">
          Tools I <span className="text-[#61DCA3]">Work With</span>
        </h2>
        <p className="mt-3 text-white/40 text-sm max-w-md mx-auto">
          Core tools I already use, plus a broader stack foundation for what I am exploring next.
        </p>
      </motion.div>

      {/* Scrolling tapes */}
      <div
        ref={wrapperRef}
        className="text-white [&_[style*='translateX']]:![animation-play-state:var(--motion-play,running)]"
      >
        <ScrollVelocity
          texts={[<SkillLine key="row-1" />]}
          velocity={40}
          numCopies={6}
          scrollerClassName="items-center gap-4"
        />
        <div className="mt-4">
          <ScrollVelocity
            texts={[<SkillLine key="row-2" reverse />]}
            velocity={-40}
            numCopies={6}
            scrollerClassName="items-center gap-4"
          />
        </div>
      </div>
    </section>
  );
}

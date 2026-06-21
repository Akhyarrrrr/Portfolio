"use client";

import { motion, type Variants } from "framer-motion";
import ScrollVelocity from "../ScrollVelocity/ScrollVelocity";
import { getTechsByCategory } from "@/lib/tech-stack";

function SkillBadge({ name, icon }: { name: string; icon: React.ReactNode }) {
  return (
    <div
      className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02]
                    px-5 py-3 transition-all duration-300
                    hover:border-[#61DCA3]/30 hover:bg-[#61DCA3]/5
                    hover:shadow-[0_0_20px_rgba(97,220,163,0.04)] cursor-default select-none"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#61DCA3]/10 border border-[#61DCA3]/15 transition-colors group-hover:bg-[#61DCA3]/20">
        {icon ?? (
          <span className="text-[10px] font-bold text-[#61DCA3]">
            {name[0]}
          </span>
        )}
      </div>
      <span className="whitespace-nowrap text-sm font-medium tracking-wide text-white/70 transition-colors group-hover:text-white/90">
        {name}
      </span>
    </div>
  );
}

const categoryList = getTechsByCategory();

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function SkillsTape() {
  return (
    <section
      className="relative z-10 bg-[#0B0F15] pt-28 overflow-hidden"
      id="skills"
    >
      <div className="mx-auto mb-14 max-w-5xl px-4 sm:px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#61DCA3]" />
            <span className="text-xs font-medium uppercase tracking-widest text-[#61DCA3]">
              Tech Stack
            </span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white">
            Tools I <span className="text-[#61DCA3]">Work With</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/40">
            Technologies I use to build production-ready systems end to end.
          </p>
        </motion.div>
      </div>

      {/* Scrolling categorized rows */}
      <div className="space-y-1">
        {categoryList.map(({ category, techs }, catIdx) => {
          const isMobile = category === "Mobile";
          return (
            <div key={category}>
              <ScrollVelocity
                texts={[
                  <div key={category} className="flex gap-5 px-2">
                    {techs.map((tech) => (
                      <SkillBadge
                        key={tech.label}
                        name={tech.label}
                        icon={tech.icon}
                      />
                    ))}
                  </div>,
                ]}
                velocity={catIdx % 2 === 0 ? 30 : -25}
                numCopies={isMobile ? 8 : 3}
                scrollerClassName="items-center"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

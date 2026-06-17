"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { FaReact, FaHtml5, FaCss3Alt, FaGithub } from "react-icons/fa";
import {
  SiTailwindcss, SiJavascript, SiTypescript, SiNextdotjs,
  SiMysql, SiFirebase, SiExpo, SiKotlin, SiLaravel,
  SiExpress, SiDocker, SiLinux, SiSupabase, SiVercel, SiPostgresql,
} from "react-icons/si";
import ScrollVelocity from "./components/ScrollVelocity/ScrollVelocity";

const skills = [
  { name: "JavaScript",   icon: <SiJavascript  className="text-white w-6 h-6" /> },
  { name: "TypeScript",   icon: <SiTypescript  className="text-white w-6 h-6" /> },
  { name: "HTML5",        icon: <FaHtml5       className="text-white w-6 h-6" /> },
  { name: "CSS3",         icon: <FaCss3Alt     className="text-white w-6 h-6" /> },
  { name: "React",        icon: <FaReact       className="text-white w-6 h-6" /> },
  { name: "Tailwind",     icon: <SiTailwindcss className="text-white w-6 h-6" /> },
  { name: "GitHub",       icon: <FaGithub      className="text-white w-6 h-6" /> },
  { name: "Next.js",      icon: <SiNextdotjs   className="text-white w-6 h-6" /> },
  { name: "MySQL",        icon: <SiMysql       className="text-white w-6 h-6" /> },
  { name: "Firebase",     icon: <SiFirebase    className="text-white w-6 h-6" /> },
  { name: "Expo",         icon: <SiExpo        className="text-white w-6 h-6" /> },
  { name: "Kotlin",       icon: <SiKotlin      className="text-white w-6 h-6" /> },
  { name: "Laravel",      icon: <SiLaravel     className="text-white w-6 h-6" /> },
  { name: "Express.js",   icon: <SiExpress     className="text-white w-6 h-6" /> },
  { name: "React Native", icon: <FaReact       className="text-white w-6 h-6" /> },
  { name: "Docker",       icon: <SiDocker      className="text-white w-6 h-6" /> },
  { name: "Linux",        icon: <SiLinux       className="text-white w-6 h-6" /> },
  { name: "Supabase",     icon: <SiSupabase    className="text-white w-6 h-6" /> },
  { name: "Vercel",       icon: <SiVercel      className="text-white w-6 h-6" /> },
  { name: "PostgreSQL",   icon: <SiPostgresql  className="text-white w-6 h-6" /> },
  
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
      {skills.map((s) => <SkillBadge key={s.name} name={s.name} icon={s.icon} />)}
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
    apply(mq.matches);
    mq.addEventListener("change", (e) => apply(e.matches));
    return () => mq.removeEventListener("change", (e) => apply(e.matches));
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
          Technologies I use to build, ship, and scale production systems.
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

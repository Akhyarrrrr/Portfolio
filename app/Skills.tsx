"use client";

import { useEffect, useRef } from "react";
import { FaReact, FaHtml5, FaCss3Alt, FaGithub } from "react-icons/fa";
import {
  SiTailwindcss,
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiMysql,
  SiFirebase,
  SiExpo,
  SiKotlin,
  SiLaravel,
  SiExpress,
  SiDocker,
  SiLinux,
  SiSupabase,
  SiVercel,
  SiPostgresql,
} from "react-icons/si";
import ScrollVelocity from "./components/ScrollVelocity/ScrollVelocity";

const skills = [
  { name: "JavaScript",    icon: <SiJavascript   className="text-white w-7 h-7" /> },
  { name: "TypeScript",    icon: <SiTypescript   className="text-white w-7 h-7" /> },
  { name: "HTML5",         icon: <FaHtml5        className="text-white w-7 h-7" /> },
  { name: "CSS3",          icon: <FaCss3Alt      className="text-white w-7 h-7" /> },
  { name: "React",         icon: <FaReact        className="text-white w-7 h-7" /> },
  { name: "Tailwind",      icon: <SiTailwindcss  className="text-white w-7 h-7" /> },
  { name: "GitHub",        icon: <FaGithub       className="text-white w-7 h-7" /> },
  { name: "Next.js",       icon: <SiNextdotjs    className="text-white w-7 h-7" /> },
  { name: "MySQL",         icon: <SiMysql        className="text-white w-7 h-7" /> },
  { name: "Firebase",      icon: <SiFirebase     className="text-white w-7 h-7" /> },
  { name: "Expo",          icon: <SiExpo         className="text-white w-7 h-7" /> },
  { name: "Kotlin",        icon: <SiKotlin       className="text-white w-7 h-7" /> },
  { name: "Laravel",       icon: <SiLaravel      className="text-white w-7 h-7" /> },
  { name: "Express.js",    icon: <SiExpress      className="text-white w-7 h-7" /> },
  { name: "React Native",  icon: <FaReact        className="text-white w-7 h-7" /> },
  { name: "Docker",        icon: <SiDocker       className="text-white w-7 h-7" /> },
  { name: "Linux",         icon: <SiLinux        className="text-white w-7 h-7" /> },
  { name: "Supabase",      icon: <SiSupabase     className="text-white w-7 h-7" /> },
  { name: "Vercel",        icon: <SiVercel       className="text-white w-7 h-7" /> },
  { name: "PostgreSQL",    icon: <SiPostgresql   className="text-white w-7 h-7" /> },
];

function SkillBadge({ name, icon }: { name: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 border border-gray-600 rounded-md px-6 py-4 hover:bg-[#61DCA3]/20 transition-colors duration-300 cursor-default">
      <div className="w-10 h-10 bg-[#61DCA3] rounded flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="font-bold text-xl whitespace-nowrap">{name}</span>
    </div>
  );
}

function SkillLine({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className={`flex gap-6 ${reverse ? "flex-row-reverse" : ""}`}>
      {skills.map((skill) => (
        <SkillBadge key={skill.name} name={skill.name} icon={skill.icon} />
      ))}
    </div>
  );
}

export default function SkillsTape() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  /**
   * Pause ScrollVelocity's RAF-driven animation when reduced motion is
   * preferred. We inject a CSS class that sets animation-play-state and
   * pointer-events on all motion.div children.
   */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = (reduced: boolean) => {
      wrapper.style.setProperty("--motion-play", reduced ? "paused" : "running");
    };
    apply(mq.matches);
    mq.addEventListener("change", (e) => apply(e.matches));
    return () => mq.removeEventListener("change", (e) => apply(e.matches));
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="bg-[#0B0F15] text-white [&_[style*='translateX']]:![animation-play-state:var(--motion-play,running)]"
    >
      <ScrollVelocity
        texts={[<SkillLine key="row-1" />]}
        velocity={50}
        numCopies={6}
        scrollerClassName="items-center gap-6"
      />
      <ScrollVelocity
        texts={[<SkillLine key="row-2" reverse />]}
        velocity={-50}
        numCopies={6}
        scrollerClassName="items-center gap-6"
      />
    </div>
  );
}

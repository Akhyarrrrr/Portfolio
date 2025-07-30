"use client";

import { FaReact, FaHtml5, FaCss3Alt, FaGithub } from "react-icons/fa";
import {
  SiTailwindcss,
  SiJavascript,
  SiNextdotjs,
  SiMysql,
  SiFirebase,
  SiExpo,
  SiKotlin,
  SiLaravel,
  SiExpress,
  SiDocker,
  SiLinux,
} from "react-icons/si";
import ScrollVelocity from "../components/ScrollVelocity/ScrollVelocity";

const skills = [
  {
    name: "JavaScript",
    iconText: <SiJavascript className="text-white w-7 h-7" />,
  },
  { name: "HTML5", iconText: <FaHtml5 className="text-white w-7 h-7" /> },
  { name: "CSS3", iconText: <FaCss3Alt className="text-white w-7 h-7" /> },
  { name: "React", iconText: <FaReact className="text-white w-7 h-7" /> },
  {
    name: "Tailwind",
    iconText: <SiTailwindcss className="text-white w-7 h-7" />,
  },
  { name: "GitHub", iconText: <FaGithub className="text-white w-7 h-7" /> },
  { name: "Next.js", iconText: <SiNextdotjs className="text-white w-7 h-7" /> },
  { name: "MySQL", iconText: <SiMysql className="text-white w-7 h-7" /> },
  { name: "Firebase", iconText: <SiFirebase className="text-white w-7 h-7" /> },
  { name: "Expo", iconText: <SiExpo className="text-white w-7 h-7" /> },
  { name: "Kotlin", iconText: <SiKotlin className="text-white w-7 h-7" /> },
  { name: "Laravel", iconText: <SiLaravel className="text-white w-7 h-7" /> },
  {
    name: "Express.js",
    iconText: <SiExpress className="text-white w-7 h-7" />,
  },
  {
    name: "React Native",
    iconText: <FaReact className="text-white w-7 h-7" />,
  },
  { name: "Docker", iconText: <SiDocker className="text-white w-7 h-7" /> },
  { name: "Linux", iconText: <SiLinux className="text-white w-7 h-7" /> },
];

function SkillLine({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className={`flex gap-6 ${reverse ? "flex-row-reverse" : ""}`}>
      {skills.map((skill, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border border-gray-600 rounded-md px-6 py-4  hover:bg-[#61DCA3]/20 transition-all duration-300"
        >
          <div className="w-10 h-10 bg-[#61DCA3] rounded flex items-center justify-center">
            {skill.iconText}
          </div>
          <span className="font-bold text-xl">{skill.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function SkillsTape() {
  return (
    <div className="bg-[#0B0F15]">
      {/* Line 1: kiri ke kanan */}
      <ScrollVelocity
        texts={[<SkillLine key="1" />]}
        velocity={50}
        numCopies={6}
        scrollerClassName="items-center gap-6"
      />

      {/* Line 2: kanan ke kiri */}
      <ScrollVelocity
        texts={[<SkillLine key="2" reverse />]}
        velocity={-50}
        numCopies={6}
        scrollerClassName="items-center gap-6"
      />
    </div>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Code2, Users, Zap } from "lucide-react";
import { useLanguage } from "../context/LanguageProvider";

const aboutData = {
  en: {
    heading: "About Me",
    intro:
      "Full-stack engineer based in Banda Aceh, building production systems that actually ship.",
    mission:
      "I care deeply about code quality, real-world impact, and working with teams that move fast.",
    highlights: [
      {
        icon: Code2,
        title: "Ship Production Code",
        desc: "I do not stop at prototypes. From 90+ journals to AI-powered attendance systems, I build things people can use.",
      },
      {
        icon: Zap,
        title: "Full-Stack Expertise",
        desc: "Frontend focus with React and Next.js, strong backend with Node.js and Express, plus DevOps discipline with Docker and CI/CD.",
      },
      {
        icon: Users,
        title: "Team Player",
        desc: "Led a department of 13, mentored 44 students, and collaborated cross-functionally on shipped products.",
      },
      {
        icon: Briefcase,
        title: "Enterprise Experience",
        desc: "Managing production infrastructure for 90+ journals, incident response, backups, monitoring, and platform migrations.",
      },
    ],
    stats: [
      { label: "Years Experience", value: "2+" },
      { label: "Projects Shipped", value: "6+" },
      { label: "Tech Stack Items", value: "30+" },
      { label: "Students Mentored", value: "44" },
    ],
    cta: "Interested in working together? Let me know.",
  },
  id: {
    heading: "Tentang Saya",
    intro:
      "Full-stack engineer dari Banda Aceh, membangun production systems yang benar-benar jadi.",
    mission:
      "Aku peduli banget sama code quality, real-world impact, dan kerja sama dengan team yang bergerak cepat.",
    highlights: [
      {
        icon: Code2,
        title: "Ship Production Code",
        desc: "Aku tidak berhenti di prototype. Dari 90+ jurnal sampai AI-powered attendance systems, aku build produk yang benar-benar bisa dipakai.",
      },
      {
        icon: Zap,
        title: "Full-Stack Expertise",
        desc: "Frontend focus dengan React dan Next.js, backend kuat dengan Node.js dan Express, plus DevOps discipline dengan Docker dan CI/CD.",
      },
      {
        icon: Users,
        title: "Team Player",
        desc: "Pernah memimpin department berisi 13 orang, mentor 44 mahasiswa, dan kolaborasi lintas fungsi di produk yang shipped.",
      },
      {
        icon: Briefcase,
        title: "Enterprise Experience",
        desc: "Manage production infrastructure untuk 90+ jurnal, incident response, backup, monitoring, dan platform migration.",
      },
    ],
    stats: [
      { label: "Tahun Experience", value: "2+" },
      { label: "Projects Shipped", value: "6+" },
      { label: "Tech Stack Items", value: "30+" },
      { label: "Mahasiswa Mentored", value: "44" },
    ],
    cta: "Tertarik bekerja sama? Beri tahu aku.",
  },
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function About() {
  const { lang } = useLanguage();
  const data = aboutData[lang];

  return (
    <section
      className="relative z-10 w-full bg-[#0B0F15] px-4 py-24 md:px-16 lg:px-32"
      id="about"
    >
      <motion.div
        className="mx-auto max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div className="mb-16 text-center" variants={itemVariants}>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            {data.heading}
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto text-sm">
            {data.intro} {data.mission}
          </p>
        </motion.div>

        <motion.div
          className="mb-16 grid gap-8 md:grid-cols-2"
          variants={containerVariants}
        >
          {data.highlights.map((item) => {
            const IconComponent = item.icon;

            return (
              <motion.div
                key={item.title}
                className="rounded-xl border border-[#61DCA3]/30 bg-gradient-to-br from-[#61DCA3]/5 to-transparent p-6 transition-all duration-300 hover:border-[#61DCA3]/60"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <IconComponent className="mb-4 h-8 w-8 text-[#61DCA3]" />
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="mb-16 grid grid-cols-2 gap-6 border-y border-[#61DCA3]/20 py-12 md:grid-cols-4"
          variants={containerVariants}
        >
          {data.stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center"
              variants={itemVariants}
            >
              <div className="mb-2 text-3xl font-bold text-[#61DCA3] md:text-4xl">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="text-center" variants={itemVariants}>
          <p className="mb-6 text-gray-300">{data.cta}</p>
          <a
            href="#contact"
            className="inline-block rounded-lg border border-[#61DCA3] px-8 py-3 font-semibold text-[#61DCA3] transition duration-300 hover:bg-[#61DCA3] hover:text-black cursor-pointer"
          >
            {lang === "en" ? "Get in Touch" : "Hubungi Saya"}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

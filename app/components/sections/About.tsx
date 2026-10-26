"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Briefcase, Code2, Users, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";
import { fadeUpMajor, fadeMicro } from "@/lib/motion";
import { profile } from "@/content/profile";

const aboutData = {
  en: {
    heading: "About Me",
    badge: "Who I am",
    intro: profile.summary.en,
    highlights: [
      { icon: Code2, title: "From Idea to Product", desc: "I work across interfaces, APIs, databases, and deployment. Gilir brings that together in a multi-tenant SaaS with per-shop subdomains, live queues, themes, and payments." },
      { icon: Zap, title: "AI-Assisted Development", desc: "I direct coding agents through planning and context, then review code and verify the result. My ML coursework separately covers image classification and sentiment analysis." },
      { icon: Users, title: "Teaching & Collaboration", desc: "I led 16 sessions for 44 Web Programming students and 16 sessions for 41 Software Engineering students, alongside practical DevOps labs." },
      { icon: Briefcase, title: "Production Responsibility", desc: "I administer five university publishing VMs and have handled incident recovery, OJS setup, website redesigns, monitoring, and backups." },
    ],
    stats: [
      { label: "Projects", value: 0, suffix: "" },
      { label: "Academic Journals Supported",value: 80, suffix: "+" },
      { label: "Publishing VMs Managed",value: 5, suffix: "" },
    ],
    cta: "Interested in working together?",
    ctaBtn: "Get in Touch",
  },
  id: {
    heading: "Tentang Saya",
    badge: "Siapa saya",
    intro: profile.summary.id,
    highlights: [
      { icon: Code2, title: "Dari Ide Menjadi Produk", desc: "Saya mengerjakan antarmuka, API, database, hingga deployment. Gilir menyatukannya dalam SaaS multi-tenant dengan subdomain per toko, antrean live, tema, dan pembayaran." },
      { icon: Zap, title: "Pengembangan Berbantuan AI", desc: "Saya mengarahkan coding agent melalui perencanaan dan konteks, lalu mereview kode serta memverifikasi hasilnya. Proyek kursus ML saya mencakup klasifikasi gambar dan analisis sentimen." },
      { icon: Users, title: "Mengajar & Kolaborasi", desc: "Saya membimbing 16 sesi untuk 44 mahasiswa Pemrograman Web dan 16 sesi untuk 41 mahasiswa Rekayasa Perangkat Lunak, serta praktikum DevOps." },
      { icon: Briefcase, title: "Tanggung Jawab Produksi", desc: "Saya mengelola lima VM publikasi universitas serta menangani pemulihan insiden, setup OJS, redesign situs, monitoring, dan backup." },
    ],
    stats: [
      { label: "Proyek",                      value: 0, suffix: "" },
      { label: "Jurnal Akademik yang Didukung", value: 80, suffix: "+" },
      { label: "VM Publikasi yang Dikelola", value: 5, suffix: "" },
    ],
    cta: "Tertarik bekerja sama?",
    ctaBtn: "Hubungi Saya",
  },
} as const;

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

export default function About({ projectCount }: { projectCount: number }) {
  const { lang } = useLanguage();
  const data = aboutData[lang];
  const stats = data.stats.map((stat, index) =>
    index === 0 ? { ...stat, value: projectCount, suffix: "" } : stat,
  );
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="relative z-10 w-full bg-[#0B0F15] px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          className="mb-16 text-center"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUpMajor}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#61DCA3]" />
            <span className="text-xs text-[#61DCA3] font-medium uppercase tracking-widest">{data.badge}</span>
          </div>
          <h2 className="font-accent text-4xl font-medium text-white tracking-tight">
            {data.heading}
          </h2>
          <p className="mt-4 text-white/60 max-w-3xl mx-auto text-sm leading-relaxed">
            {data.intro}
          </p>
          <p className="mt-4 text-white/60 max-w-3xl mx-auto text-sm leading-relaxed">
            {profile.availability[lang]}
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >

        {/* Highlight cards */}
        <motion.div className="mb-16 grid gap-5 md:grid-cols-2" variants={container}>
          {data.highlights.map((highlight, i) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                // Stable across language switches so entrance motion does not restart.
                key={i}
                className="group rounded-2xl border border-white/8 bg-white/[0.03]
                           p-6 shadow-[0_4px_16px_rgba(0,0,0,0.15)]
                           transition-all duration-300
                           hover:border-[#61DCA3]/40 hover:bg-[#61DCA3]/5
                           hover:shadow-[0_12px_36px_rgba(97,220,163,0.1)]"
                variants={fadeMicro}
                whileHover={{ y: -4 }}
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center
                                rounded-xl bg-[#61DCA3]/10 border border-[#61DCA3]/20
                                group-hover:bg-[#61DCA3]/20 transition-colors duration-300">
                  <Icon className="h-5 w-5 text-[#61DCA3]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{highlight.title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{highlight.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mb-16 grid grid-cols-1 gap-px sm:grid-cols-3
                     rounded-2xl overflow-hidden border border-white/8"
          variants={container}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className={`flex flex-col items-center justify-center py-8 px-4
                          bg-white/[0.02] hover:bg-[#61DCA3]/5 transition-colors duration-300
                          ${i < stats.length - 1 ? "border-r border-white/8 last:border-r-0" : ""}`}
              variants={fadeMicro}
            >
              <div className="text-3xl md:text-4xl font-extrabold text-[#61DCA3] tabular-nums">
                {stat.value}{stat.suffix}
              </div>
              <div className="mt-1 text-xs text-white/40 text-center">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div className="text-center" variants={fadeMicro}>
          <p className="mb-6 text-white/50 text-sm">{data.cta}</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl
                       border border-[#61DCA3]/40 bg-[#61DCA3]/10
                       px-8 py-3 text-sm font-semibold text-[#61DCA3]
                       hover:bg-[#61DCA3] hover:text-black hover:border-[#61DCA3]
                       hover:shadow-[0_0_24px_rgba(97,220,163,0.3)]
                       transition-all duration-200 cursor-pointer"
          >
            {data.ctaBtn}
          </a>
        </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

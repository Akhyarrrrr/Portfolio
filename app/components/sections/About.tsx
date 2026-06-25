"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Briefcase, Code2, Users, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";

/* ─── i18n data ─────────────────────────────────────────────── */
const aboutData = {
  en: {
    heading: "About Me",
    badge: "Who I am",
    intro: "Full-stack engineer based in Banda Aceh, building production systems that actually ship.",
    mission: "I care deeply about code quality, real-world impact, and working with teams that move fast.",
    highlights: [
      { icon: Code2,    title: "Ship Production Code",   desc: "I don't stop at prototypes. From AI-powered job trackers to face-recognition attendance systems, I build things people actually use." },
      { icon: Zap,      title: "Full-Stack Expertise",    desc: "Frontend focus with React and Next.js, strong backend with Node.js and Express, plus infrastructure work with Docker, server administration, and CI/CD." },
      { icon: Users,    title: "Team Player",             desc: "Led 9 work programs as department head, taught 44+ students across three university courses, and collaborated cross-functionally on shipped products." },
      { icon: Briefcase,title: "Production Ownership",    desc: "Hold full server access for a platform running 90+ academic journals, with hands-on experience in incident response, backups, monitoring, and zero-downtime migrations." },
    ],
    stats: [
      { label: "Projects Shipped",     value: 10, suffix: "+" },
      { label: "Journals in Production",value: 90, suffix: "+" },
      { label: "Zero-Downtime Migrations Led",value: 1, suffix: "" },
    ],
    cta: "Interested in working together?",
    ctaBtn: "Get in Touch",
  },
  id: {
    heading: "Tentang Saya",
    badge: "Siapa saya",
    intro: "Full-stack engineer dari Banda Aceh, membangun production systems yang benar-benar jadi.",
    mission: "Aku peduli banget sama code quality, real-world impact, dan kerja sama dengan team yang bergerak cepat.",
    highlights: [
      { icon: Code2,    title: "Ship Production Code",   desc: "Aku gak cuma berhenti di prototype. Dari AI-powered job tracker sampai face-recognition attendance system, aku bikin produk yang beneran dipakai orang." },
      { icon: Zap,      title: "Full-Stack Expertise",    desc: "Frontend focus dengan React dan Next.js, backend kuat dengan Node.js dan Express, plus infrastruktur dengan Docker, server administration, dan CI/CD." },
      { icon: Users,    title: "Team Player",             desc: "Pimpin 9 program kerja sebagai kepala department, ajar 44+ mahasiswa di tiga mata kuliah universitas, dan kolaborasi lintas fungsi di produk yang shipped." },
      { icon: Briefcase,title: "Production Ownership",    desc: "Pegang full server access untuk platform yang menjalankan 90+ jurnal akademik, dengan pengalaman langsung dalam incident response, backup, monitoring, dan zero-downtime migration." },
    ],
    stats: [
      { label: "Projects Shipped",          value: 15, suffix: "+" },
      { label: "Jurnal di Production",      value: 90, suffix: "+" },
      { label: "Zero-Downtime Migrations",  value: 1,  suffix: ""  },
    ],
    cta: "Tertarik bekerja sama?",
    ctaBtn: "Hubungi Saya",
  },
} as const;

/* ─── Animated counter ──────────────────────────────────────── */
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref  = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    // Respect reduced-motion — skip animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return;
    }
    let start = 0;
    const duration = 500;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Framer variants ───────────────────────────────────────── */
const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden:   { opacity: 0, y: 24 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ─── Component ─────────────────────────────────────────────── */
export default function About() {
  const { lang } = useLanguage();
  const data = aboutData[lang];

  return (
    <section
      id="about"
      className="relative z-10 w-full bg-[#0B0F15] px-4 py-24 sm:px-6"
    >
      <motion.div
        className="mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={container}
      >
        {/* Heading */}
        <motion.div className="mb-16 text-center" variants={item}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#61DCA3]" />
            <span className="text-xs text-[#61DCA3] font-medium uppercase tracking-widest">{data.badge}</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            {data.heading}
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
            {data.intro}{" "}{data.mission}
          </p>
        </motion.div>

        {/* Highlight cards */}
        <motion.div className="mb-16 grid gap-5 md:grid-cols-2" variants={container}>
          {data.highlights.map((highlight) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                key={highlight.title}
                className="group rounded-2xl border border-white/8 bg-white/[0.03]
                           p-6 transition-all duration-300
                           hover:border-[#61DCA3]/40 hover:bg-[#61DCA3]/5
                           hover:shadow-[0_0_30px_rgba(97,220,163,0.06)]"
                variants={item}
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
          {data.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`flex flex-col items-center justify-center py-8 px-4
                          bg-white/[0.02] hover:bg-[#61DCA3]/5 transition-colors duration-300
                          ${i < data.stats.length - 1 ? "border-r border-white/8 last:border-r-0" : ""}`}
              variants={item}
            >
              <div className="text-3xl md:text-4xl font-extrabold text-[#61DCA3] tabular-nums">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-xs text-white/40 text-center">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div className="text-center" variants={item}>
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
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { Briefcase, Code2, Users, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";
import { fadeUpMajor, fadeMicro } from "@/lib/motion";

/* ─── i18n data ─────────────────────────────────────────────── */
const aboutData = {
  en: {
    heading: "About Me",
    badge: "Who I am",
    intro: "Software Engineer based in Banda Aceh, Indonesia (UTC+7), focused on full-stack products and production systems.",
    mission: "I take ownership across interfaces, APIs, databases, deployment, monitoring, and incident response.",
    highlights: [
      { icon: Code2,    title: "Product Delivery",       desc: "I turn scoped requirements into review-ready interfaces, server routes, data changes, staging releases, and documented limitations." },
      { icon: Zap,      title: "Full-Stack Systems",     desc: "I work with TypeScript, Next.js, Node.js, PostgreSQL, and supporting infrastructure across the product lifecycle." },
      { icon: Users,    title: "Teaching & Collaboration", desc: "I taught 85 students across 32 Web Programming and Software Engineering sessions and guided practical DevOps labs." },
      { icon: Briefcase,title: "Production Ownership",   desc: "I operate a university publishing platform supporting 80+ active journals, including monitoring, backups, security response, and migration work." },
    ],
    stats: [
      { label: "Selected Projects", value: 0, suffix: "" },
      { label: "Active Journals Supported",value: 80, suffix: "+" },
      { label: "Teaching Sessions",value: 32, suffix: "" },
    ],
    cta: "Interested in working together?",
    ctaBtn: "Get in Touch",
  },
  id: {
    heading: "Tentang Saya",
    badge: "Siapa saya",
    intro: "Saya Software Engineer dari Banda Aceh, Indonesia (UTC+7), dengan fokus pada produk full-stack dan sistem produksi.",
    mission: "Saya menangani antarmuka, API, database, deployment, monitoring, dan incident response secara end-to-end.",
    highlights: [
      { icon: Code2,    title: "Delivery Produk",          desc: "Saya menerjemahkan scope menjadi antarmuka, server route, perubahan data, staging, hasil siap review, dan batasan yang terdokumentasi." },
      { icon: Zap,      title: "Sistem Full-Stack",        desc: "Saya bekerja dengan TypeScript, Next.js, Node.js, PostgreSQL, dan infrastruktur pendukung sepanjang siklus produk." },
      { icon: Users,    title: "Mengajar & Kolaborasi",    desc: "Saya mengajar 85 mahasiswa dalam 32 sesi Pemrograman Web dan Rekayasa Perangkat Lunak serta membimbing praktikum DevOps." },
      { icon: Briefcase,title: "Tanggung Jawab Produksi",  desc: "Saya mengoperasikan platform publikasi universitas untuk 80+ jurnal aktif, termasuk monitoring, backup, respons keamanan, dan migrasi." },
    ],
    stats: [
      { label: "Proyek Terpilih",             value: 0, suffix: "" },
      { label: "Jurnal Aktif yang Didukung",  value: 80, suffix: "+" },
      { label: "Sesi Mengajar",               value: 32, suffix: "" },
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
// Container still staggers its children's *entrance timing* — only the
// per-child motion itself (now fadeMicro) got quieter.
const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

/* ─── Component ─────────────────────────────────────────────── */
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
          <p className="mt-4 text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
            {data.intro}{" "}{data.mission}
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
                // Index, not highlight.title — same class of bug as the
                // stats row below: these titles happen to be identical
                // in EN/ID right now, but keying on translated text is
                // fragile the moment that changes. Array order is
                // stable across languages.
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
              // Index, not stat.label — the label text differs between
              // EN/ID for 2 of 3 stats ("Journals in Production" vs
              // "Jurnal di Production"), so keying on it caused React to
              // unmount+remount on every language switch. The remounted
              // element then rendered at its animation's hidden state
              // and never got told to animate in, since the parent's
              // whileInView already fired once (once: true) — the stat
              // was stuck invisible. The array order is stable across
              // languages, so the index is a safe, stable identity here.
              key={i}
              className={`flex flex-col items-center justify-center py-8 px-4
                          bg-white/[0.02] hover:bg-[#61DCA3]/5 transition-colors duration-300
                          ${i < stats.length - 1 ? "border-r border-white/8 last:border-r-0" : ""}`}
              variants={fadeMicro}
            >
              <div className="text-3xl md:text-4xl font-extrabold text-[#61DCA3] tabular-nums">
                <Counter target={stat.value} suffix={stat.suffix} />
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

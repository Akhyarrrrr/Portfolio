"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Github,
  Globe,
  MonitorSmartphone,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageProvider";
import type { ProjectType } from "@/lib/content";
import { fadeUpMajor, fadeMicro } from "@/lib/motion";
import {
  getTechDisplayLabel,
  getTechMeta,
  getFallbackTechIcon,
} from "@/lib/tech-stack";

// ── helpers ───────────────────────────────────────────────────

const fadeUpStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

function localField(project: ProjectType, field: string, lang: "en" | "id") {
  const localized = (project as unknown as Record<string, unknown>)[`${field}_${lang}`] as string | undefined;
  const english = (project as unknown as Record<string, unknown>)[field] as string | undefined;
  return localized ?? english ?? undefined;
}

function titleLocal(project: ProjectType, lang: "en" | "id") {
  return localField(project, "title", lang) || project.title || "";
}

function descLocal(project: ProjectType, lang: "en" | "id") {
  return localField(project, "desc", lang) || project.description || "";
}

function getHref(project: ProjectType) {
  return project.liveUrl || project.githubUrl || project.href || undefined;
}

function getGithubHref(project: ProjectType) {
  return project.githubUrl || project.href || undefined;
}

// ── Tech badge ─────────────────────────────────────────────────

function TechBadge({ tech }: { tech: string }) {
  const meta = getTechMeta(tech);
  const label = getTechDisplayLabel(tech);
  return (
    <span
      title={label}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 text-sm text-white/90"
    >
      {meta?.icon ?? getFallbackTechIcon(tech)}
      <span className="text-xs font-medium">{label}</span>
    </span>
  );
}

// ── Section wrapper ────────────────────────────────────────────

function CaseStudySection({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUpMajor}
      className={`mb-16 ${className}`}
    >
      <div className="flex items-start gap-4">
        {/* Left accent bar */}
        <div className="mt-1.5 h-6 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#61DCA3] to-[#3dd68c]" />
        <div>
          <h2 className="font-accent mb-4 text-2xl font-medium text-white tracking-tight md:text-3xl">
            {title}
          </h2>
          <div className="text-base leading-relaxed text-white/60">{children}</div>
        </div>
      </div>
    </motion.section>
  );
}

// ── Main component ─────────────────────────────────────────────

export default function ProjectDetailClient({
  project,
  relatedProjects,
  onProjectSelect,
  onClose,
}: {
  project: ProjectType;
  relatedProjects: ProjectType[];
  onProjectSelect?: (slug: string) => void;
  onClose?: () => void;
}) {
  const { lang } = useLanguage();
  const isId = lang === "id";
  const reduceMotion = useReducedMotion();

  const t = {
    back: isId ? "Kembali ke Portfolio" : "Back to Portfolio",
    problem: isId ? "Apa yang rusak?" : "What was broken?",
    solution: isId ? "Bagaimana saya memperbaikinya" : "How I fixed it",
    techRationale: isId ? "Stack yang mengirimkannya" : "The stack that shipped it",
    impact: isId ? "Apa yang berubah" : "What changed",
    features: isId ? "Yang bisa dilakukan" : "What it can do",
    learnings: isId ? "Yang saya pelajari" : "What I learned",
    related: isId ? "Proyek lainnya" : "Other projects",
    viewLive: isId ? "Lihat Live" : "View Live",
    viewSource: isId ? "Lihat Source" : "View Source",
    year: isId ? "Tahun" : "Year",
    duration: isId ? "Durasi" : "Duration",
    role: isId ? "Peran saya" : "My role",
    featured: isId ? "Unggulan" : "Featured",
  };

  const problem = localField(project, "problemStatement", lang);
  const solution = localField(project, "solutionApproach", lang);
  const impact = localField(project, "impact", lang);
  const techRationale = localField(project, "techRationale", lang);
  const learnings = localField(project, "learnings", lang);
  const features = project.keyFeatures;
  const screenshots = project.screenshots;
  const techList = (project.tech ?? []).filter(Boolean);

  const href = getHref(project);
  const githubHref = getGithubHref(project);

  return (
    <div className="relative min-h-[100dvh] bg-[#0B0F15]">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(97,220,163,0.04),transparent_50%)]"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-28 sm:px-6 lg:py-32">
        {/* Back link */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="mb-10 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:border-[#61DCA3]/40 hover:text-white cursor-pointer"
            >
              <ArrowLeft size={16} />
              {t.back}
            </button>
          ) : (
            <Link
              href="/#project"
              className="mb-10 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:border-[#61DCA3]/40 hover:text-white"
            >
              <ArrowLeft size={16} />
              {t.back}
            </Link>
          )}
        </motion.div>

        {/* ── Hero ────────────────────────────────────────────── */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={fadeUpStagger}
          className="mb-16"
        >
          {/* Badge row */}
          <motion.div variants={fadeUpMajor} className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-3 py-1 text-xs font-medium text-[#61DCA3]">
              {project.category === "mobile" ? (
                <>
                  <MonitorSmartphone size={14} />
                  Mobile
                </>
              ) : (
                <>
                  <Globe size={14} />
                  Web
                </>
              )}
            </span>
            {project.pinned && (
              <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-400">
                {t.featured}
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUpMajor}
            className="font-accent mb-4 text-4xl font-medium tracking-tight text-white md:text-5xl"
          >
            {titleLocal(project, lang)}
          </motion.h1>

          {/* Meta row */}
          <motion.div
            variants={fadeUpMajor}
            className="mb-5 flex flex-wrap items-center gap-4 text-sm text-white/40"
          >
            {project.year && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} /> {project.year}
              </span>
            )}
            {project.duration && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} /> {project.duration}
              </span>
            )}
            {project.role && (
              <span className="inline-flex items-center gap-1.5">
                <UserCheck size={14} /> {project.role}
              </span>
            )}
          </motion.div>

          {/* Tagline / short desc */}
          <motion.p variants={fadeUpMajor} className="mb-6 max-w-2xl text-lg leading-relaxed text-white/60">
            {descLocal(project, lang)}
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeUpMajor} className="mb-8 flex flex-wrap gap-3">
            {href && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#61DCA3] px-6 py-3 text-sm font-semibold text-[#0B0F15] shadow-[0_0_20px_rgba(97,220,163,0.3)] transition hover:bg-[#4ecf96] hover:shadow-[0_0_32px_rgba(97,220,163,0.5)]"
              >
                <Globe size={16} /> {t.viewLive}
              </a>
            )}
            {githubHref && (
              <a
                href={githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-[#61DCA3]/40 hover:text-white"
              >
                <Github size={16} /> {t.viewSource}
              </a>
            )}
          </motion.div>

          {/* Tech badges */}
          <motion.div variants={fadeUpMajor} className="mb-8 flex flex-wrap gap-2">
            {techList.map((tech, i) => (
              <TechBadge key={`${project.id}-hero-t-${i}`} tech={tech} />
            ))}
          </motion.div>

          {/* Hero image */}
          <motion.div variants={fadeUpMajor}>
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/8 shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
              <Image
                src={project.imageUrl}
                alt={titleLocal(project, lang)}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </motion.div>

        {/* ── Problem ─────────────────────────────────────────── */}
        {problem && <CaseStudySection title={t.problem}>{problem}</CaseStudySection>}

        {/* ── Solution ────────────────────────────────────────── */}
        {solution && <CaseStudySection title={t.solution}>{solution}</CaseStudySection>}

        {/* ── Key Features ────────────────────────────────────── */}
        {features && features.length > 0 && (
          <CaseStudySection title={t.features}>
            <motion.ul
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUpStagger}
              className="grid gap-3 sm:grid-cols-2"
            >
              {features.map((feat, i) => (
                <motion.li
                  key={i}
                  variants={fadeMicro}
                  className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#61DCA3]/20 text-xs text-[#61DCA3]">
                    <Check size={13} />
                  </span>
                  <span className="text-sm text-white/70">{feat}</span>
                </motion.li>
              ))}
            </motion.ul>
          </CaseStudySection>
        )}

        {/* ── Screenshot gallery ──────────────────────────────── */}
        {screenshots && screenshots.length > 0 && (
          <motion.section
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUpMajor}
            className="mb-16"
          >
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
              {screenshots.map((url, i) => (
                <div
                  key={i}
                  className="relative aspect-video w-[85vw] max-w-md shrink-0 snap-center overflow-hidden rounded-xl border border-white/8 shadow-lg sm:w-72"
                >
                  <Image
                    src={url}
                    alt={`Screenshot ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 85vw, 288px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Tech Rationale ──────────────────────────────────── */}
        {techRationale && <CaseStudySection title={t.techRationale}>{techRationale}</CaseStudySection>}

        {/* ── Impact ──────────────────────────────────────────── */}
        {impact && <CaseStudySection title={t.impact}>{impact}</CaseStudySection>}

        {/* ── Learnings ───────────────────────────────────────── */}
        {learnings && <CaseStudySection title={t.learnings}>{learnings}</CaseStudySection>}

        {/* ── Related Projects ────────────────────────────────── */}
        {relatedProjects.length > 0 && (
          <motion.section
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUpMajor}
            className="mt-20 border-t border-white/8 pt-16"
          >
            <h2 className="mb-8 text-2xl font-extrabold text-white tracking-tight">
              {t.related}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((rp) => {
                const isExternal = !rp.slug;
                const linkHref = rp.slug ? `/projects/${rp.slug}` : (rp.liveUrl || rp.githubUrl || rp.href || "#");
                const Comp = isExternal ? "a" : (
                  onProjectSelect
                    ? ({ children: c }: { children: React.ReactNode }) => (
                        <button
                          type="button"
                          className="text-left w-full"
                          onClick={() => onProjectSelect(rp.slug)}
                        >
                          {c}
                        </button>
                      )
                    : ({ children: c }: { children: React.ReactNode }) => (
                        <Link href={linkHref}>
                          {c}
                        </Link>
                      )
                );
                const linkProps = isExternal
                  ? { href: linkHref, target: "_blank", rel: "noopener noreferrer" }
                  : {};
                return (
                  <Comp
                    key={rp.id}
                    {...linkProps}
                    className="group rounded-2xl border border-white/8 bg-white/[0.02] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#61DCA3]/30 hover:bg-white/[0.04] hover:shadow-[0_12px_32px_rgba(97,220,163,0.08)]"
                  >
                    <div className="relative mb-4 h-32 w-full overflow-hidden rounded-xl">
                      <Image
                        src={rp.imageUrl}
                        alt={rp.title_en || rp.title || ""}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="mb-1 text-base font-semibold text-white group-hover:text-[#61DCA3] transition-colors">
                      {titleLocal(rp, lang)}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-white/40">
                      {isExternal ? <ExternalLink size={12} /> : null}
                      <span>{rp.category}</span>
                    </div>
                  </Comp>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Bottom spacer */}
        <div className="h-16" />
      </div>
    </div>
  );
}

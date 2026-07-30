"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ExternalLink, GithubIcon, Pin } from "lucide-react";
import { useLanguage, RichText } from "@/context/LanguageProvider";
import type { ProjectType } from "@/lib/content";
import {
  getFallbackTechIcon,
  getTechDisplayLabel,
  getTechMeta,
} from "@/lib/tech-stack";

type ProjectCategoryFilter = "all" | "web" | "mobile";
type ProjectLanguage = "en" | "id";

const PROJECT_FILTERS: ProjectCategoryFilter[] = ["all", "web", "mobile"];

const SkeletonCard = () => (
  <div className="flex h-[22rem] w-[20rem] flex-col rounded-xl border border-[#61DCA3]/50 bg-black p-4 animate-pulse">
    <div className="mb-2 h-5 w-36 rounded bg-white/10" />
    <div className="mb-1.5 h-3 w-48 rounded bg-white/10" />
    <div className="mb-4 h-3 w-40 rounded bg-white/10" />
    <div className="mb-4 flex gap-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-7 w-7 rounded-lg bg-white/10" />
      ))}
    </div>
    <div className="mt-auto h-40 w-full rounded-lg bg-white/10" />
  </div>
);

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const projectGrid: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.08,
    },
  },
};

const projectCard: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

function TechBadge({ tech }: { tech: string }) {
  const meta = getTechMeta(tech);
  const label = getTechDisplayLabel(tech);

  return (
    <span
      title={label}
      className="inline-flex h-7 min-w-7 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-1.5 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
    >
      {meta?.icon ?? getFallbackTechIcon(tech)}
    </span>
  );
}

function MoreTechBadge({
  count,
  hiddenTech,
}: {
  count: number;
  hiddenTech: string[];
}) {
  return (
    <span
      title={hiddenTech.join(", ")}
      className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg border border-[#61DCA3]/20 bg-[#61DCA3]/10 px-1.5 text-[10px] font-semibold text-[#61DCA3]"
    >
      +{count}
    </span>
  );
}

function getLocalizedProjectCopy(project: ProjectType, lang: ProjectLanguage) {
  const localized = project as unknown as Record<string, unknown>;

  return {
    title:
      (localized[`title_${lang}`] as string | undefined) ??
      project.title_en ??
      project.title ??
      "",
    description:
      (localized[`desc_${lang}`] as string | undefined) ??
      project.desc_en ??
      project.description ??
      "",
  };
}

function sortProjects(projects: ProjectType[], filter: ProjectCategoryFilter) {
  const filtered =
    filter === "all"
      ? projects
      : projects.filter((project) => project.category === filter);

  const pinned = filtered
    .filter((project) => project.pinned ?? false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const unpinned = filtered
    .filter((project) => !(project.pinned ?? false))
    .sort((a, b) =>
      (a.title ?? a.title_en ?? "").localeCompare(b.title ?? b.title_en ?? ""),
    );

  return [...pinned, ...unpinned];
}

export default function Project({
  projects: initialProjects,
  onSelectProject,
}: {
  projects: ProjectType[];
  onSelectProject?: (slug: string) => void;
}) {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<ProjectCategoryFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [projects] = useState<ProjectType[]>(initialProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setItemsPerPage(width <= 640 ? 3 : width <= 1024 ? 4 : 6);
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const filteredProjects = useMemo(
    () => sortProjects(projects, filter),
    [filter, projects],
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const pageData = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const filterLabel = (category: ProjectCategoryFilter) =>
    category === "all"
      ? t("project.filter_all")
      : category === "web"
        ? t("project.filter_web")
        : t("project.filter_mobile");

  return (
    <section
      id="project"
      className="relative z-10 w-full bg-[#0B0F15] px-4 py-28 sm:px-6"
    >
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          className="mb-12 text-center"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#61DCA3]" />
            <span className="text-xs font-medium uppercase tracking-widest text-[#61DCA3]">
              {lang === "id" ? "Karya Saya" : "My Work"}
            </span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white [&_span]:text-[#61DCA3]">
            <RichText i18nKey="project.heading" />
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/40">
            {t("project.sub")}
          </p>
        </motion.div>

        <motion.div
          className="mb-12 flex flex-wrap justify-center gap-2"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, delay: 0.1 },
            },
          }}
        >
          {PROJECT_FILTERS.map((category) => (
            <button
              key={category}
              onClick={() => {
                setFilter(category);
                setCurrentPage(1);
              }}
              className={`cursor-pointer rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                filter === category
                  ? "bg-[#61DCA3] text-[#0B0F15] shadow-[0_0_16px_rgba(97,220,163,0.35)]"
                  : "border border-white/10 text-white/50 hover:border-[#61DCA3]/40 hover:bg-white/5 hover:text-white"
              }`}
            >
              {filterLabel(category)}
            </button>
          ))}
        </motion.div>

        <motion.div
          key={`${filter}-${currentPage}`}
          className="grid items-start justify-items-center gap-y-[4.5rem] sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-20"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={projectGrid}
        >
          {loading &&
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <motion.div
                key={index}
                variants={projectCard}
                className="flex h-[24rem] w-96 max-w-full items-center justify-center"
              >
                <SkeletonCard />
              </motion.div>
            ))}

          {!loading &&
            pageData.map((project) => {
              const { title, description } = getLocalizedProjectCopy(project, lang);
              const techList = (project.tech ?? []).filter(Boolean);
              const maxVisibleTech = techList.length > 6 ? 5 : 6;
              const visibleTech = techList.slice(0, maxVisibleTech);
              const hiddenTech = techList.slice(maxVisibleTech);

              const detailHref = project.slug ? `/projects/${project.slug}` : null;
              const externalHref = project.liveUrl || project.githubUrl || project.href;
              const githubHref = project.githubUrl || project.href;
              const liveUrl = project.liveUrl;
              const primaryHref = detailHref || externalHref || null;

              const openPrimaryAction = () => {
                if (!primaryHref) return;
                if (onSelectProject && project.slug) {
                  onSelectProject(project.slug);
                  return;
                }
                if (detailHref) {
                  router.push(detailHref);
                } else {
                  window.open(primaryHref, "_blank", "noopener,noreferrer");
                }
              };

              const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
                if ((e.target as HTMLElement).closest("a")) return;
                openPrimaryAction();
              };

              const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.target !== e.currentTarget) return;
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                openPrimaryAction();
              };

              return (
                <motion.div
                  key={project.id}
                  variants={projectCard}
                  className="flex justify-center"
                >
                  <div className="group/card block h-[24rem] w-96 max-w-full [perspective:1000px]">
                    <div
                      role={primaryHref ? "link" : undefined}
                      tabIndex={primaryHref ? 0 : undefined}
                      aria-label={primaryHref ? `${title} details` : undefined}
                      onClick={handleCardClick}
                      onKeyDown={handleCardKeyDown}
                      className={`block h-full w-full ${primaryHref ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#61DCA3]/70" : ""}`}
                    >
                      <div
                        className="relative flex h-full w-[20rem] mx-auto flex-col overflow-hidden rounded-xl
                                      border border-[#61DCA3]/40 bg-black p-4
                                      shadow-[0_8px_30px_rgba(0,0,0,0.4)]
                                      transition-all duration-500 ease-out
                                      [transform-style:preserve-3d]
                                      group-hover/card:[transform:rotateX(3deg)_rotateY(-3deg)]
                                      group-hover/card:border-[#61DCA3]/80
                                      group-hover/card:shadow-[0_0_30px_rgba(97,220,163,0.15),0_16px_48px_rgba(0,0,0,0.5)]"
                      >
                        {/* Badges */}
                        <div className="absolute top-3 left-3 right-3 z-10 flex justify-between">
                          <div className="flex gap-2">
                            {detailHref && (
                              <span className="rounded-full border border-[#61DCA3]/20 bg-[#61DCA3]/10 px-2 py-0.5 text-[10px] font-semibold text-[#61DCA3]">
                                Case Study
                              </span>
                            )}
                          </div>
                          {project.pinned && (
                            <span className="flex items-center gap-1 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/15 px-2 py-0.5 text-[10px] font-semibold text-[#61DCA3]">
                              <Pin size={10} />
                              Featured
                            </span>
                          )}
                        </div>

                        <h3 className="mt-6 mb-1.5 line-clamp-1 text-base font-bold leading-6 text-slate-100">
                          {title}
                        </h3>
                        <p className="mb-3 line-clamp-2 text-xs leading-5 text-slate-500">
                          {description}
                        </p>

                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {visibleTech.map((tech, index) => (
                            <TechBadge key={`${project.id}-t-${index}`} tech={tech} />
                          ))}
                          {hiddenTech.length > 0 && (
                            <MoreTechBadge count={hiddenTech.length} hiddenTech={hiddenTech} />
                          )}
                        </div>

                        <div
                          className="flex-1 w-full overflow-hidden rounded-lg bg-cover bg-center"
                          style={{ backgroundImage: `url(${project.imageUrl})` }}
                        />

                        {/* View Details indicator and Source/Live inside card */}
                        <div className="mt-3 flex items-center justify-between gap-2">
                          {/* Detail link */}
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#61DCA3] transition-colors group-hover/card:text-white">
                            {detailHref ? "View Details" : externalHref ? "Visit Project" : ""}
                            <span className="transition-transform group-hover/card:translate-x-1">-&gt;</span>
                          </span>

                          {/* Source / Live buttons */}
                          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {githubHref && (
                              <a
                                href={githubHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/50 transition hover:border-[#61DCA3]/50 hover:bg-[#61DCA3]/10 hover:text-white"
                              >
                                <GithubIcon size={11} />
                                Source
                              </a>
                            )}
                            {liveUrl && (
                              <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 rounded-md border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-2.5 py-1 text-[10px] font-semibold text-[#61DCA3] transition hover:bg-[#61DCA3]/20"
                              >
                                <ExternalLink size={11} />
                                Live
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </motion.div>

        {!loading && pageData.length === 0 && (
          <p className="py-20 text-center text-sm text-white/30">
            {t("project.noProjects")}
          </p>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer rounded-xl border border-white/10 px-4 py-2 text-white/50 transition-all duration-200 hover:border-[#61DCA3]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              {t("project.prev")}
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`h-9 w-9 cursor-pointer rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentPage === pageNumber
                      ? "bg-[#61DCA3] text-black shadow-[0_0_14px_rgba(97,220,163,0.35)]"
                      : "border border-white/10 text-white/50 hover:border-[#61DCA3]/40 hover:text-white"
                  }`}
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="cursor-pointer rounded-xl border border-white/10 px-4 py-2 text-white/50 transition-all duration-200 hover:border-[#61DCA3]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              {t("project.next")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

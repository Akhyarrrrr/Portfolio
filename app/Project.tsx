"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Pin, ExternalLink, CreditCard } from "lucide-react";
import { PinContainer } from "./components/ui/3d-pin";
import { FaReact, FaHtml5, FaCss3Alt } from "react-icons/fa";
import {
  SiTailwindcss, SiJavascript, SiTypescript, SiNextdotjs,
  SiMysql, SiFirebase, SiExpo, SiKotlin, SiLaravel, SiExpress,
  SiSupabase, SiDocker, SiPostgresql, SiVercel, SiNodedotjs,
  SiCloudinary, SiMongodb, SiPrisma, SiPython, SiPhp, SiGraphql,
  SiAlpinedotjs, SiLivewire, SiRailway,
} from "react-icons/si";
import { useLanguage, RichText } from "../context/LanguageProvider";

type ProjectType = {
  id: string;
  title?: string; title_en?: string; title_id?: string;
  description?: string; desc_en?: string; desc_id?: string;
  category: string; tech: string[];
  imageUrl: string; href?: string;
  pinned?: boolean; order?: number;
};

const techIcons: Record<string, { icon: React.JSX.Element; label: string }> = {
  react:          { icon: <FaReact       className="text-sky-400   text-base" />, label: "React"         },
  "react-native": { icon: <FaReact       className="text-indigo-400 text-base" />, label: "React Native"  },
  tailwind:       { icon: <SiTailwindcss className="text-cyan-400  text-base" />, label: "Tailwind CSS"  },
  "tailwind css": { icon: <SiTailwindcss className="text-cyan-400  text-base" />, label: "Tailwind CSS"  },
  html:           { icon: <FaHtml5       className="text-orange-500 text-base" />, label: "HTML"          },
  css:            { icon: <FaCss3Alt     className="text-blue-500  text-base" />, label: "CSS"           },
  javascript:     { icon: <SiJavascript  className="text-yellow-400 text-base" />, label: "JavaScript"    },
  typescript:     { icon: <SiTypescript  className="text-blue-400  text-base" />, label: "TypeScript"    },
  typescirpt:     { icon: <SiTypescript  className="text-blue-400  text-base" />, label: "TypeScript"    },
  next:           { icon: <SiNextdotjs   className="text-white     text-base" />, label: "Next.js"       },
  "next.js":      { icon: <SiNextdotjs   className="text-white     text-base" />, label: "Next.js"       },
  mysql:          { icon: <SiMysql       className="text-blue-300  text-base" />, label: "MySQL"         },
  firebase:       { icon: <SiFirebase    className="text-yellow-300 text-base" />, label: "Firebase"      },
  supabase:       { icon: <SiSupabase    className="text-green-400 text-base" />, label: "Supabase"      },
  postgres:       { icon: <SiPostgresql  className="text-sky-300    text-base" />, label: "PostgreSQL"    },
  postgresql:     { icon: <SiPostgresql  className="text-sky-300    text-base" />, label: "PostgreSQL"    },
  expo:           { icon: <SiExpo        className="text-white     text-base" />, label: "Expo"          },
  kotlin:         { icon: <SiKotlin      className="text-purple-400 text-base" />, label: "Kotlin"        },
  laravel:        { icon: <SiLaravel     className="text-red-500   text-base" />, label: "Laravel"       },
  express:        { icon: <SiExpress     className="text-white     text-base" />, label: "Express.js"    },
  "express.js":   { icon: <SiExpress     className="text-white     text-base" />, label: "Express.js"    },
  node:           { icon: <SiNodedotjs   className="text-green-400 text-base" />, label: "Node.js"       },
  "node.js":      { icon: <SiNodedotjs   className="text-green-400 text-base" />, label: "Node.js"       },
  nodejs:         { icon: <SiNodedotjs   className="text-green-400 text-base" />, label: "Node.js"       },
  "face-api.js":  { icon: <FaReact       className="text-sky-400   text-base" />, label: "Face API.js"   },
  "tensorflow.js":{ icon: <FaReact       className="text-indigo-400 text-base" />, label: "TensorFlow.js" },
  recharts:       { icon: <FaReact       className="text-blue-400  text-base" />, label: "Recharts"      },
  jspdf:          { icon: <FaHtml5       className="text-orange-500 text-base" />, label: "jsPDF"         },
  "framer motion":{ icon: <FaReact       className="text-sky-400   text-base" />, label: "Framer Motion" },
  "dnd-kit":      { icon: <SiExpress     className="text-white     text-base" />, label: "dnd-kit"       },
  tiptap:         { icon: <FaReact       className="text-sky-400   text-base" />, label: "Tiptap"        },
  docker:         { icon: <SiDocker      className="text-sky-400   text-base" />, label: "Docker"        },
  vercel:         { icon: <SiVercel      className="text-white     text-base" />, label: "Vercel"        },
  cloudinary:     { icon: <SiCloudinary  className="text-blue-300  text-base" />, label: "Cloudinary"    },
  mongodb:        { icon: <SiMongodb     className="text-green-400 text-base" />, label: "MongoDB"       },
  prisma:         { icon: <SiPrisma      className="text-white     text-base" />, label: "Prisma"        },
  python:         { icon: <SiPython      className="text-yellow-300 text-base" />, label: "Python"       },
  php:            { icon: <SiPhp         className="text-indigo-300 text-base" />, label: "PHP"          },
  graphql:        { icon: <SiGraphql     className="text-pink-400  text-base" />, label: "GraphQL"       },
  alpine:         { icon: <SiAlpinedotjs className="text-cyan-300  text-base" />, label: "Alpine.js"     },
  "alpine.js":    { icon: <SiAlpinedotjs className="text-cyan-300  text-base" />, label: "Alpine.js"     },
  apline:         { icon: <SiAlpinedotjs className="text-cyan-300  text-base" />, label: "Alpine.js"     },
  livewire:       { icon: <SiLivewire    className="text-pink-400  text-base" />, label: "Livewire"      },
  railway:        { icon: <SiRailway     className="text-white     text-base" />, label: "Railway"       },
  midtrans:       { icon: <CreditCard    className="text-emerald-300 h-4 w-4" />, label: "Midtrans"      },
};

/* ─── Skeleton card ─────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="flex h-[22rem] w-[20rem] flex-col rounded-xl border border-[#61DCA3]/50 bg-black p-4 animate-pulse">
    <div className="mb-2 h-5 w-36 rounded bg-white/10" />
    <div className="mb-1.5 h-3 w-48 rounded bg-white/10" />
    <div className="mb-4 h-3 w-40 rounded bg-white/10" />
    <div className="mb-4 flex gap-2">
      {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-7 w-7 rounded-lg bg-white/10" />)}
    </div>
    <div className="mt-auto h-40 w-full rounded-lg bg-white/10" />
  </div>
);

/* ─── Variants ──────────────────────────────────────────────── */
const fadeUp: Variants = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
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
  const normalized = tech.trim().toLowerCase();
  const meta = techIcons[normalized];
  const label = meta?.label ?? tech.replace(/[-_]/g, " ");
  const initials = label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span
      title={label}
      className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-1.5 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
    >
      {meta ? meta.icon : (
        <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-white/70">
          {initials}
        </span>
      )}
    </span>
  );
}

function MoreTechBadge({ count, hiddenTech }: { count: number; hiddenTech: string[] }) {
  return (
    <span
      title={hiddenTech.join(", ")}
      className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg border border-[#61DCA3]/20 bg-[#61DCA3]/10 px-1.5 text-[10px] font-semibold text-[#61DCA3]"
    >
      +{count}
    </span>
  );
}

export default function Project() {
  const { lang, t } = useLanguage();
  const [filter, setFilter]           = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [projects, setProjects]       = useState<ProjectType[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { getProjects } = await import("../lib/firestoreCrud");
        const data = await getProjects();
        setProjects((data as ProjectType[]) ?? []);
      } catch (e) { console.error("Failed to fetch projects", e); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setItemsPerPage(w <= 640 ? 3 : w <= 1024 ? 4 : 6);
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const filteredProjects = useMemo(() => {
    const list = filter === "all" ? projects : projects.filter((p) => p.category === filter);
    const pinned   = list.filter((p) =>  (p.pinned ?? false)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const unpinned = list.filter((p) => !(p.pinned ?? false)).sort((a, b) =>
      (a.title ?? a.title_en ?? "").localeCompare(b.title ?? b.title_en ?? "")
    );
    return [...pinned, ...unpinned];
  }, [filter, projects]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const pageData   = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const filterLabel = (cat: "all" | "web" | "mobile") =>
    cat === "all" ? t("project.filter_all") : cat === "web" ? t("project.filter_web") : t("project.filter_mobile");

  return (
    <section id="project" className="relative z-10 w-full bg-[#0B0F15] px-4 py-28 sm:px-6">
      <div className="mx-auto w-full max-w-7xl">

      {/* Heading */}
      <motion.div className="text-center mb-12"
        initial="hidden" whileInView="visible"
        viewport={{ once: true, margin: "-60px" }} variants={fadeUp}>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#61DCA3]" />
          <span className="text-xs text-[#61DCA3] font-medium uppercase tracking-widest">
            {lang === "id" ? "Karya Saya" : "My Work"}
          </span>
        </div>
        <h2 className="text-4xl font-extrabold text-white tracking-tight [&_span]:text-[#61DCA3]">
          <RichText i18nKey="project.heading" />
        </h2>
        <p className="mt-3 text-white/40 max-w-xl mx-auto text-sm">{t("project.sub")}</p>
      </motion.div>

      {/* Filter pills */}
      <motion.div className="flex justify-center flex-wrap gap-2 mb-12"
        initial="hidden" whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } } }}>
        {(["all", "web", "mobile"] as const).map((cat) => (
          <button key={cat}
            onClick={() => { setFilter(cat); setCurrentPage(1); }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                        ${filter === cat
                          ? "bg-[#61DCA3] text-[#0B0F15] shadow-[0_0_16px_rgba(97,220,163,0.35)]"
                          : "border border-white/10 text-white/50 hover:border-[#61DCA3]/40 hover:text-white hover:bg-white/5"
                        }`}>
            {filterLabel(cat)}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div key={`${filter}-${currentPage}`} className="grid items-start justify-items-center gap-y-[4.5rem] sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-20"
        initial="hidden" animate="visible"
        variants={projectGrid}>

        {loading && Array.from({ length: itemsPerPage }).map((_, i) => (
          <motion.div key={i} variants={projectCard} className="flex h-[24rem] w-96 max-w-full items-center justify-center">
            <SkeletonCard />
          </motion.div>
        ))}

        {!loading && pageData.map((p) => {
          const title = (p as Record<string, unknown>)[`title_${lang}`] as string ?? p.title_en ?? p.title ?? "";
          const desc  = (p as Record<string, unknown>)[`desc_${lang}`]  as string ?? p.desc_en  ?? p.description ?? "";
          const techList = (p.tech ?? []).filter(Boolean);
          const maxVisibleTech = techList.length > 6 ? 5 : 6;
          const visibleTech = techList.slice(0, maxVisibleTech);
          const hiddenTech = techList.slice(maxVisibleTech);

          return (
            <motion.div key={p.id} variants={projectCard} className="flex justify-center">
              <PinContainer
                title={t("project.view_github")}
                href={p.href}
                containerClassName="block h-[24rem] w-96 max-w-full"
              >
                <div className="relative flex h-[22rem] w-[20rem] basis-full flex-col overflow-hidden rounded-xl
                                border border-[#61DCA3]/70 bg-black p-4 tracking-tight text-slate-100/50
                                shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-colors duration-300
                                hover:border-[#61DCA3] sm:basis-1/2">
                  {/* Pinned badge */}
                  {p.pinned && (
                    <div className="absolute top-3 right-3 flex items-center gap-1
                                    rounded-full bg-[#61DCA3]/15 border border-[#61DCA3]/30
                                    px-2 py-0.5">
                      <Pin size={10} className="text-[#61DCA3]" />
                      <span className="text-[#61DCA3] text-[10px] font-semibold">Featured</span>
                    </div>
                  )}
                  <h3 className="mb-1.5 max-w-[13rem] text-base font-bold leading-6 text-slate-100 line-clamp-1">{title}</h3>
                  <p className="mb-3 text-xs leading-5 text-slate-500 line-clamp-2">{desc}</p>
                  {/* Tech icons */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {visibleTech.map((tech, i) => (
                      <TechBadge key={`${p.id}-t-${i}`} tech={tech} />
                    ))}
                    {hiddenTech.length > 0 && (
                      <MoreTechBadge count={hiddenTech.length} hiddenTech={hiddenTech} />
                    )}
                  </div>
                  {/* Project image */}
                  <div className="mt-2 h-40 w-full flex-none rounded-lg overflow-hidden
                                  bg-center bg-cover"
                       style={{ backgroundImage: `url(${p.imageUrl})` }} />
                  {/* Link hint */}
                  {p.href && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/35">
                      <ExternalLink size={10} />
                      <span className="truncate">{p.href.replace(/^https?:\/\//, "")}</span>
                    </div>
                  )}
                </div>
              </PinContainer>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-14 flex justify-center items-center gap-2 text-sm">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl border border-white/10 text-white/50
                       hover:border-[#61DCA3]/40 hover:text-white
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all duration-200 cursor-pointer">
            {t("project.prev")}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setCurrentPage(n)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                          ${currentPage === n
                            ? "bg-[#61DCA3] text-black shadow-[0_0_14px_rgba(97,220,163,0.35)]"
                            : "border border-white/10 text-white/50 hover:border-[#61DCA3]/40 hover:text-white"
                          }`}>
              {n}
            </button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl border border-white/10 text-white/50
                       hover:border-[#61DCA3]/40 hover:text-white
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all duration-200 cursor-pointer">
            {t("project.next")}
          </button>
        </div>
      )}
      </div>
    </section>
  );
}

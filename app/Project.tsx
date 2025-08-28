"use client";
import React, { useEffect, useMemo, useState } from "react";
import { PinContainer } from "./components/ui/3d-pin";
import { FaReact, FaHtml5, FaCss3Alt } from "react-icons/fa";
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
} from "react-icons/si";
import AOS from "aos";
import "aos/dist/aos.css";
import { getProjects } from "../lib/firestoreCrud";
import { useLanguage, RichText } from "../context/LanguageProvider";

type ProjectType = {
  id: string;
  title?: string;
  title_en?: string;
  title_id?: string;
  description?: string;
  desc_en?: string;
  desc_id?: string;
  category: string;
  tech: string[];
  imageUrl: string;
  href?: string;
};

const techIcons: { [key: string]: { icon: React.JSX.Element; label: string } } =
  {
    react: {
      icon: <FaReact className="text-sky-400 text-lg" />,
      label: "React",
    },
    "react-native": {
      icon: <FaReact className="text-indigo-400 text-lg" />,
      label: "React Native",
    },
    tailwind: {
      icon: <SiTailwindcss className="text-cyan-400 text-lg" />,
      label: "Tailwind CSS",
    },
    html: {
      icon: <FaHtml5 className="text-orange-500 text-lg" />,
      label: "HTML",
    },
    css: {
      icon: <FaCss3Alt className="text-blue-500 text-lg" />,
      label: "CSS",
    },
    javascript: {
      icon: <SiJavascript className="text-yellow-400 text-lg" />,
      label: "JavaScript",
    },
    next: {
      icon: <SiNextdotjs className="text-white text-lg" />,
      label: "Next.js",
    },
    mysql: {
      icon: <SiMysql className="text-blue-300 text-lg" />,
      label: "MySQL",
    },
    firebase: {
      icon: <SiFirebase className="text-yellow-300 text-lg" />,
      label: "Firebase",
    },
    expo: { icon: <SiExpo className="text-white text-lg" />, label: "Expo" },
    kotlin: {
      icon: <SiKotlin className="text-purple-400 text-lg" />,
      label: "Kotlin",
    },
    laravel: {
      icon: <SiLaravel className="text-red-500 text-lg" />,
      label: "Laravel",
    },
    express: {
      icon: <SiExpress className="text-white text-lg" />,
      label: "Express.js",
    },
  };

const SkeletonCard = () => (
  <div className="flex flex-col p-4 w-[20rem] bg-black rounded-xl border border-[#61DCA3] animate-pulse">
    <div className="h-5 w-32 bg-white/10 rounded mb-2" />
    <div className="h-3 w-52 bg-white/10 rounded mb-4" />
    <div className="flex gap-2 mb-3">
      <div className="h-5 w-5 bg-white/10 rounded" />
      <div className="h-5 w-5 bg-white/10 rounded" />
      <div className="h-5 w-5 bg-white/10 rounded" />
    </div>
    <div className="w-full h-40 bg-white/10 rounded" />
  </div>
);

export default function Project() {
  const { lang, t } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProjects();
        setProjects((data as ProjectType[]) ?? []);
      } catch (e) {
        console.error("Failed to fetch projects", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 640) setItemsPerPage(3);
      else if (w <= 1024) setItemsPerPage(4);
      else setItemsPerPage(6);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const filteredProjects = useMemo(() => {
    const list =
      filter === "all"
        ? projects
        : projects.filter((p) => p.category === filter);
    return [...list].sort((a, b) =>
      (a.title ?? a.title_en ?? "").localeCompare(b.title ?? b.title_en ?? "")
    );
  }, [filter, projects]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const pageData = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filterLabel = (cat: "all" | "web" | "mobile") =>
    cat === "all"
      ? t("project.filter_all")
      : cat === "web"
      ? t("project.filter_web")
      : t("project.filter_mobile");

  return (
    <section
      className="relative z-10 w-full py-32 px-0 md:px-16 lg:px-32 bg-[#0B0F15]"
      id="project"
    >
      <div
        className="text-center mb-12"
        data-aos="fade-down"
        data-aos-duration="2000"
      >
        <h2 className="text-4xl font-extrabold text-white tracking-tight ">
          <RichText i18nKey="project.heading" />
        </h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto text-sm">
          {t("project.sub")}
        </p>
      </div>

      {/* Filter */}
      <div
        className="flex justify-center flex-wrap gap-3 mb-10"
        data-aos="zoom-in-up"
        data-aos-duration="2000"
      >
        {(["all", "web", "mobile"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              setCurrentPage(1);
            }}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-all border-2 ${
              filter === cat
                ? "bg-[#61DCA3] text-[#0B0F15] border-[#61DCA3]"
                : "text-gray-400 border-gray-600 hover:border-[#61DCA3] hover:text-white"
            }`}
          >
            {filterLabel(cat)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 auto-rows-max"
        data-aos="fade-up"
        data-aos-duration="2000"
      >
        {loading &&
          Array.from({ length: itemsPerPage }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

        {!loading &&
          pageData.map((p) => {
            const title =
              (p as any)[`title_${lang}`] ?? p.title_en ?? p.title ?? "";
            const desc =
              (p as any)[`desc_${lang}`] ?? p.desc_en ?? p.description ?? "";
            return (
              <PinContainer
                key={p.id}
                title={t("project.view_github")}
                href={p.href}
              >
                <div className="flex flex-col p-4 tracking-tight text-slate-100/50 w-[20rem] bg-black rounded-xl border border-[#61DCA3]">
                  <h3 className="max-w-xs pb-2 font-bold text-base text-slate-100">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-2">{desc}</p>
                  <div className="flex gap-3 mb-3 flex-wrap">
                    {p.tech.map((tech, i) => (
                      <span
                        key={`${p.id}-t-${i}`}
                        title={techIcons[tech]?.label || tech}
                      >
                        {techIcons[tech]?.icon || null}
                      </span>
                    ))}
                  </div>
                  <div
                    className="w-full rounded-lg overflow-hidden aspect-video bg-center bg-cover transform transition duration-300 hover:scale-105 hover:shadow-xl"
                    style={{ backgroundImage: `url(${p.imageUrl})` }}
                  />
                </div>
              </PinContainer>
            );
          })}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-2 text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-[#61DCA3] text-gray-400 rounded-md hover:bg-[#61DCA3] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {t("project.prev")}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setCurrentPage(n)}
              className={`px-4 py-2 rounded border transition-all ${
                currentPage === n
                  ? "bg-[#61DCA3] text-black border-[#61DCA3]"
                  : "text-gray-400 border border-[#61DCA3] hover:bg-[#61DCA3] hover:text-black"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-[#61DCA3] text-gray-400 rounded hover:bg-[#61DCA3] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {t("project.next")}
          </button>
        </div>
      )}
    </section>
  );
}

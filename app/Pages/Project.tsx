"use client";

import React, { useState, useEffect } from "react";
import { PinContainer } from "../components/ui/3d-pin";
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
} from "react-icons/si";
import AOS from "aos";
import "aos/dist/aos.css";

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

const projects = [
  {
    title: "MediGuide",
    description:
      "An AI-powered virtual health assistant providing information various diseases",
    category: "mobile",
    href: "https://github.com/MediGuide-Project/MediGuide-Apps",
    image: "/assets/images/projects/mediguide.png",
    tech: ["kotlin"],
  },
  {
    title: "NutriCycle",
    description:
      "A website promoting food waste awareness & sustainable nutrition habits.",
    category: "web",
    href: "https://github.com/alifannaufally/INF206-2023-DY2-NutriCycle",
    image: "/assets/images/projects/nutricycle.png",
    tech: ["laravel", "tailwind", "mysql"],
  },
  {
    title: "Simbima",
    description:
      "Monitoring information system for student guidance documentation.",
    category: "web",
    href: "https://github.com/AdreanBadarr/NoobDev._Final_Project",
    image: "/assets/images/projects/simbima.png",
    tech: ["laravel", "tailwind"],
  },
  {
    title: "Employee Leave Application System",
    description:
      "Leave request system for employees with admin and user interface.",
    category: "web",
    href: "#",
    image: "/assets/images/projects/bmkg.png",
    tech: ["react", "tailwind", "mysql", "express"],
  },
  {
    title: "Web Portofolio basic",
    description:
      "A classic portfolio made with semantic HTML, custom CSS, and vanilla JavaScript.",
    category: "web",
    href: "https://akhyarrrrr.github.io/Portfolio-HtmlCssJs/#",
    image: "/assets/images/projects/portfolio_htmlcss.png",
    tech: ["html", "css", "javascript"],
  },
  {
    title: "Web Portofolio",
    description: "Modern and responsive personal portfolio using Tailwind CSS.",
    category: "web",
    href: "https://akhyarrrrr.github.io/portfolio-tailwind-css/",
    image: "/assets/images/projects/portfolio_tailwind.png",
    tech: ["html", "tailwind", "javascript"],
  },
  {
    title: "Web Portofolio",
    description:
      "Interactive portfolio built with Next.js using various custom React Bits components.",
    category: "web",
    href: "#",
    image: "/assets/images/projects/portfolio_next.png",
    tech: ["next", "react", "tailwind", "firebase"],
  },
  {
    title: "Forterzz",
    description:
      "A team-based service platform that provides professional account boosting",
    category: "web",
    href: "#",
    image: "/assets/images/projects/forterz.png",
    tech: ["react", "tailwind"],
  },
  {
    title: "RWikiStat",
    description:
      "Interactive statistics learning platform with built-in R compiler.",
    category: "mobile",
    href: "https://apps.apple.com/id/app/rwikistat/id6739125153",
    image: "/assets/images/projects/rwikistat.png",
    tech: ["expo", "react-native", "tailwind", "firebase"],
  },
  {
    title: "Wedding Invitation Website",
    description:
      "Digital wedding invitation with RSVP and location integration.",
    category: "web",
    href: "#",
    image: "/assets/images/projects/wedding.png",
    tech: ["laravel", "tailwind"],
  },
];

export default function Project() {
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Hitung jumlah project berdasarkan filter
  const filteredProjects = (
    filter === "all"
      ? projects
      : projects.filter((project) => project.category === filter)
  ).sort((a, b) => a.title.localeCompare(b.title));

  // Fungsi responsif
  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    if (width <= 640) {
      setItemsPerPage(3); // Mobile
    } else if (width <= 1024) {
      setItemsPerPage(4); // Tablet
    } else {
      setItemsPerPage(6); // Desktop
    }
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <section
      className="relative z-10 w-full py-32 px-0 md:px-16 lg:px-32 bg-[#0B0F15]"
      id="project"
    >
      {/* Header dan Filter tetap */}
      <div
        className="text-center mb-12"
        data-aos="fade-down"
        data-aos-duration="2000"
      >
        <h2 className="text-4xl font-extrabold text-white tracking-tight ">
          Snippets of My <span className="text-[#61DCA3]">Selected Works</span>
        </h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto text-sm">
          A glimpse into my creations from interfaces to functionality crafted
          with code and intent.
        </p>
      </div>

      {/* Filter */}
      <div
        className="flex justify-center flex-wrap gap-3 mb-10"
        data-aos="zoom-in-up"
        data-aos-duration="2000"
      >
        {["all", "web", "mobile"].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              setCurrentPage(1);
            }}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-all border-2
              ${
                filter === cat
                  ? "bg-[#61DCA3] text-[#0B0F15] border-[#61DCA3]"
                  : "text-gray-400 border-gray-600 hover:border-[#61DCA3] hover:text-white"
              }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 auto-rows-max"
        data-aos="fade-up"
        data-aos-duration="2000"
      >
        {paginatedProjects.map((project, idx) => (
          <PinContainer key={idx} title="View on Github" href={project.href}>
            <div className="flex flex-col p-4 tracking-tight text-slate-100/50 w-[20rem] bg-black rounded-xl border border-[#61DCA3]">
              <h3 className="max-w-xs pb-2 font-bold text-base text-slate-100">
                {project.title}
              </h3>
              <p className="text-sm text-slate-500 mb-2">
                {project.description}
              </p>
              <div className="flex gap-3 mb-3 flex-wrap">
                {project.tech.map((tech, i) => (
                  <span key={i} title={techIcons[tech]?.label || tech}>
                    {techIcons[tech]?.icon || null}
                  </span>
                ))}
              </div>
              <div
                className="w-full rounded-lg overflow-hidden aspect-video bg-center bg-cover transform transition duration-300 hover:scale-105 hover:shadow-xl"
                style={{ backgroundImage: `url(${project.image})` }}
              />
            </div>
          </PinContainer>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-2 text-sm">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-[#61DCA3] text-gray-400 rounded-md hover:bg-[#61DCA3] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
            (num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`px-4 py-2 rounded border transition-all ${
                  currentPage === num
                    ? "bg-[#61DCA3] text-black border-[#61DCA3]"
                    : "text-gray-400 border border-[#61DCA3] hover:bg-[#61DCA3] hover:text-black"
                }`}
              >
                {num}
              </button>
            )
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-[#61DCA3] text-gray-400 rounded hover:bg-[#61DCA3] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

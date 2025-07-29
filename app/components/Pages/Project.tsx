"use client";

import React, { useState } from "react";
import { PinContainer } from "../ui/3d-pin";
import { FaReact } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import { SiReact } from "react-icons/si"; // Bisa pakai react-native icon dari simple-icons

const projects = [
  {
    title: "Aceternity UI",
    description: "Customizable Tailwind CSS and Framer Motion Components.",
    category: "web",
    href: "https://twitter.com/mannupaaji",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tech: ["react", "tailwind"],
  },
  {
    title: "QFlora Mobile",
    description: "A mobile app for exploring plants in the Qur'an.",
    category: "mobile",
    href: "#",
    image: "/images/project2.jpg",
    tech: ["react-native", "tailwind"],
  },
  {
    title: "RWikiStat 4.0",
    description: "Web-based statistics learning platform with R compiler.",
    category: "web",
    href: "#",
    image: "/images/project3.jpg",
    tech: ["react", "tailwind"],
  },
  {
    title: "Aceternity UI 2",
    description: "Advanced UI components for developers.",
    category: "web",
    href: "#",
    image: "/images/project4.jpg",
    tech: ["react", "tailwind"],
  },
  {
    title: "QFlora Admin",
    description: "Admin panel to manage QFlora database.",
    category: "web",
    href: "#",
    image: "/images/project5.jpg",
    tech: ["react", "tailwind"],
  },
  {
    title: "RWikiStat Mobile",
    description: "Mobile companion app for RWikiStat platform.",
    category: "mobile",
    href: "#",
    image: "/images/project6.jpg",
    tech: ["react-native", "tailwind"],
  },
];

export default function Project() {
  const [filter, setFilter] = useState("all");

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((project) => project.category === filter);

  // Render icon berdasarkan tech
  const renderTechIcons = (techs: string[]) =>
    techs.map((tech, idx) => {
      switch (tech) {
        case "react":
          return <FaReact key={idx} className="text-sky-400 text-lg" />;
        case "tailwind":
          return <SiTailwindcss key={idx} className="text-cyan-400 text-lg" />;
        case "react-native":
          return <SiReact key={idx} className="text-indigo-400 text-lg" />;
        default:
          return null;
      }
    });

  return (
    <section
      className="relative z-10 w-full py-32 px-6 md:px-16 lg:px-32"
      id="project"
    >
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          My <span className="text-[#61DCA3]">Projects</span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Here are some of my featured works, crafted with love and creativity.
        </p>
      </div>

      {/* Filter */}
      <div className="flex justify-center gap-4 mb-12">
        {["all", "web", "mobile"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              filter === cat
                ? "bg-[#61DCA3] text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 auto-rows-max">
        {filteredProjects.map((project, idx) => (
          <PinContainer key={idx} title={project.title} href={project.href}>
            <div className="flex flex-col p-4 tracking-tight text-slate-100/50 w-[20rem] bg-black rounded-xl">
              {/* Title */}
              <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                {project.title}
              </h3>

              {/* Description */}
              <div className="text-base !m-0 !p-0 font-normal mb-2">
                <span className="text-slate-500">{project.description}</span>
              </div>

              {/* Tech Icons */}
              <div className="flex gap-3 mb-3">
                {renderTechIcons(project.tech)}
              </div>

              {/* Image Preview */}
              <div
                className="w-full rounded-lg overflow-hidden aspect-video bg-center bg-cover transform transition duration-300 hover:scale-105 hover:shadow-xl"
                style={{ backgroundImage: `url(${project.image})` }}
              />
            </div>
          </PinContainer>
        ))}
      </div>
    </section>
  );
}

"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import ScrambledText from "../ScrambledText/ScrambledText";
const experiences = [
  {
    id: 1,
    title: "Bachelor of Information Systems",
    company: "Universitas Pamulang",
    year: "2024 - Present",
    description:
      "Started my academic journey at Universitas Pamulang, majoring in Information Systems. This program has provided me with a strong foundation in technology, system development, and digital solutions that address real-world problems.",
    logo: "/exp_logos/unpam-logo.png",
  },
  {
    id: 2,
    title: "Product Consultant",
    company: "Avian Brands",
    year: "2024",
    description:
      "Worked as a Product Consultant at Avian Brands, where I was responsible for delivering product knowledge to customers and partners. This role enhanced my communication skills, product expertise, and experience in direct customer engagement and field marketing.",
    logo: "/exp_logos/avian-logo.png",
  },
  {
    id: 3,
    title: "Coding Tutors",
    company: "Alhazen Academy",
    year: "2024 - Present",
    description:
      "Currently serving as a Coding Tutor at Alhazen Academy. I assist students in learning both fundamental and advanced programming concepts. I design engaging lessons and guide learners through hands-on coding exercises, creating a meaningful and enjoyable learning experience.",
    logo: "/exp_logos/alhazen-logo.png",
  },
];

const Experience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.01,
  });

  const dotTop = useTransform(scaleY, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 mt-10"
    >
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-cyan-600 to-cyan-800 transform -translate-x-1/2"
        style={{ scaleY: scaleY, transformOrigin: "top" }}
      />

      <motion.div
        className="absolute left-1/2 w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] transform -translate-x-1/2"
        style={{ top: dotTop }}
      />

      <div className="relative space-y-24">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className="relative grid grid-cols-1 md:grid-cols-2 items-start gap-x-20 bg-black rounded-2xl p-6 shadow-lg md:bg-transparent"
          >
            <div
              className={`flex flex-col ${
                index % 2 === 0
                  ? "md:items-end md:text-right"
                  : "md:items-start md:text-left"
              } ${index % 2 === 0 ? "md:order-1" : "md:order-2"}`}
            >
              <h3 className="font-bold text-gray-100">
                <ScrambledText
                  className="text-[clamp(18px,2vw,24px)] leading-tight"
                  radius={70}
                  duration={1.2}
                  speed={0.5}
                  scrambleChars=".:"
                >
                  {exp.title}
                </ScrambledText>
              </h3>

              <div className="mb-1">
                <ScrambledText
                  className="text-[clamp(14px,1.6vw,18px)] text-cyan-400"
                  radius={50}
                  duration={1}
                  speed={0.4}
                  scrambleChars=".:"
                >
                  {exp.company}
                </ScrambledText>
              </div>

              <span className="mb-2" style={{ letterSpacing: "0.4em" }}>
                <ScrambledText
                  className="text-[clamp(12px,1.5vw,18px)] text-gray-400"
                  radius={40}
                  duration={1}
                  speed={0.4}
                  scrambleChars=".:"
                >
                  {exp.year}
                </ScrambledText>
              </span>

              <div className="w-10 h-10 relative flex items-center justify-center md:my-0 my-5">
                <Image
                  src={exp.logo}
                  alt={`${exp.company} logo`}
                  fill
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;

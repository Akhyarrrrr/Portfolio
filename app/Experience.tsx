"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { getExperiences } from "@/lib/firestoreCrud";

type ExperienceType = {
  id: string;
  title: string;
  company: string;
  year: string;
  logo: string;
  description: string;
};

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);

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

  useEffect(() => {
    getExperiences().then((exps) => {
      const sorted = [...exps].sort((a, b) => {
        const getLastYear = (y: string) => {
          const nums = String(y).match(/\d{4}/g);
          return nums ? parseInt(nums[nums.length - 1]) : 0;
        };
        return getLastYear(b.year) - getLastYear(a.year);
      });
      setExperiences(sorted);
      AOS.init({
        duration: 800,
        once: true,
      });
    });
  }, []);

  return (
    <section
      className="relative z-10 w-full py-32 px-6 md:px-16 lg:px-32 bg-[#0B0F15]"
      id="experience"
    >
      <div
        className="text-center mb-2 md:mb-20"
        data-aos="fade-down"
        data-aos-duration="2000"
      >
        <h2 className="text-4xl font-extrabold text-white tracking-tight">
          My Journey Through{" "}
          <span className="text-[#61DCA3]">Code & Impact</span>
        </h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto text-sm">
          A glimpse into my academic and professional growth, one line of code
          at a time.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 mt-10"
      >
        {/* Vertical line */}
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 w-1 bg-[linear-gradient(to_bottom,#61DCA3,#4BB98E,#3E9F7B)] transform -translate-x-1/2"
          style={{ scaleY: scaleY, transformOrigin: "top" }}
        />

        {/* Animated dot */}
        <motion.div
          className="absolute left-1/2 w-4 h-4 rounded-full bg-[#61DCA3] shadow-[0_0_15px_5px_rgba(97,220,163,0.5)] transform -translate-x-1/2"
          style={{ top: dotTop }}
        />

        <div className="relative space-y-24">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="relative flex items-start justify-between w-full"
            >
              {/* Left Column */}
              <div
                className="w-[45%] order-1"
                data-aos="fade-left"
                data-aos-duration="2000"
              >
                <div
                  className={`flex flex-col ${
                    index % 2 === 0
                      ? "items-end text-right"
                      : "items-start text-left"
                  }`}
                >
                  {index % 2 === 0 ? (
                    <div className="flex flex-col items-end text-right">
                      <h3 className="font-bold text-gray-100 text-[clamp(18px,2vw,24px)] leading-tight">
                        {exp.title}
                      </h3>
                      <div className="text-[clamp(14px,1.6vw,18px)] text-[#61DCA3]">
                        {exp.company}
                      </div>
                      <span
                        className="text-[clamp(12px,1.5vw,18px)] text-gray-400"
                        style={{ letterSpacing: "0.4em" }}
                      >
                        {exp.year}
                      </span>
                      <div className="w-16 h-16 relative flex items-center justify-center mt-2">
                        <Image
                          src={exp.logo}
                          alt={`${exp.company} logo`}
                          fill
                          className="object-contain rounded-full border-4 border-[#61DCA3] shadow-md bg-white"
                          unoptimized
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-300 text-md leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div
                className="w-[45%] order-2"
                data-aos="fade-right"
                data-aos-duration="2000"
              >
                <div className="flex flex-col items-start text-left">
                  {index % 2 === 0 ? (
                    <p className="text-gray-300 text-md leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  ) : (
                    <div className="flex flex-col items-start text-left">
                      <h3 className="font-bold text-gray-100 text-[clamp(18px,2vw,24px)] leading-tight">
                        {exp.title}
                      </h3>
                      <div className="text-[clamp(14px,1.6vw,18px)] text-[#61DCA3]">
                        {exp.company}
                      </div>
                      <span
                        className="text-[clamp(12px,1.5vw,18px)] text-gray-400"
                        style={{ letterSpacing: "0.4em" }}
                      >
                        {exp.year}
                      </span>
                      <div className="w-16 h-16 relative flex items-center justify-center mt-2">
                        <Image
                          src={exp.logo}
                          alt={`${exp.company} logo`}
                          fill
                          className="object-contain rounded-full border-4 border-[#61DCA3] shadow-md bg-white"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Handle jika kosong */}
          {experiences.length === 0 && (
            <div className="text-center text-gray-500">No experience yet!</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;

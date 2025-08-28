"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { getExperiences } from "@/lib/firestoreCrud";
import { useLanguage, RichText } from "../context/LanguageProvider";

type ExperienceType = {
  id: string;
  title: string;
  company: string;
  year: string; // contoh: "2023 - Present"
  logo: string; // URL logo
  description: string;
};

// skeleton kecil
const SkeletonLine = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-white/10 ${className}`} />
);
const SkeletonCircle = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-full bg-white/10 ${className}`} />
);

function ExperienceSkeletonRow({ index }: { index: number }) {
  const isEven = index % 2 === 0;
  return (
    <div className="relative flex items-start justify-between w-full">
      {/* Left */}
      <div
        className="w-[45%] order-1"
        data-aos="fade-left"
        data-aos-duration="2000"
      >
        <div
          className={`flex flex-col ${
            isEven ? "items-end text-right" : "items-start text-left"
          }`}
        >
          {isEven ? (
            <div className="flex flex-col items-end gap-2">
              <SkeletonLine className="h-5 w-56" />
              <SkeletonLine className="h-4 w-40" />
              <SkeletonLine className="h-3 w-28" />
              <SkeletonCircle className="h-16 w-16 mt-2" />
            </div>
          ) : (
            <div className="space-y-2">
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-[90%]" />
              <SkeletonLine className="h-4 w-[80%]" />
            </div>
          )}
        </div>
      </div>
      {/* Right */}
      <div
        className="w-[45%] order-2"
        data-aos="fade-right"
        data-aos-duration="2000"
      >
        <div className="flex flex-col items-start">
          {isEven ? (
            <div className="space-y-2">
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-[92%]" />
              <SkeletonLine className="h-4 w-[80%]" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <SkeletonLine className="h-5 w-56" />
              <SkeletonLine className="h-4 w-40" />
              <SkeletonLine className="h-3 w-28" />
              <SkeletonCircle className="h-16 w-16 mt-2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const { t } = useLanguage();
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

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
    let mounted = true;
    (async () => {
      try {
        const exps = await getExperiences();
        const sorted = [...exps].sort((a, b) => {
          const getLastYear = (y: string) => {
            const nums = String(y).match(/\d{4}/g);
            return nums ? parseInt(nums[nums.length - 1]) : 0;
          };
          return getLastYear(b.year) - getLastYear(a.year);
        });
        if (mounted) setExperiences(sorted as ExperienceType[]);
      } catch (e) {
        console.error("Failed to fetch experiences", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    AOS.init({ duration: 800, once: true });
    return () => {
      mounted = false;
    };
  }, []);

  // siapkan skeleton count biar grid stabil
  const skeletonRows = Array.from({ length: 4 }).map((_, i) => (
    <ExperienceSkeletonRow key={`sk-${i}`} index={i} />
  ));

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
          <RichText i18nKey="experience.heading" />
        </h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto text-sm">
          {t("experience.sub")}
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 mt-10"
      >
        {/* Vertical line */}
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 w-1 bg-[linear-gradient(to_bottom,#61DCA3,#4BB98E,#3E9F7B)] transform -translate-x-1/2"
          style={{ scaleY, transformOrigin: "top" }}
        />
        {/* Animated dot */}
        <motion.div
          className="absolute left-1/2 w-4 h-4 rounded-full bg-[#61DCA3] shadow-[0_0_15px_5px_rgba(97,220,163,0.5)] transform -translate-x-1/2"
          style={{ top: dotTop }}
        />

        <div className="relative space-y-24">
          {/* Loading state: skeleton */}
          {loading && skeletonRows}

          {/* Loaded items */}
          {!loading &&
            experiences.map((exp, index) => (
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
                        <span className="text-[clamp(12px,1.5vw,18px)] text-gray-400 tracking-[0.4em]">
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
                        <span className="text-[clamp(12px,1.5vw,18px)] text-gray-400 tracking-[0.4em]">
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

          {/* Kalau kosong setelah load, cukup biarkan tanpa teks "no experience" (clean look) */}
          {!loading && experiences.length === 0 && <div className="h-8" />}
        </div>
      </div>
    </section>
  );
}

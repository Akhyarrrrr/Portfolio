"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { getExperiences } from "@/lib/firestoreCrud";
import { useLanguage, RichText } from "../context/LanguageProvider";

type ExperienceType = {
  id: string;
  title: string;
  company: string;
  year: string;
  logo: string;
  description: string;
};

/* ─── Skeleton ──────────────────────────────────────────────── */
const SkeletonLine = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-white/8 ${className}`} />
);
const SkeletonCircle = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-full bg-white/8 ${className}`} />
);

function DesktopSkeletonRow({ index }: { index: number }) {
  const isEven = index % 2 === 0;
  return (
    <div className="hidden md:flex relative items-start justify-between w-full">
      <div className="w-[45%]">
        {isEven ? (
          <div className="flex flex-col items-end gap-2">
            <SkeletonLine className="h-5 w-56" />
            <SkeletonLine className="h-4 w-40" />
            <SkeletonLine className="h-3 w-28" />
            <SkeletonCircle className="h-14 w-14 mt-2" />
          </div>
        ) : (
          <div className="space-y-2">
            <SkeletonLine className="h-4 w-full" />
            <SkeletonLine className="h-4 w-[88%]" />
            <SkeletonLine className="h-4 w-[75%]" />
          </div>
        )}
      </div>
      <div className="w-[45%]">
        {isEven ? (
          <div className="space-y-2">
            <SkeletonLine className="h-4 w-full" />
            <SkeletonLine className="h-4 w-[90%]" />
            <SkeletonLine className="h-4 w-[78%]" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <SkeletonLine className="h-5 w-56" />
            <SkeletonLine className="h-4 w-40" />
            <SkeletonLine className="h-3 w-28" />
            <SkeletonCircle className="h-14 w-14 mt-2" />
          </div>
        )}
      </div>
    </div>
  );
}

function MobileSkeletonCard() {
  return (
    <div className="flex md:hidden items-start gap-4 pl-10">
      <div className="flex-1 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
        <div className="flex items-center gap-3 mb-3">
          <SkeletonCircle className="h-11 w-11 shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonLine className="h-4 w-36" />
            <SkeletonLine className="h-3 w-24" />
          </div>
        </div>
        <SkeletonLine className="h-3 w-full mb-1" />
        <SkeletonLine className="h-3 w-[88%]" />
      </div>
    </div>
  );
}

/* ─── Animation variants ────────────────────────────────────── */
const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55 } },
};
const fadeRight: Variants = {
  hidden: { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ─── Section heading helper ────────────────────────────────── */
function SectionHeading({
  badge,
  children,
  sub,
}: {
  badge: string;
  children: React.ReactNode;
  sub: string;
}) {
  return (
    <motion.div
      className="text-center mb-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#61DCA3]" />
        <span className="text-xs text-[#61DCA3] font-medium uppercase tracking-widest">
          {badge}
        </span>
      </div>
      <h2 className="text-4xl font-extrabold text-white tracking-tight [&_span]:text-[#61DCA3]">
        {children}
      </h2>
      <p className="mt-4 text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
        {sub}
      </p>
    </motion.div>
  );
}

/* ─── Main ──────────────────────────────────────────────────── */
export default function Experience() {
  const { t, lang } = useLanguage();
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
          const last = (y: string) => {
            const m = String(y).match(/\d{4}/g);
            return m ? +m[m.length - 1] : 0;
          };
          return last(b.year) - last(a.year);
        });
        if (mounted) setExperiences(sorted as ExperienceType[]);
      } catch (e) {
        console.error("Failed to fetch experiences", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const badge = lang === "id" ? "Perjalanan Saya" : "My Journey";

  return (
    <section
      id="experience"
      className="relative z-10 w-full bg-[#0B0F15] px-4 py-28 sm:px-6"
    >
      <SectionHeading badge={badge} sub={t("experience.sub")}>
        <RichText i18nKey="experience.heading" />
      </SectionHeading>

      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-6xl py-12"
      >
        {/* Desktop timeline line */}
        <motion.div
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px
                     bg-gradient-to-b from-[#61DCA3] via-[#4BB98E] to-transparent
                     -translate-x-1/2 origin-top"
          style={{ scaleY }}
        />
        {/* Glowing dot */}
        <motion.div
          className="hidden md:block absolute left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2
                     rounded-full bg-[#61DCA3] shadow-[0_0_12px_4px_rgba(97,220,163,0.55)]"
          style={{ top: dotTop }}
        />

        {/* Mobile left line */}
        <div className="md:hidden absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#61DCA3]/50 to-transparent" />

        <div className="relative space-y-20">
          {/* ── Skeleton ── */}
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <DesktopSkeletonRow index={i} />
                <MobileSkeletonCard />
              </div>
            ))}

          {/* ── Loaded ── */}
          {!loading &&
            experiences.map((exp, index) => (
              <div key={exp.id}>
                {/* Desktop split layout */}
                <div className="hidden md:flex relative items-start justify-between w-full gap-8">
                  {/* Centre dot on timeline */}
                  <div
                    className="absolute left-1/2 top-1 -translate-x-1/2 w-2.5 h-2.5
                                rounded-full bg-[#61DCA3] ring-4 ring-[#0B0F15] z-10"
                  />

                  {/* Left */}
                  <motion.div
                    className="w-[46%] flex justify-end"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeLeft}
                  >
                    {index % 2 === 0 ? (
                      <div className="flex flex-col items-end text-right gap-1">
                        <h3 className="font-bold text-white text-xl leading-tight">
                          {exp.title}
                        </h3>
                        <span className="text-[#61DCA3] text-sm font-medium">
                          {exp.company}
                        </span>
                        <span className="text-white/40 text-xs tracking-widest">
                          {exp.year}
                        </span>
                        <div className="w-12 h-12 relative mt-2">
                          <Image
                            src={exp.logo}
                            alt={`${exp.company} logo`}
                            fill
                            className="object-contain rounded-full border-2 border-[#61DCA3]/50 bg-white shadow"
                            unoptimized
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-white/60 text-sm leading-relaxed text-right max-w-xs">
                        {exp.description}
                      </p>
                    )}
                  </motion.div>

                  {/* Right */}
                  <motion.div
                    className="w-[46%] flex justify-start"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeRight}
                  >
                    {index % 2 === 0 ? (
                      <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                        {exp.description}
                      </p>
                    ) : (
                      <div className="flex flex-col items-start gap-1">
                        <h3 className="font-bold text-white text-xl leading-tight">
                          {exp.title}
                        </h3>
                        <span className="text-[#61DCA3] text-sm font-medium">
                          {exp.company}
                        </span>
                        <span className="text-white/40 text-xs tracking-widest">
                          {exp.year}
                        </span>
                        <div className="w-12 h-12 relative mt-2">
                          <Image
                            src={exp.logo}
                            alt={`${exp.company} logo`}
                            fill
                            className="object-contain rounded-full border-2 border-[#61DCA3]/50 bg-white shadow"
                            unoptimized
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Mobile card */}
                <motion.div
                  className="flex md:hidden items-start gap-4 pl-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  variants={fadeUp}
                >
                  {/* Dot */}
                  <div
                    className="absolute left-[17px] w-2.5 h-2.5 rounded-full bg-[#61DCA3]
                                ring-4 ring-[#0B0F15] mt-4 z-10"
                  />
                  {/* Card */}
                  <div
                    className="flex-1 rounded-2xl border border-white/8 bg-white/[0.03]
                                hover:border-[#61DCA3]/30 transition-colors duration-300 p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 relative shrink-0">
                        <Image
                          src={exp.logo}
                          alt={`${exp.company} logo`}
                          fill
                          className="object-contain rounded-full border-2 border-[#61DCA3]/40 bg-white"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm leading-tight">
                          {exp.title}
                        </h3>
                        <span className="text-[#61DCA3] text-xs">
                          {exp.company}
                        </span>
                        <br />
                        <span className="text-white/35 text-[10px] tracking-widest">
                          {exp.year}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/55 text-xs leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}

          {!loading && experiences.length === 0 && <div className="h-8" />}
        </div>
      </div>
    </section>
  );
}

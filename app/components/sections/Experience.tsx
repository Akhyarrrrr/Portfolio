"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { type ExperienceType } from "@/lib/content";
import { RichText, useLanguage } from "@/context/LanguageProvider";

const easeOut = [0.16, 1, 0.3, 1] as const;

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: Math.min(index * 0.08, 0.32),
      ease: easeOut,
    },
  }),
};

function getLastYear(year: string) {
  const matches = year.match(/\d{4}/g);
  return matches ? Number(matches[matches.length - 1]) : 0;
}

function Logo({ exp }: { exp: ExperienceType }) {
  if (!exp.logo) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#61DCA3]/40 bg-[#61DCA3]/10 text-sm font-bold text-[#61DCA3]">
        {exp.company?.charAt(0) ?? "?"}
      </div>
    );
  }

  return (
    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#61DCA3]/45 bg-white shadow-[0_0_18px_rgba(97,220,163,0.12)]">
      <Image
        src={exp.logo}
        alt={`${exp.company} logo`}
        fill
        className="object-contain p-1"
        unoptimized
      />
    </div>
  );
}

export default function Experience({
  experiences: rawExperiences,
}: {
  experiences: ExperienceType[];
}) {
  const { lang, t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);

  const experiences = useMemo(
    () =>
      [...rawExperiences].sort(
        (a, b) => getLastYear(b.year) - getLastYear(a.year),
      ),
    [rawExperiences],
  );

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 35%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.01,
  });
  const dotTop = useTransform(scaleY, [0, 1], ["0%", "100%"]);
  const badge = lang === "id" ? "Perjalanan Saya" : "My Journey";

  return (
    <section
      id="experience"
      className="relative z-10 w-full bg-[#0B0F15] px-4 py-28 sm:px-6"
    >
      <motion.div
        className="mx-auto mb-16 max-w-3xl text-center"
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.45 }}
        variants={headingVariants}
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#61DCA3]" />
          <span className="text-xs font-medium uppercase tracking-widest text-[#61DCA3]">
            {badge}
          </span>
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-white [&_span]:text-[#61DCA3]">
          <RichText i18nKey="experience.heading" />
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/50">
          {t("experience.sub")}
        </p>
      </motion.div>

      <div ref={timelineRef} className="relative mx-auto max-w-6xl">
        <motion.div
          aria-hidden
          className="absolute bottom-0 left-5 top-0 w-px origin-top bg-gradient-to-b from-[#61DCA3] via-[#4BB98E] to-transparent md:left-1/2"
          style={{ scaleY: reduceMotion ? 1 : scaleY }}
        />
        <motion.div
          aria-hidden
          className="absolute left-5 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#61DCA3] shadow-[0_0_18px_rgba(97,220,163,0.55)] md:left-1/2 md:block"
          style={{ top: reduceMotion ? "100%" : dotTop }}
        />

        <div className="space-y-14 md:space-y-20">
          {experiences.map((exp, index) => {
            const even = index % 2 === 0;
            const infoClass = even
              ? "md:col-start-1 md:items-end md:text-right"
              : "md:col-start-3 md:items-start md:text-left";
            const descClass = even
              ? "md:col-start-3 md:text-left"
              : "md:col-start-1 md:row-start-1 md:text-right";

            return (
              <motion.article
                key={exp.id}
                custom={index}
                initial={reduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.32 }}
                variants={rowVariants}
                className="relative grid gap-5 pl-12 md:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] md:items-start md:pl-0"
              >
                <span
                  aria-hidden
                  className="absolute left-5 top-4 h-3 w-3 -translate-x-1/2 rounded-full bg-[#61DCA3] ring-4 ring-[#0B0F15] md:left-1/2"
                />

                <div className={`flex flex-col gap-3 ${infoClass}`}>
                  <div>
                    <h3 className="text-xl font-bold leading-tight text-white">
                      {exp.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[#61DCA3]">
                      {exp.company}
                    </p>
                    <p className="mt-1 text-xs tracking-[0.16em] text-white/35">
                      {exp.year}
                    </p>
                  </div>
                  <Logo exp={exp} />
                </div>

                <p
                  className={`max-w-md rounded-xl border border-white/8 bg-white/[0.03] p-5 text-sm leading-relaxed text-white/60 transition-colors duration-300 hover:border-[#61DCA3]/25 hover:bg-[#61DCA3]/5 ${descClass}`}
                >
                  {exp.description}
                </p>
              </motion.article>
            );
          })}

          {experiences.length === 0 && (
            <p className="rounded-xl border border-white/8 bg-white/[0.03] px-5 py-12 text-center text-sm text-white/35">
              No experience entries yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

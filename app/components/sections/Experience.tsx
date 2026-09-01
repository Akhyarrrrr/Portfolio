"use client";

import { useEffect, useRef } from "react";
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
import { fadeUpMajor } from "@/lib/motion";

const rowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (index = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.2,
      delay: Math.min(index * 0.08, 0.32),
    },
  }),
};

function Logo({ exp, company }: { exp: ExperienceType; company: string }) {
  if (!exp.logo) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#61DCA3]/40 bg-[#61DCA3]/10 text-sm font-semibold text-[#61DCA3]">
        {company.charAt(0) || "?"}
      </div>
    );
  }

  return (
    <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#61DCA3]/45 bg-[#111820] text-xs font-semibold text-[#61DCA3] shadow-[0_0_18px_rgba(97,220,163,0.12)]">
      <span aria-hidden>{company.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase() || "?"}</span>
      <Image
        src={exp.logo}
        alt={`${company} logo`}
        fill
        className="bg-white object-contain p-1"
        unoptimized
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
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

  const experiences = rawExperiences;

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 35%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.01,
  });
  // The dot used to animate `top` from "0%" to "100%". `top` is a layout
  // property, so every scroll frame forced layout + paint on the main thread
  // instead of staying on the compositor — with a scroll-linked spring
  // driving it, that ran for the whole time the timeline was on screen.
  // Translating instead needs the timeline's pixel height; a ref (not state)
  // keeps resizes from re-rendering the section, and reading it inside the
  // transform means no stale closure.
  const timelineHeightRef = useRef(0);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      timelineHeightRef.current = entry.contentRect.height;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dotY = useTransform(scaleY, (progress) => progress * timelineHeightRef.current);
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
        variants={fadeUpMajor}
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#61DCA3]" />
          <span className="text-xs font-medium uppercase tracking-widest text-[#61DCA3]">
            {badge}
          </span>
        </div>
        <h2 className="font-accent text-4xl font-medium tracking-tight text-white [&_span]:text-[#61DCA3]">
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
        {/* Wrapper carries the scroll-linked translate; the inner dot keeps
            its own centering transform, so framer's transform and Tailwind's
            never fight over the same style property. */}
        <motion.div
          aria-hidden
          className={`absolute left-5 hidden md:left-1/2 md:block ${
            reduceMotion ? "top-full" : "top-0"
          }`}
          style={reduceMotion ? undefined : { y: dotY }}
        >
          <div className="h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#61DCA3] shadow-[0_0_18px_rgba(97,220,163,0.55)]" />
        </motion.div>

        <div className="space-y-14 md:space-y-20">
          {experiences.map((exp, index) => {
            const title = lang === "id" ? exp.title_id ?? exp.title : exp.title;
            const company = lang === "id" ? exp.company_id ?? exp.company : exp.company;
            const year = lang === "id" ? exp.year_id ?? exp.year : exp.year;
            const description =
              lang === "id" ? exp.description_id ?? exp.description : exp.description;
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
                    <h3 className="text-xl font-semibold leading-tight text-white">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[#61DCA3]">
                      {company}
                    </p>
                    <p className="mt-1 text-xs tracking-[0.16em] text-white/35">
                      {year}
                    </p>
                  </div>
                  <Logo exp={exp} company={company} />
                </div>

                <p
                  className={`max-w-md rounded-xl border border-white/8 bg-white/[0.03] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-sm leading-relaxed text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-[#61DCA3]/25 hover:bg-[#61DCA3]/5 hover:shadow-[0_12px_32px_rgba(97,220,163,0.08)] ${descClass}`}
                >
                  {description}
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

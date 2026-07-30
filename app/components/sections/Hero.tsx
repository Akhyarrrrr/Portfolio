"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";
import { useLanguage } from "@/context/LanguageProvider";
import { motion, useReducedMotion } from "framer-motion";
import { easeMajor } from "@/lib/motion";

const Lanyard = dynamic(() => import("../Lanyard/Lanyard"), {
  ssr: false,
  loading: () => <LanyardPoster />,
});

// ponytail: a real captured screenshot of the rendered card would read
// nicer than a gradient placeholder — deferred to the UI pass (Fase 6),
// since it needs a design decision (what angle/lighting), not just code.
function LanyardPoster() {
  return (
    <div
      aria-hidden
      className="h-full w-full rounded-2xl bg-[radial-gradient(circle_at_50%_40%,rgba(97,220,163,0.16),transparent_60%)]"
    />
  );
}

// Desktop only, and only once the browser has idle time — the Rapier
// physics + Three.js WebGL scene is the single heaviest thing on this
// page (see Fase 0 Lighthouse baseline: it kept the tab from ever
// reaching a CPU-idle window at all). Mobile and reduced-motion users
// get the static poster and never pay that cost.
function useShouldMountLanyard() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!isDesktop || prefersReducedMotion) return;

    const win = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (win.requestIdleCallback) {
      const handle = win.requestIdleCallback(() => setShouldMount(true), {
        timeout: 2000,
      });
      return () => win.cancelIdleCallback?.(handle);
    }

    // Safari has no requestIdleCallback — a short timeout approximates it.
    const timer = setTimeout(() => setShouldMount(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return shouldMount;
}

export default function Hero() {
  const { t, lang } = useLanguage();
  const shouldMountLanyard = useShouldMountLanyard();
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] w-full overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_89%,rgba(97,220,163,0.22),transparent_34%),linear-gradient(180deg,rgba(8,13,18,0.97)_0%,rgba(8,13,18,0.84)_46%,rgba(8,13,18,0.62)_100%)] sm:bg-[radial-gradient(circle_at_50%_86%,rgba(97,220,163,0.2),transparent_36%),linear-gradient(180deg,rgba(8,13,18,0.97)_0%,rgba(8,13,18,0.8)_46%,rgba(8,13,18,0.56)_100%)] lg:bg-[radial-gradient(circle_at_74%_46%,rgba(97,220,163,0.18),transparent_34%),linear-gradient(90deg,rgba(8,13,18,0.95)_0%,rgba(8,13,18,0.72)_48%,rgba(8,13,18,0.42)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0B0F15] via-[#0B0F15]/92 to-transparent sm:h-32"
      />

      <div className="mx-auto h-full min-h-[100dvh] max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[100dvh] grid-cols-1 gap-3 pb-8 pt-24 sm:gap-4 sm:pb-10 sm:pt-28 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-0">
          {/* Text content */}
          <div className="relative z-40 flex items-center lg:col-span-5">
            <div className="flex w-full max-w-[34rem] flex-col gap-5 sm:gap-6 lg:pl-4 lg:pr-4 xl:pl-8">
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: easeMajor }}
                className="max-w-fit border-l border-[#61DCA3]/60 pl-3 text-xs font-semibold text-[#61DCA3] sm:text-sm"
              >
                {t("hero.welcome")}
              </motion.p>

              <motion.h1
                key={`hero-title-${lang}`}
                initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.7, ease: easeMajor }}
                className="flex flex-col items-start gap-1 text-white"
              >
                <span
                  key={`hey-${lang}`}
                  className="text-4xl md:text-6xl font-semibold text-start leading-tight"
                >
                  {t("hero.hey")}
                </span>
                <span
                  key={`name-${lang}`}
                  className="font-accent text-5xl md:text-7xl font-medium italic text-start text-[#61DCA3] leading-tight"
                >
                  {t("hero.name")}
                </span>
              </motion.h1>

              <motion.p
                key={`hero-tagline-${lang}`}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.6, ease: easeMajor }}
                className="text-base md:text-lg text-white/70 max-w-md leading-relaxed"
              >
                {t("hero.tagline")}
              </motion.p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/api/cv"
                  download="CV-Akhyar.pdf"
                  className="group flex items-center gap-2
                             px-6 py-3 rounded-xl
                             bg-[#61DCA3] text-[#0B0F15]
                             font-semibold text-sm
                             shadow-[0_0_20px_rgba(97,220,163,0.3)]
                             hover:shadow-[0_0_32px_rgba(97,220,163,0.5)]
                             hover:bg-[#4ecf96]
                             transition-all duration-200 active:scale-95 cursor-pointer
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#61DCA3]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F15]"
                >
                  <span>{t("hero.download_cv")}</span>
                  <HiDownload className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" />
                </a>

                <div className="w-px h-8 bg-white/10 hidden sm:block" />

                <div className="flex gap-2">
                  {[
                    {
                      href: "https://instagram.com/akhyaar._",
                      Icon: FaInstagram,
                      label: "Instagram",
                    },
                    {
                      href: "https://www.linkedin.com/in/akhyarrr/",
                      Icon: FaLinkedin,
                      label: "LinkedIn",
                    },
                    {
                      href: "https://github.com/Akhyarrrrr",
                      Icon: FaGithub,
                      label: "GitHub",
                    },
                  ].map(({ href, Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-xl
                                 border border-white/10 bg-white/5
                                 text-white/70
                                 hover:border-[#61DCA3]/50 hover:bg-[#61DCA3]/10 hover:text-[#61DCA3]
                                 transition-all duration-200 cursor-pointer
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#61DCA3]/60"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lanyard: grid child on mobile, full-section absolute overlay on desktop */}
          <div className="max-lg:relative max-lg:col-span-7 max-lg:flex max-lg:justify-center lg:absolute lg:inset-0 lg:z-30 lg:mt-6">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: easeMajor }}
              className="max-lg:relative max-lg:-mt-24 max-lg:h-[530px] max-lg:w-full max-lg:max-w-[470px] max-lg:overflow-hidden max-lg:pt-22 max-lg:sm:-mt-28 max-lg:sm:h-[620px] max-lg:sm:max-w-[560px] max-lg:sm:pt-20 max-lg:md:-mt-24 max-lg:md:h-[700px] max-lg:md:max-w-[660px] max-lg:md:pt-24 lg:h-full lg:w-full"
            >
              {shouldMountLanyard ? (
                <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
              ) : (
                <LanyardPoster />
              )}
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}

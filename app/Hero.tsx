"use client";
import Lanyard from "./components/Lanyard/Lanyard";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiChevronDown, HiDownload } from "react-icons/hi";
import { useLanguage } from "../context/LanguageProvider";
import { motion } from "framer-motion";

export default function Hero() {
  const { t, lang } = useLanguage();

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100svh] overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_89%,rgba(97,220,163,0.22),transparent_34%),linear-gradient(180deg,rgba(8,13,18,0.97)_0%,rgba(8,13,18,0.84)_46%,rgba(8,13,18,0.62)_100%)] sm:bg-[radial-gradient(circle_at_50%_86%,rgba(97,220,163,0.2),transparent_36%),linear-gradient(180deg,rgba(8,13,18,0.97)_0%,rgba(8,13,18,0.8)_46%,rgba(8,13,18,0.56)_100%)] lg:bg-[radial-gradient(circle_at_74%_46%,rgba(97,220,163,0.18),transparent_34%),linear-gradient(90deg,rgba(8,13,18,0.95)_0%,rgba(8,13,18,0.72)_48%,rgba(8,13,18,0.42)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0B0F15] via-[#0B0F15]/92 to-transparent sm:h-32"
      />

      <div className="relative mx-auto h-full min-h-[100svh] max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[100svh] grid-cols-1 gap-3 pb-8 pt-24 sm:gap-4 sm:pb-10 sm:pt-28 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-0">

          {/* Left: text content */}
          <div className="relative z-20 flex items-center lg:col-span-5">
            <div className="flex w-full max-w-[34rem] flex-col gap-5 sm:gap-6 lg:pl-4 lg:pr-4 xl:pl-8">

              <motion.div
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              >
                <div className="inline-flex max-w-full items-center gap-2 rounded-full
                                border border-[#61DCA3]/30 bg-[#61DCA3]/10
                                px-3 py-1.5 sm:px-4 w-fit">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#61DCA3] animate-pulse sm:h-2 sm:w-2" />
                  <span className="max-w-[11.5rem] truncate text-[11px] font-medium text-[#61DCA3] sm:max-w-none sm:text-sm">
                    {t("hero.welcome")}
                  </span>
                </div>
              </motion.div>

              {/* Name */}
              <motion.h1
                key={`hero-title-${lang}`}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.7, ease: "easeOut" }}
                className="flex flex-col items-start gap-1 text-white"
              >
                <span
                  key={`hey-${lang}`}
                  className="text-4xl md:text-6xl font-bold text-start leading-tight"
                >
                  {t("hero.hey")}
                </span>
                <span
                  key={`name-${lang}`}
                  className="text-5xl md:text-7xl font-extrabold text-start text-[#61DCA3] leading-tight"
                >
                  {t("hero.name")}
                </span>
              </motion.h1>

              {/* Tagline */}
              <motion.p
                key={`hero-tagline-${lang}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.6, ease: "easeOut" }}
                className="text-base md:text-lg text-white/70 max-w-md leading-relaxed"
              >
                {t("hero.tagline")}
              </motion.p>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Download CV */}
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

                {/* Divider */}
                <div className="w-px h-8 bg-white/10 hidden sm:block" />

                {/* Social icons */}
                <div className="flex gap-2">
                  {[
                    { href: "https://instagram.com/akhyaar._",          Icon: FaInstagram, label: "Instagram" },
                    { href: "https://www.linkedin.com/in/akhyarrr/",    Icon: FaLinkedin,  label: "LinkedIn"  },
                    { href: "https://github.com/Akhyarrrrr",            Icon: FaGithub,    label: "GitHub"    },
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

          {/* Right: 3D Lanyard */}
          <div className="relative z-10 flex justify-center lg:col-span-7 lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
              className="relative -mt-24 h-[530px] w-full max-w-[470px] overflow-hidden pt-22 sm:-mt-28 sm:h-[620px] sm:max-w-[560px] sm:pt-20 md:-mt-24 md:h-[700px] md:max-w-[660px] md:pt-24 lg:mt-0 lg:pt-7 lg:h-[100svh] lg:min-h-[760px] lg:max-w-[800px] lg:overflow-visible lg:pt-0"
            >
              <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() =>
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
        }
        aria-label={lang === "id" ? "Gulir ke bawah" : "Scroll down"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="group absolute left-1/2 -translate-x-1/2 bottom-8 z-50
                   hidden lg:flex flex-col items-center gap-1
                   cursor-pointer"
      >
        <span className="text-[10px] font-medium text-white/50 uppercase tracking-widest">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-9 items-center justify-center rounded-full
                     border border-white/10 bg-white/5 backdrop-blur-md
                     text-[#61DCA3]
                     group-hover:border-[#61DCA3]/40 group-hover:bg-[#61DCA3]/10
                     transition-all duration-200"
        >
          <HiChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.button>
    </section>
  );
}

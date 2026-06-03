"use client";
import AnimatedContent from "./components/AnimatedContent/AnimatedContent";
import SplitText from "./components/SplitText/SplitText";
import BlurText from "./components/BlurText/BlurText";
import Lanyard from "./components/Lanyard/Lanyard";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiChevronDown, HiDownload } from "react-icons/hi";
import { useLanguage } from "../context/LanguageProvider";
import { motion } from "framer-motion";

export default function Hero() {
  const { t, lang } = useLanguage();

  return (
    <div
      className="container mx-auto max-w-screen-xl md:h-screen px-4 bg-[#0B0F15]"
      id="hero"
    >
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Left */}
        <div className="col-span-6 flex items-center pt-28 md:pt-0">
          <div className="flex items-center h-full">
            <div className="flex flex-col gap-6 ">
              <AnimatedContent
                distance={150}
                direction="horizontal"
                reverse={false}
                initialOpacity={0.2}
                animateOpacity
                scale={1.1}
                threshold={0.2}
              >
                <div className="flex items-center gap-2">
                  <h1 className="text-xl text-white font-semibold">
                    {t("hero.welcome")}
                  </h1>
                </div>
              </AnimatedContent>

              <div className="flex flex-col items-start text-white">
                <SplitText
                  key={`hey-${lang}`}
                  text={t("hero.hey")}
                  className="text-4xl md:text-6xl font-semibold text-start"
                  delay={50}
                  from={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
                  to={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                  threshold={0.2}
                  rootMargin="-50px"
                />

                <SplitText
                  key={`name-${lang}`}
                  text={t("hero.name")}
                  className="text-5xl md:text-6xl font-semibold text-start text-[#61DCA3]"
                  delay={75}
                  from={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
                  to={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                  threshold={0.2}
                  rootMargin="-50px"
                />
              </div>

              <BlurText
                text={t("hero.tagline")}
                delay={75}
                animateBy="words"
                direction="top"
                className="text-lg md:text-xl mb-8 text-white"
              />

              {/* CV + Socials */}
              <div className="flex items-center gap-4 relative z-50 justify-between">
                <div className="flex items-center gap-4 relative z-50">
                  <a
                    href="/api/cv"
                    download="CV-Akhyar.pdf"
                    className="flex items-center gap-2 px-4 md:px-8 py-2 md:py-4 rounded-lg border border-[#61DCA3] text-[#61DCA3] hover:bg-[#61DCA3] hover:text-white transition duration-300 active:scale-95"
                  >
                    <span>{t("hero.download_cv")}</span>
                    <HiDownload className="w-5 h-5" />
                  </a>
                </div>
                <div className="flex gap-3">
                  <a
                    href="https://instagram.com/akhyaar._"
                    target="_blank"
                    className="flex h-13 w-13 items-center justify-center rounded-full border border-[#61DCA3] text-[#61DCA3] hover:bg-[#61DCA3] hover:text-white transition"
                  >
                    <FaInstagram size={22} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/akhyarrr/"
                    target="_blank"
                    className="flex h-13 w-13 items-center justify-center rounded-full border border-[#61DCA3] text-[#61DCA3] hover:bg-[#61DCA3] hover:text-white transition"
                  >
                    <FaLinkedin size={22} />
                  </a>
                  <a
                    href="https://github.com/Akhyarrrrr"
                    target="_blank"
                    className="flex h-13 w-13 items-center justify-center rounded-full border border-[#61DCA3] text-[#61DCA3] hover:bg-[#61DCA3] hover:text-white transition"
                  >
                    <FaGithub size={22} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="col-span-6 mt-44 md:mt-0 pt-0 md:pt-8 -mb:20 md:mb-0 ">
          <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
        </div>
      </div>

      {/* Scroll Down button (center bottom) */}
      <motion.button
        onClick={() =>
          document
            .getElementById("experience")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        aria-label={lang === "id" ? "Gulir ke bawah" : "Scroll down"}
        initial={{ opacity: 0, y: 12, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        className="group absolute left-1/2 -translate-x-1/2 bottom-6 z-50 hidden lg:block"
      >
        <motion.span
          // bobbing loop
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-12 w-12 items-center justify-center rounded-full
               border border-white/10 bg-white/5 backdrop-blur-md
               text-[#61DCA3] shadow-[0_8px_24px_rgba(97,220,163,0.25)]
               hover:bg-white/10 transition"
        >
          {/* inner glow ring */}
          <span
            className="absolute inset-0 rounded-full ring-1 ring-[#61DCA3]/30 
                 group-hover:ring-[#61DCA3]/60 transition"
            aria-hidden
          />
          <HiChevronDown className="h-5 w-5" />
        </motion.span>
      </motion.button>
    </div>
  );
}

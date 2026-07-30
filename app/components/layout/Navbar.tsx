"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Menu, X, Globe, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";

const NAV_LINKS = [
  { key: "nav.home", href: "#hero" },
  { key: "nav.about", href: "#about" },
  { key: "nav.experience", href: "#experience" },
  { key: "nav.project", href: "#project" },
  { key: "nav.skills", href: "#skills" },
  { key: "nav.contact", href: "#contact" },
] as const;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLanguage();
  const { scrollY } = useScroll();

  useEffect(() => {
    setScrolled(scrollY.get() > 20);
  }, [scrollY]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 20;
    setScrolled((current) => (current === next ? current : next));
  });

  /* Close lang popover on outside click */
  useEffect(() => {
    if (!showLang) return;
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setShowLang(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showLang]);

  const changeLang = (next: "en" | "id") => {
    setLang(next);
    setShowLang(false);
    setIsOpen(false);
  };

  const nav = useMemo(
    () => ({
      home: t("nav.home"),
      about: t("nav.about"),
      experience: t("nav.experience"),
      project: t("nav.project"),
      skills: t("nav.skills"),
      contact: t("nav.contact"),
      language: t("nav.language"),
    }),
    [t],
  );

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] w-full px-4">
      <nav
        aria-label="Main navigation"
        className={`
          max-w-screen-xl mx-auto
          flex items-center justify-between gap-3
          px-4 sm:px-6 py-3 rounded-2xl
          border border-white/10
          backdrop-blur-xl bg-white/5
          transition-shadow duration-300
          ${scrolled ? "shadow-[0_8px_32px_rgba(0,0,0,0.4)]" : ""}
        `}
      >
        {/* Logo */}
        <a
          href="#hero"
          className="text-[#61DCA3] font-extrabold text-xl select-none tracking-tight
                     hover:opacity-80 transition-opacity duration-200"
          aria-label="Back to top"
        >
          Y.
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-1 items-center">
          {NAV_LINKS.map(({ key, href }) => (
            <li key={key}>
              <a
                href={href}
                className="relative px-3 py-1.5 rounded-lg text-sm font-medium text-white/80
                           hover:text-white hover:bg-white/8 transition-all duration-200
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#61DCA3]/60"
              >
                {t(key)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: lang + burger */}
        <div className="flex items-center gap-2">
          {/* Language selector, desktop */}
          <div className="relative hidden md:block" ref={menuRef}>
            <button
              onClick={() => setShowLang((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={showLang}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5
                         px-3 py-1.5 text-xs font-semibold text-white/80
                         hover:bg-white/10 hover:text-white
                         transition-all duration-200
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#61DCA3]/60
                         cursor-pointer"
            >
              <Globe size={14} className="shrink-0" />
              <span className="hidden sm:inline">{nav.language}</span>
              <span className="inline sm:hidden uppercase text-[10px]">
                {lang}
              </span>
            </button>

            <AnimatePresence>
              {showLang && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10
                             bg-[#0B0F15]/95 backdrop-blur-xl
                             shadow-[0_12px_40px_rgba(0,0,0,0.45)] overflow-hidden"
                >
                  <LangItem
                    active={lang === "en"}
                    label="English"
                    code="EN"
                    onClick={() => changeLang("en")}
                  />
                  <LangItem
                    active={lang === "id"}
                    label="Bahasa Indonesia"
                    code="ID"
                    onClick={() => changeLang("id")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Burger, mobile */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl
                       border border-white/10 bg-white/5 text-[#61DCA3]
                       hover:bg-white/10 transition-all duration-200 cursor-pointer"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 rounded-2xl border border-white/10
                       bg-[#0B0F15]/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)]
                       px-4 py-4 flex flex-col gap-1"
          >
            {NAV_LINKS.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-white/80
                           hover:text-white hover:bg-white/8 transition-all duration-200"
              >
                {t(key)}
              </a>
            ))}

            {/* Mobile lang toggle */}
            <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
              {(["en", "id"] as const).map((code) => (
                <button
                  key={code}
                  onClick={() => changeLang(code)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold
                              flex items-center justify-center gap-2
                              transition-all duration-200 cursor-pointer
                              ${
                                lang === code
                                  ? "border-[#61DCA3] bg-[#61DCA3]/15 text-[#61DCA3]"
                                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                              }`}
                >
                  {lang === code && <Check size={12} />}
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LangItem({
  active,
  label,
  code,
  onClick,
}: {
  active?: boolean;
  label: string;
  code: string;
  onClick: () => void;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm
                  transition-colors duration-150 cursor-pointer
                  ${active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
    >
      <div className="flex items-center gap-3">
        <span
          className="inline-flex h-6 w-6 items-center justify-center rounded-md
                         border border-white/15 bg-white/5 text-[10px] font-semibold"
        >
          {code}
        </span>
        <span>{label}</span>
      </div>
      {active && <Check size={14} className="text-[#61DCA3]" />}
    </button>
  );
}

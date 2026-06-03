"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { PiGlobeHemisphereEastBold, PiCheckBold } from "react-icons/pi";
import { useLanguage } from "../context/LanguageProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { lang, setLang, t } = useLanguage();

  const toggleMenu = () => setIsOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);

  const changeLang = (next: "en" | "id") => {
    setLang(next);
    setShowLang(false);
    closeMenu();
  };

  // close popover saat klik di luar
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setShowLang(false);
    }
    if (showLang) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showLang]);

  // text nav berdasarkan i18n
  const nav = useMemo(
    () => ({
      home: t("nav.home"),
      about: t("nav.about"),
      experience: t("nav.experience"),
      project: t("nav.project"),
      contact: t("nav.contact"),
      language: t("nav.language"),
      english: "English",
      indonesian: "Bahasa Indonesia",
    }),
    [t]
  );

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[999] w-full px-4">
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 px-4 sm:px-6 py-3 rounded-full flex items-center justify-between gap-3 max-w-screen-xl mx-auto">
        {/* Logo */}
        <a
          href="#hero"
          className="text-[#61DCA3] font-extrabold text-xl select-none"
        >
          Y.
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-white text-sm font-medium">
          <a href="#hero" className="hover:text-[#61DCA3] transition">
            {nav.home}
          </a>
          <a href="#about" className="hover:text-[#61DCA3] transition">
            {nav.about}
          </a>
          <a href="#experience" className="hover:text-[#61DCA3] transition">
            {nav.experience}
          </a>
          <a href="#project" className="hover:text-[#61DCA3] transition">
            {nav.project}
          </a>
          <a href="#contact" className="hover:text-[#61DCA3] transition">
            {nav.contact}
          </a>
        </nav>

        {/* Right: Language + Burger */}
        <div className="flex items-center gap-2">
          {/* Language selector (desktop) */}
          <div className="relative hidden md:block" ref={menuRef}>
            <button
              onClick={() => setShowLang((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={showLang}
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-[#61DCA3]/60"
            >
              <PiGlobeHemisphereEastBold className="text-white/80" />
              <span className="hidden sm:inline">{nav.language}</span>
              <span className="inline sm:hidden uppercase">{lang}</span>
            </button>

            {showLang && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#0B0F15]/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden"
              >
                <LangItem
                  active={lang === "en"}
                  label={nav.english}
                  code="EN"
                  onClick={() => changeLang("en")}
                />
                <LangItem
                  active={lang === "id"}
                  label={nav.indonesian}
                  code="ID"
                  onClick={() => changeLang("id")}
                />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-[#61DCA3] text-xl md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl py-4 px-6 text-white text-sm font-medium flex flex-col items-stretch gap-3 transition-all">
          <a
            href="#hero"
            onClick={closeMenu}
            className="hover:text-[#61DCA3] transition"
          >
            {nav.home}
          </a>
          <a
            href="#about"
            onClick={closeMenu}
            className="hover:text-[#61DCA3] transition"
          >
            {nav.about}
          </a>
          <a
            href="#experience"
            onClick={closeMenu}
            className="hover:text-[#61DCA3] transition"
          >
            {nav.experience}
          </a>
          <a
            href="#project"
            onClick={closeMenu}
            className="hover:text-[#61DCA3] transition"
          >
            {nav.project}
          </a>
          <a
            href="#contact"
            onClick={closeMenu}
            className="hover:text-[#61DCA3] transition"
          >
            {nav.contact}
          </a>

          {/* Language quick switch (mobile) */}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => changeLang("en")}
              className={`rounded-lg border px-3 py-2 flex items-center justify-center gap-2 transition ${
                lang === "en"
                  ? "border-[#61DCA3] bg-[#61DCA3] text-black"
                  : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              <span className="text-xs font-semibold">EN</span>
            </button>
            <button
              onClick={() => changeLang("id")}
              className={`rounded-lg border px-3 py-2 flex items-center justify-center gap-2 transition ${
                lang === "id"
                  ? "border-[#61DCA3] bg-[#61DCA3] text-black"
                  : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              <span className="text-xs font-semibold">ID</span>
            </button>
          </div>
        </div>
      )}
    </div>
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
      className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm transition ${
        active ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/15 bg-white/5 text-[10px] font-bold">
          {code}
        </span>
        <span>{label}</span>
      </div>
      {active && <PiCheckBold className="text-[#61DCA3]" />}
    </button>
  );
}

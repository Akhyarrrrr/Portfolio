"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { profile } from "@/content/profile";

type Lang = "en" | "id";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };
type TranslationNode = string | { readonly [key: string]: TranslationNode };

const dict = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      experience: "Experience",
      project: "Project",
      skills: "Skills",
      contact: "Contact",
      language: "Language",
    },
    hero: {
      welcome: profile.headline,
      hey: "Hey, I'm",
      name: profile.name,
      tagline: profile.tagline.en,
      download_cv: "Download CV",
    },
    skills: {
      badge: "Tech Stack",
      heading: "Tools I <span>Work With</span>",
      sub: "Technologies I use to build full-stack products and reliable systems end to end.",
    },
    experience: {
      heading: "My Journey Through <span>Code & Impact</span>",
      sub: "Roles, teaching, and production ownership that shaped how I build.",
    },
    project: {
      heading: "A Collection of <span>Projects I've Built</span>",
      sub: "A complete project collection, with flagship work first and clear details about workflows, architecture, trade-offs, and limitations.",
      filter_all: "All",
      filter_web: "Web",
      filter_mobile: "Mobile",
      filter_ml: "AI / ML",
      prev: "Prev",
      next: "Next",
      view_github: "View Project",
      noProjects: "No projects found in this category.",
    },
    contact: {
      heading: "Let's Talk",
      sub: "Send a short note about the role, project, or system you want to build.",
      name: "Your Name",
      email: "Your Email",
      message: "Your Message",
      send: "Send Message",
      sending: "Sending...",
      success: "Message sent successfully!",
      error: "Failed to send message. Please try again.",
    },
  },
  id: {
    nav: {
      home: "Beranda",
      about: "Tentang",
      experience: "Pengalaman",
      project: "Proyek",
      skills: "Keahlian",
      contact: "Kontak",
      language: "Bahasa",
    },
    hero: {
      welcome: profile.headline,
      hey: "Hai, saya",
      name: profile.name,
      tagline: profile.tagline.id,
      download_cv: "Unduh CV",
    },
    skills: {
      badge: "Tech Stack",
      heading: "Tools <span>yang saya gunakan</span>",
      sub: "Teknologi yang saya gunakan untuk membangun produk full-stack dan sistem yang andal dari awal hingga akhir.",
    },
    experience: {
      heading: "Perjalanan Saya Lewat <span>Code & Impact</span>",
      sub: "Peran, pengalaman mengajar, dan tanggung jawab produksi yang membentuk cara saya bekerja.",
    },
    project: {
      heading: "Kumpulan <span>Proyek yang Saya Bangun</span>",
      sub: "Kumpulan proyek lengkap dengan karya unggulan di awal serta penjelasan yang jelas tentang workflow, arsitektur, trade-off, dan batasannya.",
      filter_all: "Semua",
      filter_web: "Web",
      filter_mobile: "Mobile",
      filter_ml: "AI / ML",
      prev: "Sebelumnya",
      next: "Berikutnya",
      view_github: "Lihat Proyek",
      noProjects: "Tidak ada proyek di kategori ini.",
    },
    contact: {
      heading: "Mari Bicara",
      sub: "Kirim catatan singkat tentang posisi, proyek, atau sistem yang ingin Anda bangun.",
      name: "Nama Anda",
      email: "Email Anda",
      message: "Pesan Anda",
      send: "Kirim Pesan",
      sending: "Mengirim...",
      success: "Pesan berhasil dikirim!",
      error: "Pesan belum dapat dikirim. Silakan coba kembali.",
    },
  },
} as const;

const C = createContext<Ctx | null>(null);

function resolveTranslation(source: TranslationNode, key: string) {
  let current: TranslationNode | undefined = source;

  for (const part of key.split(".")) {
    if (!current || typeof current === "string" || !(part in current)) {
      return undefined;
    }

    current = current[part];
  }

  return typeof current === "string" ? current : undefined;
}

let currentLanguage: Lang = "en";

function readLanguage(): Lang {
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "id" || saved === "en") return saved;
  } catch {}
  return currentLanguage;
}

function subscribeLanguage(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener("portfolio-language", notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener("portfolio-language", notify);
  };
}

function setLang(lang: Lang) {
  currentLanguage = lang;
  try {
    localStorage.setItem("lang", lang);
  } catch {}
  window.dispatchEvent(new Event("portfolio-language"));
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore<Lang>(subscribeLanguage, readLanguage, () => "en");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key: string) =>
      resolveTranslation(dict[lang], key) ??
      resolveTranslation(dict.en, key) ??
      key,
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useLanguage() {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function RichText({ i18nKey }: { i18nKey: string }) {
  const { t } = useLanguage();
  return <span dangerouslySetInnerHTML={{ __html: t(i18nKey) }} />;
}

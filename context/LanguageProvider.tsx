"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
      contact: "Contact",
      language: "Language",
    },
    hero: {
      welcome: "Welcome to My Portfolio...",
      hey: "Hey, I'm",
      name: "Akhyar",
      tagline:
        "Full-stack engineer building production systems. I manage infrastructure for 90+ academic journals and ship side projects that actually work. Currently exploring remote opportunities to solve real problems at scale.",
      download_cv: "Download CV",
    },
    experience: {
      heading: "My Journey Through <span>Code & Impact</span>",
      sub: "A glimpse into my academic and professional growth, one line of code at a time.",
    },
    project: {
      heading: "Snippets of My <span>Selected Works</span>",
      sub: "A glimpse into my creations from interfaces to functionality crafted with code and intent.",
      filter_all: "All",
      filter_web: "Web",
      filter_mobile: "Mobile",
      prev: "Prev",
      next: "Next",
      view_github: "View Project",
      noProjects: "No projects found in this category.",
    },
    contact: {
      heading: "Let's Connect!",
      sub: "Have a project, idea, or just want to say hi? Fill the form below and I'll get back to you soon!",
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
      contact: "Kontak",
      language: "Bahasa",
    },
    hero: {
      welcome: "Selamat datang di Portofolio Saya...",
      hey: "Hai, saya",
      name: "Akhyar",
      tagline:
        "Full-stack engineer yang build production systems. Aku manage infrastructure untuk 90+ jurnal akademik dan ship side projects yang benar-benar kerja. Sekarang lagi explore remote opportunities untuk solve real problems di scale yang lebih besar.",
      download_cv: "Unduh CV",
    },
    experience: {
      heading: "Perjalanan Saya Lewat <span>Code & Impact</span>",
      sub: "Sekilas perkembangan akademik dan profesional, setapak demi setapak.",
    },
    project: {
      heading: "Kumpulan <span>Karya Terpilih</span> Saya",
      sub: "Sekilas karya saya, dari antarmuka hingga fungsionalitas yang dibuat dengan niat.",
      filter_all: "Semua",
      filter_web: "Web",
      filter_mobile: "Mobile",
      prev: "Sebelumnya",
      next: "Berikutnya",
      view_github: "Lihat di Github",
      noProjects: "Tidak ada proyek di kategori ini.",
    },
    contact: {
      heading: "Ayo Terhubung!",
      sub: "Punya proyek, ide, atau sekadar sapa? Isi form di bawah, aku akan segera membalas!",
      name: "Nama Anda",
      email: "Email Anda",
      message: "Pesan Anda",
      send: "Kirim Pesan 🚀",
      sending: "Mengirim...",
      success: "Pesan berhasil dikirim!",
      error: "Gagal mengirim pesan. Coba lagi ya.",
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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved === "id" || saved === "en") setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
    try {
      localStorage.setItem("lang", lang);
    } catch {}
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

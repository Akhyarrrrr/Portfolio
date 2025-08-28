"use client";
import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from "react";

type Lang = "en" | "id";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };

const dict = {
  en: {
    nav: { home: "Home", experience: "Experience", project: "Project", contact: "Contact", language: "Language" },
    hero: {
      welcome: "Welcome to My Portfolio...",
      hey: "Hey, I'm",
      name: "Akhyar",
      tagline:
        "Just finished my Informatics degree, and right now I'm really into building cool digital stuff from websites to mobile apps. I enjoy coding and love turning ideas into something real and useful. Got something in mind? Let's build it together!",
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
      view_github: "View on Github",
    },
    contact: {
      heading: "Let's Connect!",
      sub: "Have a project, idea, or just want to say hi? Fill the form below and I'll get back to you soon!",
      name: "Your Name",
      email: "Your Email",
      message: "Your Message",
      send: "Send Message 🚀",
      sending: "Sending...",
      success: "Message sent successfully!",
      error: "Failed to send message. Please try again.",
    },
  },
  id: {
    nav: { home: "Beranda", experience: "Pengalaman", project: "Proyek", contact: "Kontak", language: "Bahasa" },
    hero: {
      welcome: "Selamat datang di Portofolio Saya...",
      hey: "Hai, saya",
      name: "Akhyar",
      tagline:
        "Baru lulus Informatika, dan sekarang lagi suka bikin hal-hal digital dari website sampai mobile apps. Aku suka ngoding dan menyalakan ide jadi sesuatu yang nyata dan berguna. Ada ide? Yuk bangun bareng!",
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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  // load awal
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved === "id" || saved === "en") setLang(saved);
    } catch {}
  }, []);

  // sinkron ke <html lang> + persist
  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
    try {
      localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

  const t = (key: string) => {
    const parts = key.split(".");
    const val = parts.reduce<any>((o, k) => (o && k in o ? o[k] : undefined), dict[lang]);
    const fb = parts.reduce<any>((o, k) => (o && k in o ? o[k] : undefined), dict.en);
    return (val ?? fb ?? key) as string;
  };

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useLanguage() {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

// Untuk heading yang butuh <span> berwarna
export function RichText({ i18nKey }: { i18nKey: string }) {
  const { t } = useLanguage();
  return <span dangerouslySetInnerHTML={{ __html: t(i18nKey) }} />;
}

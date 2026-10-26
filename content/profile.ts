export const skillGroups = {
  Languages: ["TypeScript", "JavaScript", "PHP", "Python", "SQL", "Kotlin", "C#"],
  "Web & APIs": ["React", "Next.js", "Node.js", "Express.js", "Laravel", "WordPress", "REST API", "Tailwind CSS"],
  Mobile: ["React Native", "Expo", "Android Studio"],
  "Data & ML": ["PostgreSQL", "MySQL", "Supabase", "TensorFlow / Keras", "scikit-learn", "NumPy", "pandas"],
  Infrastructure: ["Linux", "Docker", "AWS EC2", "GCP", "CI/CD"],
  "Development Tools": ["Git", "GitHub", "AI-assisted development"],
} as const;

export const profile = {
  name: "Akhyar",
  alternateName: "Yar",
  jobTitle: "Software Engineer",
  focus: "Full-Stack Development & Production Systems",
  headline: "Software Engineer | Full-Stack Development & Production Systems",
  description:
    "Software engineer in Banda Aceh building web and mobile products, multi-tenant SaaS, and production systems. Open to remote opportunities in Indonesia and globally.",
  summary: {
    en: "Software engineer building web and mobile products from requirements and system design through deployment and ongoing support. Experience spans full-stack development, multi-tenant SaaS, applied AI, and infrastructure automation. I work directly with clients, make technical decisions, and handle production troubleshooting, with an emphasis on maintainable software and verification of delivered functionality.",
    id: "Saya Software Engineer yang membangun produk web dan mobile, mulai dari kebutuhan dan desain sistem hingga deployment dan dukungan berkelanjutan. Pengalaman saya mencakup pengembangan full-stack, SaaS multi-tenant, penerapan AI, dan otomasi infrastruktur. Saya bekerja langsung dengan klien, mengambil keputusan teknis, dan menangani kendala produksi dengan fokus pada kode yang mudah dirawat serta verifikasi hasil pengerjaan.",
  },
  tagline: {
    en: "I build web and mobile products, connect the systems behind them, and keep them running. From the first requirement to production and ongoing support.",
    id: "Saya membangun produk web dan mobile, menghubungkan sistem di baliknya, dan menjaga operasionalnya. Dari kebutuhan awal hingga produksi dan dukungan berkelanjutan.",
  },
  availability: {
    en: "Open to remote full-time, contract, and freelance opportunities in Indonesia and globally. Based in UTC+7 and comfortable collaborating in English. Start date and handover can be agreed with the hiring team; currently employed at LPPM.",
    id: "Terbuka untuk peluang remote full-time, kontrak, dan freelance di Indonesia maupun global. Berbasis di UTC+7 dan nyaman berkolaborasi dalam bahasa Inggris. Tanggal mulai serta serah terima dapat disepakati dengan tim perekrut; saat ini masih bekerja di LPPM.",
  },
  location: "Banda Aceh, Indonesia",
  email: "ahyar12324@gmail.com",
  phone: "(+62) 822-7533-1698",
  siteUrl: "https://akhyar.dev",
  socials: {
    github: "https://github.com/Akhyarrrrr",
    linkedin: "https://www.linkedin.com/in/akhyarrr/",
    instagram: "https://instagram.com/akhyaar._",
  },
  skills: Object.values(skillGroups).flat(),
} as const;

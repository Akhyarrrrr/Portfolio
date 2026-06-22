export const aiKnowledgeBase = {
  en: {
    about: `Akhyar is a 22-year-old frontend-focused full-stack web developer from Banda Aceh, Indonesia.
He recently graduated from Universitas Syiah Kuala with a Bachelor's in Informatics (GPA: 3.74/4.00, Cum Laude).
He is currently IT Staff and Web Administrator at LPPM USK, managing 90 active academic journals with 1,690+ annual submissions.`,
    role: `Frontend-focused full-stack web developer with 2+ years of hands-on experience building and shipping production web applications.`,
    currentRole: `IT Staff and Web Administrator at LPPM Universitas Syiah Kuala (Aug 2025 - Present)
- Administers 90 active academic journals on publications.usk.ac.id with 1,690+ annual submissions
- Handles journal provisioning, user account management, database maintenance, and custom front-end theming
- Responded to critical security incidents: gambling script injection and unauthorized redirects
- Built enterprise-grade backup and monitoring system with tiered daily backups, 15-minute health checks, daily security audits, and Telegram alerting
- Led full platform migration from OJS 2 to OJS 3 with zero data loss
- Engineered continuous health and security monitoring for 99.9% uptime`,
    experience: `Jan 2024 - Present: Freelance Full-Stack Web Developer
- Designed and delivered production web/mobile applications for multiple clients
- Managed full project lifecycle from requirements to deployment

Jun 2024 - Jul 2024: Full-Stack Developer Intern at BMKG Aceh Besar
- Built web-based employee leave management system with real-time tracking and PDF generation
- React.js + Tailwind CSS frontend, Express.js + MySQL backend

Feb 2024 - Dec 2024: Teaching Assistant at Universitas Syiah Kuala
- Delivered practical labs to 44 students in DevOps, Software Engineering, and Web Programming
- Guided CI/CD pipelines, DockerHub, GCP, Linux, and full-stack development

Feb 2024 - Jun 2024: Android Development at Bangkit Academy
- Completed structured Android development curriculum
- Capstone: MediGuide, a Kotlin AI health assistant app built in a cross-functional team of 6`,
    skills: {
      frontend: `React.js, Next.js, TypeScript, Tailwind CSS, HTML5, CSS3, Framer Motion, TensorFlow.js, face-api.js`,
      backend: `Node.js, Express.js, Adonis.js, Laravel, RESTful API design`,
      database: `PostgreSQL, MySQL/MariaDB, Supabase, Firebase, pgvector for vector search`,
      devops: `Linux, Docker, Bash scripting, GCP, AWS, CI/CD with DockerHub and GitHub Actions`,
      design: `Figma for UI/UX, wireframing, prototyping, draw.io, StarUML`,
      other: `React Native, Expo, Kotlin, Python, Git, Microsoft Office, Google Workspace`,
      languages: `Bahasa Indonesia (Native), English (Professional Working Proficiency)`,
    },
    projects: {
      presence: {
        name: "Presence",
        url: "https://presence-yar.vercel.app",
        description: `Workforce attendance system built around a face-recognition kiosk and admin dashboard. It handles liveness checks, vector matching with pgvector, shift scheduling, attendance monitoring, analytics, and PDF reports. Tech stack: Next.js 16, Supabase, PostgreSQL/pgvector, TensorFlow.js, face-api.js, Tailwind CSS, and Vercel.`,
      },
      taskflow: {
        name: "Taskflow",
        url: "https://taskflow-yar.vercel.app",
        description: `Kanban task manager for turning scattered work into a clear board. It includes Supabase auth, row-level security, drag-and-drop tasks, priorities, deadlines, and a responsive dark UI. Tech stack: Next.js 16, TypeScript, Supabase, dnd-kit, Tailwind CSS, and Vercel.`,
      },
      writly: {
        name: "Writly",
        url: "https://writly-yar.vercel.app",
        description: `Minimal publishing platform with a proper writing flow instead of a static blog. It supports public articles, filtering, admin management, draft/publish states, image handling, and a Tiptap rich-text editor. Tech stack: Next.js, TypeScript, Supabase, Tiptap, Tailwind CSS, and Vercel.`,
      },
      ilmana: {
        name: "Ilmana Initiative",
        url: "https://ilmanainitiative.com",
        description: `Science learning platform for Ilmana Initiative, covering student authentication, learning modules, pretest/posttest flow, material pages, admin content management, and a Gemini-powered learning chat. Built with React, Vite, Express, MySQL, JWT, and Tailwind CSS.`,
      },
      lacakkarirku: {
        name: "LacakKarirku",
        url: "https://lacakkarirku.vercel.app",
        description: `AI job-tracking platform that reads CV PDFs, extracts profile data, searches multiple job sources, scores vacancy matches, and turns applications into dashboard work. Built with Next.js, Clerk, Neon Postgres, Drizzle ORM, Groq AI, Cheerio, and Vercel Cron.`,
      },
      nutricycle: {
        name: "NutriCycle",
        url: "https://nutricycle.up.railway.app",
        description: `Laravel platform for organic waste pickup and recycled animal-feed products. It includes user/admin/petugas roles, pickup requests, product catalog, cart and checkout, Midtrans payments, Cloudinary uploads, points, and operational dashboards.`,
      },
      simbima: {
        name: "SIMBIMA",
        url: "https://simbima.up.railway.app",
        description: `Academic supervision management system for thesis guidance. It handles advisor requests, lecturer quotas, student/lecturer/admin dashboards, progress notes, readiness status, imports, notifications, and reporting. Built with Laravel and MySQL.`,
      },
      forterzzz: {
        name: "Forterzzz",
        description: `Responsive company profile website for Forterzzz, a web service team. The site focuses on service presentation, portfolio credibility, contact flow, and motion-rich landing interactions using React, Vite, Tailwind CSS, and EmailJS.`,
      },
      portfolioNext: {
        name: "Portfolio Next",
        url: "https://yarrr-portfolio.vercel.app",
        description: `Akhyar's current portfolio, rebuilt as a bilingual Next.js site with Firestore-managed projects, case-study pages, tech-stack filtering, Cloudinary images, dashboard CRUD, SEO, and an AI assistant powered by Groq.`,
      },
      portfolioTailwind: {
        name: "Portfolio Tailwind",
        url: "https://akhyarrrrr.github.io/portfolio-tailwind-css",
        description: `Earlier portfolio iteration built with Tailwind CSS, dark mode, typed text, responsive sections, EmailJS contact handling, and SweetAlert feedback. It shows the step from static layout toward a more polished personal site.`,
      },
      portfolioBasic: {
        name: "Portfolio Basic",
        url: "https://akhyarrrrr.github.io/Portfolio-HtmlCssJs",
        description: `First portfolio version built with plain HTML, CSS, and JavaScript. It kept the scope simple: personal profile, project showcase, responsive layout, and enough JavaScript to make the page feel interactive.`,
      },
      weddingInvitation: {
        name: "Wedding Invitation Web",
        url: "https://humamrikainvitation.netlify.app",
        description: `Custom digital wedding invitation built with Laravel Blade and Tailwind CSS. It includes couple profile sections, event details, countdown, gallery, background audio, story content, and map links for guests.`,
      },
      employeeLeave: {
        name: "Employee Leave System",
        description: `Web-based leave management system built during Akhyar's BMKG Aceh Besar internship. It replaced manual leave tracking with request management, approval flow, real-time status visibility, and PDF generation using React, Tailwind CSS, Express, and MySQL.`,
      },
      rwikistat: {
        name: "RWikiStat",
        description: `Cross-platform statistics learning product with web, backend, forum, and mobile app surfaces. Akhyar contributed to the iOS/mobile side with React Native and Expo, plus UI work in Figma. The project was tested with 22 students and reached an 88.26% UMUX usability score.`,
      },
      mediguide: {
        name: "MediGuide",
        description: `AI-powered virtual health assistant built as a Bangkit Academy capstone project by a cross-functional team of six. Akhyar contributed on the Android side using Kotlin, Android Studio, and Figma, with features around health information and chatbot interaction.`,
      },
    },
    education: `Bachelor of Informatics (Computer Science)
Universitas Syiah Kuala, 2021 - 2025
GPA: 3.74/4.00 (Cum Laude)
Relevant coursework: Web Development, Software Architecture, Mobile App Development, Data Structures and Algorithms, Object-Oriented Programming, Discrete Mathematics.`,
    certifications: `- Bangkit Academy 2024 Android Development Track (Jun 2024)
- Belajar Pengembangan Aplikasi Android Intermediate, Dicoding Indonesia (Jun 2024)
- Belajar Dasar Cloud dan Gen AI di AWS, Dicoding Indonesia (Mar 2024)
- Belajar Dasar Visualisasi Data, Dicoding Indonesia (Feb 2024)`,
    leadership: `Head of Student Welfare Management Department, Informatics Student Association (Feb 2024 - Jan 2025)
- Managed a department of 13 members
- Organized inter-batch networking events, new student orientation, and open dialogue sessions
- Created scholarship and competition info channel
- Kept programs on schedule and teams supported`,
    personalityTraits: `Akhyar is detail-oriented, ships production code, and cares about code quality.
He learns quickly, communicates clearly with clients and teams, and takes ownership of problems from detection to resolution.
He is based in Banda Aceh, Indonesia, and is actively seeking remote opportunities with global companies.`,
    contact: `Email: ahyar12324@gmail.com
Phone: (+62) 822-7533-1698
LinkedIn: linkedin.com/in/akhyarrr
GitHub: github.com/Akhyarrrrr
Portfolio: yarrr-portfolio.vercel.app`,
  },
  id: {
    about: `Akhyar adalah developer web full-stack berfokus frontend berusia 22 tahun dari Banda Aceh, Indonesia.
Dia baru lulus dari Universitas Syiah Kuala dengan gelar Sarjana Informatika (IPK: 3.74/4.00, Cum Laude).
Saat ini bekerja sebagai IT Staff dan Web Administrator di LPPM USK, mengelola 90 jurnal akademik aktif dengan 1.690+ submission per tahun.`,
    role: `Developer web full-stack berfokus frontend dengan 2+ tahun pengalaman membangun dan mengirim aplikasi web production.`,
    currentRole: `IT Staff dan Web Administrator di LPPM Universitas Syiah Kuala (Agu 2025 - Sekarang)
- Mengelola 90 jurnal akademik aktif di publications.usk.ac.id dengan 1.690+ submission per tahun
- Menangani provisioning jurnal, manajemen akun, maintenance database, dan custom front-end theming
- Merespons security incident kritis: gambling script injection dan unauthorized redirects
- Membangun sistem backup dan monitoring enterprise-grade dengan daily backup berjenjang, health check setiap 15 menit, daily security audit, dan Telegram alerting
- Memimpin migrasi platform dari OJS 2 ke OJS 3 dengan zero data loss
- Mengembangkan health dan security monitoring untuk 99.9% uptime`,
    experience: `Jan 2024 - Sekarang: Freelance Full-Stack Web Developer
- Mendesain dan mengirim aplikasi web/mobile production untuk beberapa client
- Mengelola full project lifecycle dari requirements sampai deployment

Jun 2024 - Jul 2024: Full-Stack Developer Intern di BMKG Aceh Besar
- Membangun employee leave management system berbasis web dengan real-time tracking dan PDF generation
- React.js + Tailwind CSS frontend, Express.js + MySQL backend

Feb 2024 - Dec 2024: Teaching Assistant di Universitas Syiah Kuala
- Mengajar practical lab ke 44 mahasiswa di DevOps, Software Engineering, dan Web Programming
- Membimbing CI/CD pipelines, DockerHub, GCP, Linux, dan full-stack development

Feb 2024 - Jun 2024: Android Development di Bangkit Academy
- Menyelesaikan kurikulum Android development terstruktur
- Capstone: MediGuide, AI health assistant app berbasis Kotlin dalam tim cross-functional berisi 6 orang`,
    skills: {
      frontend: `React.js, Next.js, TypeScript, Tailwind CSS, HTML5, CSS3, Framer Motion, TensorFlow.js, face-api.js`,
      backend: `Node.js, Express.js, Adonis.js, Laravel, RESTful API design`,
      database: `PostgreSQL, MySQL/MariaDB, Supabase, Firebase, pgvector untuk vector search`,
      devops: `Linux, Docker, Bash scripting, GCP, AWS, CI/CD dengan DockerHub dan GitHub Actions`,
      design: `Figma untuk UI/UX, wireframing, prototyping, draw.io, StarUML`,
      other: `React Native, Expo, Kotlin, Python, Git, Microsoft Office, Google Workspace`,
      languages: `Bahasa Indonesia (Native), English (Professional Working Proficiency)`,
    },
    projects: {
      presence: {
        name: "Presence",
        url: "https://presence-yar.vercel.app",
        description: `Sistem absensi tenaga kerja dengan face-recognition kiosk dan admin dashboard. Fitur utamanya mencakup liveness check, vector matching dengan pgvector, shift scheduling, monitoring absensi, analytics, dan export laporan PDF. Tech stack: Next.js 16, Supabase, PostgreSQL/pgvector, TensorFlow.js, face-api.js, Tailwind CSS, dan Vercel.`,
      },
      taskflow: {
        name: "Taskflow",
        url: "https://taskflow-yar.vercel.app",
        description: `Aplikasi task manager Kanban untuk merapikan pekerjaan yang tersebar menjadi board yang jelas. Fiturnya mencakup Supabase auth, row-level security, drag-and-drop task, priority, deadline, dan dark UI yang responsif. Tech stack: Next.js 16, TypeScript, Supabase, dnd-kit, Tailwind CSS, dan Vercel.`,
      },
      writly: {
        name: "Writly",
        url: "https://writly-yar.vercel.app",
        description: `Platform publishing minimal dengan alur menulis yang lebih serius daripada blog statis. Fiturnya mencakup artikel publik, filter, admin management, draft/publish state, image handling, dan rich-text editor Tiptap. Tech stack: Next.js, TypeScript, Supabase, Tiptap, Tailwind CSS, dan Vercel.`,
      },
      ilmana: {
        name: "Ilmana Initiative",
        url: "https://ilmanainitiative.com",
        description: `Platform belajar sains untuk Ilmana Initiative, mencakup autentikasi siswa, modul belajar, alur pretest/posttest, halaman materi, admin content management, dan chat belajar berbasis Gemini. Dibangun dengan React, Vite, Express, MySQL, JWT, dan Tailwind CSS.`,
      },
      lacakkarirku: {
        name: "LacakKarirku",
        url: "https://lacakkarirku.vercel.app",
        description: `Platform job tracking berbasis AI yang membaca CV PDF, mengekstrak data profil, mencari lowongan dari beberapa sumber, memberi match score, dan mengubah proses apply menjadi dashboard kerja yang rapi. Dibangun dengan Next.js, Clerk, Neon Postgres, Drizzle ORM, Groq AI, Cheerio, dan Vercel Cron.`,
      },
      nutricycle: {
        name: "NutriCycle",
        url: "https://nutricycle.up.railway.app",
        description: `Platform Laravel untuk pickup sampah organik dan produk pakan ternak hasil daur ulang. Fiturnya mencakup role user/admin/petugas, request pickup, katalog produk, cart dan checkout, pembayaran Midtrans, upload Cloudinary, points, dan dashboard operasional.`,
      },
      simbima: {
        name: "SIMBIMA",
        url: "https://simbima.up.railway.app",
        description: `Sistem manajemen bimbingan akademik untuk proses skripsi. SIMBIMA menangani request dosen pembimbing, kuota dosen, dashboard mahasiswa/dosen/admin, catatan progress, status kesiapan, import data, notifikasi, dan reporting. Dibangun dengan Laravel dan MySQL.`,
      },
      forterzzz: {
        name: "Forterzzz",
        description: `Website company profile responsif untuk Forterzzz, tim jasa pembuatan web. Fokusnya ada di penyajian layanan, kredibilitas portfolio, alur kontak, dan interaksi landing page yang dinamis memakai React, Vite, Tailwind CSS, dan EmailJS.`,
      },
      portfolioNext: {
        name: "Portfolio Next",
        url: "https://yarrr-portfolio.vercel.app",
        description: `Portfolio Akhyar yang sekarang, dibangun ulang sebagai website Next.js bilingual dengan project dari Firestore, halaman case study, filter tech stack, gambar Cloudinary, dashboard CRUD, SEO, dan AI assistant berbasis Groq.`,
      },
      portfolioTailwind: {
        name: "Portfolio Tailwind",
        url: "https://akhyarrrrr.github.io/portfolio-tailwind-css",
        description: `Iterasi portfolio sebelumnya yang dibuat dengan Tailwind CSS, dark mode, typed text, section responsif, form kontak EmailJS, dan feedback SweetAlert. Project ini menunjukkan transisi dari layout statis menuju personal site yang lebih matang.`,
      },
      portfolioBasic: {
        name: "Portfolio Basic",
        url: "https://akhyarrrrr.github.io/Portfolio-HtmlCssJs",
        description: `Versi portfolio pertama yang dibuat dengan HTML, CSS, dan JavaScript murni. Scope-nya sederhana: profil personal, showcase project, layout responsif, dan JavaScript secukupnya untuk membuat halaman terasa interaktif.`,
      },
      weddingInvitation: {
        name: "Wedding Invitation Web",
        url: "https://humamrikainvitation.netlify.app",
        description: `Undangan pernikahan digital custom yang dibangun dengan Laravel Blade dan Tailwind CSS. Isinya mencakup profil pasangan, detail acara, countdown, galeri, background audio, cerita pasangan, dan link peta untuk tamu.`,
      },
      employeeLeave: {
        name: "Employee Leave System",
        description: `Sistem manajemen cuti berbasis web yang dibangun saat internship Akhyar di BMKG Aceh Besar. Sistem ini mengganti tracking cuti manual dengan request management, approval flow, status real-time, dan PDF generation memakai React, Tailwind CSS, Express, dan MySQL.`,
      },
      rwikistat: {
        name: "RWikiStat",
        description: `Produk pembelajaran statistik cross-platform dengan web, backend, forum, dan mobile app. Akhyar berkontribusi di sisi iOS/mobile memakai React Native dan Expo, serta UI di Figma. Project ini diuji ke 22 mahasiswa dan mencapai UMUX usability score 88.26%.`,
      },
      mediguide: {
        name: "MediGuide",
        description: `Virtual health assistant berbasis AI dari capstone Bangkit Academy yang dikerjakan oleh tim cross-functional berisi enam orang. Akhyar berkontribusi di sisi Android memakai Kotlin, Android Studio, dan Figma, dengan fitur seputar informasi kesehatan dan interaksi chatbot.`,
      },
    },
    education: `Sarjana Informatika (Computer Science)
Universitas Syiah Kuala, 2021 - 2025
IPK: 3.74/4.00 (Cum Laude)
Relevant coursework: Web Development, Software Architecture, Mobile App Development, Data Structures and Algorithms, Object-Oriented Programming, Discrete Mathematics.`,
    certifications: `- Bangkit Academy 2024 Android Development Track (Jun 2024)
- Belajar Pengembangan Aplikasi Android Intermediate, Dicoding Indonesia (Jun 2024)
- Belajar Dasar Cloud dan Gen AI di AWS, Dicoding Indonesia (Mar 2024)
- Belajar Dasar Visualisasi Data, Dicoding Indonesia (Feb 2024)`,
    leadership: `Head of Student Welfare Management Department, Informatics Student Association (Feb 2024 - Jan 2025)
- Mengelola department berisi 13 anggota
- Mengorganisir inter-batch networking events, new student orientation, dan open dialogue sessions
- Membuat channel info scholarship dan competition
- Menjaga program tetap on schedule dan team tetap supported`,
    personalityTraits: `Akhyar detail-oriented, ship production code, dan peduli pada code quality.
Dia cepat belajar, berkomunikasi jelas dengan client dan team, serta mengambil ownership dari problem detection sampai resolution.
Dia berbasis di Banda Aceh, Indonesia, dan aktif mencari remote opportunities dengan global companies.`,
    contact: `Email: ahyar12324@gmail.com
Phone: (+62) 822-7533-1698
LinkedIn: linkedin.com/in/akhyarrr
GitHub: github.com/Akhyarrrrr
Portfolio: yarrr-portfolio.vercel.app`,
  },
} as const;

export type KnowledgeLanguage = keyof typeof aiKnowledgeBase;

export function getKnowledgeContext(lang: KnowledgeLanguage): string {
  const kb = aiKnowledgeBase[lang] ?? aiKnowledgeBase.en;

  return `You are Akhyar's portfolio AI assistant. Here is comprehensive information about Akhyar:

ABOUT:
${kb.about}

ROLE:
${kb.role}

CURRENT ROLE:
${kb.currentRole}

EXPERIENCE:
${kb.experience}

SKILLS:
Frontend: ${kb.skills.frontend}
Backend: ${kb.skills.backend}
Database: ${kb.skills.database}
DevOps: ${kb.skills.devops}
Design: ${kb.skills.design}
Other: ${kb.skills.other}
Languages: ${kb.skills.languages}

PROJECTS:
${Object.values(kb.projects)
  .map((project) => `${project.name}${"url" in project ? ` (${project.url})` : ""}: ${project.description}`)
  .join("\n\n")}

EDUCATION:
${kb.education}

CERTIFICATIONS:
${kb.certifications}

LEADERSHIP:
${kb.leadership}

CONTACT:
${kb.contact}

PERSONALITY:
${kb.personalityTraits}

INSTRUCTIONS:
- Answer questions about Akhyar's work, projects, skills, and experience.
- Be concise, professional, and friendly.
- If asked about something unrelated, politely redirect to Akhyar's portfolio context.
- Do not invent facts beyond this knowledge base.
- Keep responses under 120 words unless the user explicitly asks for details.
- Use 1-2 short paragraphs. Avoid numbered lists unless the user asks for a list.
- End with a complete sentence.
- Use the user's preferred language: ${lang === "en" ? "English" : "Bahasa Indonesia"}.`;
}

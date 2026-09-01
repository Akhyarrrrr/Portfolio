# Akhyar's Portfolio

Personal portfolio built with Next.js 16, TypeScript, Tailwind CSS, source-controlled MDX content, and a constrained AI assistant.

## Overview

Public portfolio website with bilingual case studies, a contact form, CV download, and a Groq-powered chatbot. The homepage reads project and experience data server-side; project detail pages provide individual case-study URLs with structured data.

## Features

- Server-rendered homepage with animated client sections
- Individual project detail pages (`/projects/[slug]`) with related projects
- Bilingual content (EN/ID)
- Featured project pinning with custom ordering
- Source-controlled MDX project content
- Contact form via the Resend API
- CV download proxied dynamically from GitHub
- Portfolio chatbot powered by Groq
- Shared tech-stack registry for badges, labels, and autocomplete
- JSON-LD structured data (Person, SoftwareApplication)
- Splash screen intro animation
- SEO: sitemap.xml, robots.txt, per-page metadata, OG images

## Tech Stack

| Layer | Packages |
|---|---|
| Core | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Motion | Framer Motion, Lottie (dotlottie-react) |
| 3D | Three.js, React Three Fiber, Drei, Rapier, meshline |
| Data | MDX frontmatter, typed TypeScript content |
| Server | Resend (email), Groq SDK |
| UI | React Icons, Lucide React, clsx, tailwind-merge |

## Project Structure

```text
app/
  api/                       Route handlers (chatbot, cv, send-email, upload)
  components/
    layout/                  Navbar, footer, background, scroll-to-top
    sections/                Homepage sections (Hero, Skills, Project, Experience, Contact, Tape)
    projects/                ProjectModal for detail overlay
    schema/                  JsonLd component
    splash/                  SplashScreen intro
    ui/                      Reusable primitives (3d-pin, SectionHeading, TechInitials, etc.)
  projects/[slug]/           Dynamic project detail page (SSR + static params)
context/                     LanguageProvider (i18n)
content/                     MDX projects, typed experience and profile data
lib/                         Content reader, tech-stack, schema generator, rate limiter
public/                      Static assets
```

## Pages

| Route | Description |
|---|---|
| `/` | Landing — SSR data fetch, lazy-mounted animated sections |
| `/projects/[slug]` | Individual project case study with related projects |

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/chatbot` | POST | Groq AI chatbot (`openai/gpt-oss-20b`) |
| `/api/cv` | GET | CV PDF download |
| `/api/send-email` | POST | Contact form email via the Resend API |

## Environment Variables

These six variables are the complete runtime configuration. The previous
Firebase, Cloudinary, and admin keys were removed with the retired dashboard
workflow and are no longer referenced.

```env
RESEND_API_KEY=                 # Resend API key (contact form)
CONTACT_FROM_EMAIL=             # Verified sender, e.g. "Portfolio <noreply@akhyar.dev>"
EMAIL_RECEIVER=                 # Where contact submissions land

GROQ_API_KEY=                   # Portfolio chatbot

GITHUB_CV_TOKEN=                # Optional — private GitHub repository access
GITHUB_CV_RAW_URL=              # Optional — override the official raw CV URL
```

`CONTACT_FROM_EMAIL` must be on a domain verified in Resend. Before the domain
is verified, Resend's shared sender works: `Portfolio <onboarding@resend.dev>`.

## Content Model

### Project

`title`, `title_en`, `title_id`, `slug`, `description`, `desc_en`, `desc_id`, `category`, `tech[]`, `imageUrl`, `githubUrl`, `liveUrl`, `pinned`, `order`, `problemStatement`, `problemStatement_id`, `solutionApproach`, `solutionApproach_id`, `impact`, `impact_id`, `techRationale`, `techRationale_id`, `keyFeatures[]`, `screenshots[]`, `year`, `duration`, `role`, `learnings`, `learnings_id`

### Experience

`title`, `company`, `year`, `logo`, `description`

## Scripts

```bash
npm run dev      # Next.js dev server (webpack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # TypeScript type-check (tsc --noEmit)
```

## Content Workflow

1. Edit project frontmatter under `content/projects/` or typed experience data in `content/experience.ts`.
2. Run lint and production build checks.
3. Review bilingual copy, project routes, and public links before publishing.

## Deployment

Optimized for Vercel. Runs on any platform supporting Next.js with the required environment variables.

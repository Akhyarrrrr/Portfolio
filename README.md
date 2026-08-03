# Akhyar's Portfolio

Personal portfolio built with Next.js 16, TypeScript, Tailwind CSS, Firebase, and a custom admin dashboard.

## Overview

Public portfolio website with authenticated dashboard for content management, contact form, CV download, and a Groq-powered chatbot. The homepage fetches data server-side; project detail pages support individual case-study URLs with structured data.

## Features

- Server-rendered homepage with animated client sections
- Individual project detail pages (`/projects/[slug]`) with related projects
- Bilingual content (EN/ID)
- Firebase Auth — Google login gated to admin email
- Dashboard CRUD for projects and experiences
- Featured project pinning with custom ordering
- Image upload to Cloudinary
- Contact form via the Resend API
- CV download with remote GitHub fallback
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
| Data | Firebase Auth, Firestore (client + admin), Cloudinary |
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
  dashboard/
    _components/             Shared dashboard UI
    projects/                Project CRUD page
    experiences/             Experience CRUD page
  projects/[slug]/           Dynamic project detail page (SSR + static params)
  login/                     Firebase Google Auth
context/                     AuthContext, LanguageProvider (i18n)
lib/                         Firebase, Firestore CRUD, Firestore server, Cloudinary, tech-stack, schema generator
public/                      Static assets
```

## Pages

| Route | Description |
|---|---|
| `/` | Landing — SSR data fetch, lazy-mounted animated sections |
| `/projects/[slug]` | Individual project case study with related projects |
| `/login` | Firebase Google Auth, restricted to admin email |
| `/dashboard` | Admin hub (client-side auth gate) |
| `/dashboard/projects` | Project CRUD |
| `/dashboard/experiences` | Experience CRUD |

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/chatbot` | POST | Groq AI chatbot (`llama-3.1-8b-instant`) |
| `/api/cv` | GET | CV PDF download |
| `/api/send-email` | POST | Contact form email via the Resend API |

## Environment Variables

These six are every variable the code actually reads. The Firebase, Cloudinary
and admin keys this file used to list died with the Firebase removal
(`5b5213d`) and are no longer referenced anywhere.

```env
RESEND_API_KEY=                 # Resend API key (contact form)
CONTACT_FROM_EMAIL=             # Verified sender, e.g. "Portfolio <noreply@akhyar.dev>"
EMAIL_RECEIVER=                 # Where contact submissions land

GROQ_API_KEY=                   # Portfolio chatbot

GITHUB_CV_TOKEN=                # Optional — remote CV fallback
GITHUB_CV_RAW_URL=              # Optional — remote CV fallback
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

## Admin Workflow

1. Login at `/login` with the allowed Google account.
2. Navigate to `/dashboard`.
3. Manage projects and experiences — add tech tags, pin featured items, upload images.

## Deployment

Optimized for Vercel. Runs on any platform supporting Next.js with the required environment variables.

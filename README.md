# Yar's Portfolio

Modern personal portfolio built with Next.js, TypeScript, Tailwind CSS, Firebase, and a custom admin dashboard for managing portfolio content.

## Overview

This project is a full personal portfolio system, not just a landing page. It includes a public-facing portfolio website, an authenticated dashboard for content management, file upload support, contact email delivery, CV download handling, and a Groq-powered chatbot experience.

## Features

- Responsive portfolio homepage with animated sections
- Bilingual content support
- Protected admin login flow with Firebase Auth
- CRUD dashboard for projects and experiences
- Featured project pinning with custom ordering
- Project image upload flow
- Contact form email delivery
- Downloadable CV endpoint with remote GitHub fallback
- Portfolio chatbot powered by Groq
- Shared tech-stack registry for clean badges, labels, and suggestions

## Tech Stack

### Core

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### UI and Motion

- Framer Motion
- React Icons
- Lucide React
- Three.js
- React Three Fiber
- Drei
- Rapier

### Backend and Services

- Firebase Auth
- Firestore
- Cloudinary
- Nodemailer
- Groq SDK

## Project Structure

```text
app/
  api/                      API routes for chatbot, CV, upload, and email
  components/
    common/                 Shared utility components
    layout/                 Navbar, footer, background, scroll tools
    sections/               Homepage sections
    GroqChatbot/            Floating chatbot UI
    ui/                     Visual UI primitives
  dashboard/
    _components/            Shared dashboard UI pieces
    experiences/            Experience management page
    projects/               Project management page
context/                    Auth and language providers
lib/                        Firebase, Firestore, Cloudinary, tech registry, utilities
public/                     Static assets
types/                      Local type declarations
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_ADMIN_EMAIL=
ADMIN_EMAIL=

GROQ_API_KEY=

EMAIL_USER=
EMAIL_PASS=
EMAIL_RECEIVER=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GITHUB_CV_TOKEN=
GITHUB_CV_RAW_URL=
```

Notes:

- `NEXT_PUBLIC_ADMIN_EMAIL` is used on the client login flow.
- `ADMIN_EMAIL` is used by protected server routes and can match the same account.
- `GITHUB_CV_RAW_URL` is optional. If the remote CV fetch fails, the app falls back to the local PDF in `public/`.
- The current client-side upload helper still contains default Cloudinary constants in [lib/cloudinary.ts](/Y:/PROJECT/portfolio-next/lib/cloudinary.ts:1). Those can be moved into environment variables later if you want fully env-based configuration.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

`npm run lint` currently runs TypeScript type checking via `tsc --noEmit`.

## Admin Workflow

1. Login through `/login` using the allowed Firebase account.
2. Open `/dashboard`.
3. Manage projects and experiences from the dashboard pages.
4. Add tech tags, pin featured projects, and upload portfolio images.

## API Routes

- `POST /api/chatbot` - respond to portfolio questions through Groq
- `GET /api/cv` - download the CV PDF
- `POST /api/send-email` - send contact form messages
- `POST /api/upload` - protected image upload endpoint

## Content Model

### Project

- `title`
- `title_en`
- `title_id`
- `description`
- `desc_en`
- `desc_id`
- `category`
- `tech[]`
- `imageUrl`
- `href`
- `pinned`
- `order`

### Experience

- `title`
- `company`
- `year`
- `logo`
- `description`

## Quality Notes

- Lazy-mounted homepage sections are configured to keep anchor navigation working correctly.
- Tech badges, project labels, and dashboard suggestions now use one shared catalog for consistency.
- Optional integrations such as email, chatbot, and remote CV fetching fail gracefully when configuration is incomplete.

## Deployment

This project is well-suited for Vercel deployment, but it can run on any platform that supports Next.js with the required environment variables configured.

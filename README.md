# Akhyar's Portfolio

Bilingual portfolio for recruiters, engineering teams, and clients considering Akhyar for remote software-engineering work. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

The site presents full-stack development and production-system experience, project evidence, education, availability, contact details, and the current CV. Keep the established visual identity, readable recruiter paths, keyboard access, and reduced-motion behavior.

## Run and verify

```powershell
npm ci
npm run dev
npm run lint
npm run build
npm run start
```

`lint` runs ESLint and TypeScript. `build` produces the production application with webpack. CI runs both on Node.js 22. Review the homepage, English/Indonesian switch, project filters and details, mobile layout, and CV download before publishing.

## Source layout

```text
app/
  api/                       chatbot, cv, and send-email handlers
  components/                homepage sections, navigation, chatbot, and 3D scene
  projects/[slug]/           individual case studies
content/
  profile.ts                 identity, positioning, availability, and shared skill groups
  experience.ts              bilingual work and education timeline
  projects/*.mdx             bilingual project frontmatter
context/LanguageProvider.tsx  interface translations and language preference
lib/                         content reader, badges, AI context, schemas, motion, rate limiting
public/                      referenced images, animation/3D assets, and cv_akhyar.pdf
types/                       asset and meshline declarations
.github/workflows/ci.yml      lint and production build
```

The homepage reads content on the server. Detail routes use the same project records. The chatbot context and structured data reuse the profile, experience, and project sources.

## Content and evidence

Facts were reconciled with the owner and the final CV on 26 October 2026. The local career record is `D:\PROJECT\CV_Akhyar\career_master.md`; this portfolio is a public presentation, not a copy of private operational notes.

- Positioning: **Software Engineer — Full-Stack Development & Production Systems**.
- LPPM remains Aug 2025–Present. Freelance work began in 2024; Joki IT assignments began in July 2026.
- The master's program is Aug 2026–Present at Universitas Syiah Kuala. No estimated graduation date or completed degree is claimed.
- Featured order: Gilir, RWikiStat, Presence, LacakKarirku, and the Dicoding ML course projects. Earlier projects remain available in the gallery.
- Gilir has launched without active tenants yet; Mayar has been tested with a real production payment.
- RWikiStat's 88.26% UMUX result is a usability evaluation with 22 Statistics students. Its App Store release is historical and currently unavailable.
- Presence liveness is demonstration-grade. Dicoding work has no published accuracy or certification claim.
- OJS data transfers were assisted through dashboards. The OJS 3.3 to 3.5 upgrade was tested locally; do not describe it as a production migration.
- Class sizes are 44 Web Programming and 41 Software Engineering students, not 85 unique students.
- Coding-agent planning, context, review, and validation are distinct from ML model training.

Edit shared identity and skills in `content/profile.ts`, timeline entries in `content/experience.ts`, and case studies in `content/projects/`. Keep English and Indonesian facts equivalent. Each MDX file uses frontmatter parsed by gray-matter; its body is not rendered. The TypeScript interfaces in `lib/content.ts` define supported fields. Project categories are `web`, `mobile`, and `ml`; coursework uses `CreativeWork` structured data.

Do not publish internal server paths, forensic details, credentials, unverified adoption metrics, or absolute security guarantees.

## CV download

`public/cv_akhyar.pdf` is a distribution copy of the final two-page CV. `GET /api/cv` validates the PDF signature and serves it as an attachment. It uses no GitHub token or network request. File tracing explicitly includes the PDF in the server route.

After changing the canonical CV, copy the new PDF and verify the checksum:

```powershell
Copy-Item -LiteralPath D:\PROJECT\CV_Akhyar\cv_akhyar.pdf -Destination .\public\cv_akhyar.pdf
node -e "const fs=require('node:fs'),crypto=require('node:crypto'); for (const p of process.argv.slice(1)) console.log(crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),p)" D:\PROJECT\CV_Akhyar\cv_akhyar.pdf .\public\cv_akhyar.pdf
```

## Optional service configuration

Store local secrets in `.env.local`; never commit them.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Contact form delivery |
| `CONTACT_FROM_EMAIL` | Resend-verified sender |
| `EMAIL_RECEIVER` | Contact form recipient |
| `GROQ_API_KEY` | Portfolio chatbot |
| `GROQ_MODEL` | Optional model override; defaults to `openai/gpt-oss-20b` |

Contact delivery uses the Resend HTTP API; the chatbot uses the Groq SDK. Without the corresponding configuration, these services return an unavailable response. Profile pages and CV download work independently.

The contact endpoint validates JSON field types, allows multiline messages, blocks header injection in sender fields, uses a honeypot, and rate-limits requests. The chatbot validates history entries, bounds the conversation sent to Groq, and uses owner-confirmed portfolio context. Rate limits are in-memory per server instance; a multi-instance deployment needs shared storage if a global limit is required.

## Maintenance and deployment

Unused Claude launch configuration, completed design plans/specifications, redundant product documentation, unreferenced assets, and dead badge helpers were removed. Necessary product guidance is consolidated here. Active environment files, Vercel configuration, CI, and referenced media are preserved.

The application supports Vercel or a Node.js Next.js host. Publishing is a separate step from local editing and verification.

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Replaces lib/firestoreServer.ts (Fase 2) — same shapes, same function
// names, so app/page.tsx, app/sitemap.ts, and app/projects/[slug]/page.tsx
// need no changes. Content now lives in content/projects/*.mdx and
// content/experience.ts instead of Firestore.

export interface ProjectType {
  id: string;
  slug: string;
  title?: string;
  title_en?: string;
  title_id?: string;
  description?: string;
  desc_en?: string;
  desc_id?: string;
  category: string;
  tech: string[];
  imageUrl: string;
  href?: string;
  githubUrl?: string;
  liveUrl?: string;
  pinned?: boolean;
  order?: number;
  // Case study fields
  problemStatement?: string;
  problemStatement_id?: string;
  solutionApproach?: string;
  solutionApproach_id?: string;
  impact?: string;
  impact_id?: string;
  techRationale?: string;
  techRationale_id?: string;
  keyFeatures?: string[];
  screenshots?: string[];
  year?: string;
  duration?: string;
  role?: string;
  learnings?: string;
  learnings_id?: string;
}

export interface ExperienceType {
  id: string;
  title: string;
  company: string;
  year: string;
  logo: string;
  description: string;
}

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

function readProjectFile(filename: string): ProjectType {
  const raw = readFileSync(path.join(PROJECTS_DIR, filename), "utf-8");
  const { data } = matter(raw);
  const slug = (data.slug as string) ?? filename.replace(/\.mdx$/, "");
  return {
    id: slug,
    slug,
    title: data.title ?? "",
    title_en: data.title_en,
    title_id: data.title_id,
    description: data.description ?? "",
    desc_en: data.desc_en,
    desc_id: data.desc_id,
    category: data.category ?? "",
    tech: Array.isArray(data.tech) ? data.tech : [],
    imageUrl: data.imageUrl ?? "",
    href: data.href,
    githubUrl: data.githubUrl,
    liveUrl: data.liveUrl,
    pinned: data.pinned ?? false,
    order: data.order,
    problemStatement: data.problemStatement,
    problemStatement_id: data.problemStatement_id,
    solutionApproach: data.solutionApproach,
    solutionApproach_id: data.solutionApproach_id,
    impact: data.impact,
    impact_id: data.impact_id,
    techRationale: data.techRationale,
    techRationale_id: data.techRationale_id,
    keyFeatures: Array.isArray(data.keyFeatures) ? data.keyFeatures : undefined,
    screenshots: Array.isArray(data.screenshots) ? data.screenshots : undefined,
    year: data.year,
    duration: data.duration,
    role: data.role,
    learnings: data.learnings,
    learnings_id: data.learnings_id,
  };
}

// ── Projects ──────────────────────────────────────────────────

export async function getProjects(): Promise<ProjectType[]> {
  const files = readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".mdx"));
  const projects = files.map(readProjectFile);
  // Matches the previous Firestore `.orderBy("title")` (ascending).
  projects.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
  return projects;
}

export async function getProjectBySlug(slug: string): Promise<ProjectType | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

// ── Experiences ───────────────────────────────────────────────

export async function getExperiences(): Promise<ExperienceType[]> {
  const { experiences } = await import("@/content/experience");
  // Matches the previous Firestore `.orderBy("year", "desc")`.
  return [...experiences].sort((a, b) => (a.year < b.year ? 1 : a.year > b.year ? -1 : 0));
}

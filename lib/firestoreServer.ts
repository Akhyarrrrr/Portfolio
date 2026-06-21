import { getAdminDb } from "./firestoreAdmin";
import type { ProjectType, ExperienceType } from "./firestoreCrud";

// ── Projects ──────────────────────────────────────────────────

export async function getProjects(): Promise<ProjectType[]> {
  const db = getAdminDb();
  if (!db) return [];

  const snapshot = await db
    .collection("project")
    .orderBy("title")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: data.slug ?? "",
      title: data.title ?? "",
      title_en: data.title_en ?? undefined,
      title_id: data.title_id ?? undefined,
      description: data.description ?? "",
      desc_en: data.desc_en ?? undefined,
      desc_id: data.desc_id ?? undefined,
      category: data.category ?? "",
      tech: Array.isArray(data.tech) ? data.tech : [],
      imageUrl: data.imageUrl ?? "",
      href: data.href ?? undefined,
      githubUrl: data.githubUrl ?? undefined,
      liveUrl: data.liveUrl ?? undefined,
      pinned: data.pinned ?? false,
      order: data.order ?? undefined,
      problemStatement: data.problemStatement ?? undefined,
      problemStatement_id: data.problemStatement_id ?? undefined,
      solutionApproach: data.solutionApproach ?? undefined,
      solutionApproach_id: data.solutionApproach_id ?? undefined,
      impact: data.impact ?? undefined,
      impact_id: data.impact_id ?? undefined,
      techRationale: data.techRationale ?? undefined,
      techRationale_id: data.techRationale_id ?? undefined,
      keyFeatures: Array.isArray(data.keyFeatures) ? data.keyFeatures : undefined,
      screenshots: Array.isArray(data.screenshots) ? data.screenshots : undefined,
      year: data.year ?? undefined,
      duration: data.duration ?? undefined,
      role: data.role ?? undefined,
      learnings: data.learnings ?? undefined,
      learnings_id: data.learnings_id ?? undefined,
    } satisfies ProjectType;
  });
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectType | null> {
  const db = getAdminDb();
  if (!db) return null;

  const snapshot = await db
    .collection("project")
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    slug: data.slug ?? "",
    title: data.title ?? "",
    title_en: data.title_en ?? undefined,
    title_id: data.title_id ?? undefined,
    description: data.description ?? "",
    desc_en: data.desc_en ?? undefined,
    desc_id: data.desc_id ?? undefined,
    category: data.category ?? "",
    tech: Array.isArray(data.tech) ? data.tech : [],
    imageUrl: data.imageUrl ?? "",
    href: data.href ?? undefined,
    githubUrl: data.githubUrl ?? undefined,
    liveUrl: data.liveUrl ?? undefined,
    pinned: data.pinned ?? false,
    order: data.order ?? undefined,
    problemStatement: data.problemStatement ?? undefined,
    problemStatement_id: data.problemStatement_id ?? undefined,
    solutionApproach: data.solutionApproach ?? undefined,
    solutionApproach_id: data.solutionApproach_id ?? undefined,
    impact: data.impact ?? undefined,
    impact_id: data.impact_id ?? undefined,
    techRationale: data.techRationale ?? undefined,
    techRationale_id: data.techRationale_id ?? undefined,
    keyFeatures: Array.isArray(data.keyFeatures) ? data.keyFeatures : undefined,
    screenshots: Array.isArray(data.screenshots) ? data.screenshots : undefined,
    year: data.year ?? undefined,
    duration: data.duration ?? undefined,
    role: data.role ?? undefined,
    learnings: data.learnings ?? undefined,
    learnings_id: data.learnings_id ?? undefined,
  } satisfies ProjectType;
}

// ── Experiences ───────────────────────────────────────────────

export async function getExperiences(): Promise<ExperienceType[]> {
  const db = getAdminDb();
  if (!db) return [];

  const snapshot = await db
    .collection("experience")
    .orderBy("year", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title ?? "",
      company: data.company ?? "",
      year: data.year ?? "",
      logo: data.logo ?? "",
      description: data.description ?? "",
    } satisfies ExperienceType;
  });
}

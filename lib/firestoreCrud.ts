import { db } from "./firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  type DocumentData,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

const PROJECT_COLLECTION = "project";
const EXPERIENCE_COLLECTION = "experience";

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

export type ProjectInput = Omit<ProjectType, "id" | "slug"> & { slug?: string };

export interface ExperienceType {
  id: string;
  title: string;
  company: string;
  year: string;
  logo: string;
  description: string;
}

export type ExperienceInput = Omit<ExperienceType, "id">;

function mapProject(id: string, data: DocumentData): ProjectType {
  return {
    id,
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
  };
}

function mapExperience(id: string, data: DocumentData): ExperienceType {
  return {
    id,
    title: data.title ?? "",
    company: data.company ?? "",
    year: data.year ?? "",
    logo: data.logo ?? "",
    description: data.description ?? "",
  };
}

export async function getProjects(): Promise<ProjectType[]> {
  try {
    const projectQuery = query(
      collection(db, PROJECT_COLLECTION),
      orderBy("title"),
    );
    const snapshot = await getDocs(projectQuery);
    return snapshot.docs.map((docSnapshot) =>
      mapProject(docSnapshot.id, docSnapshot.data()),
    );
  } catch (error) {
    console.error("getProjects failed:", error);
    return [];
  }
}

export async function addProject(data: ProjectInput) {
  try {
    return await addDoc(collection(db, PROJECT_COLLECTION), data);
  } catch (error) {
    console.error("addProject failed:", error);
    throw error;
  }
}

export async function updateProject(id: string, data: Partial<ProjectInput>) {
  try {
    return await updateDoc(doc(db, PROJECT_COLLECTION, id), data);
  } catch (error) {
    console.error("updateProject failed:", error);
    throw error;
  }
}

export async function deleteProject(id: string) {
  try {
    return await deleteDoc(doc(db, PROJECT_COLLECTION, id));
  } catch (error) {
    console.error("deleteProject failed:", error);
    throw error;
  }
}

export async function getExperiences(): Promise<ExperienceType[]> {
  try {
    const experienceQuery = query(
      collection(db, EXPERIENCE_COLLECTION),
      orderBy("year", "desc"),
    );
    const snapshot = await getDocs(experienceQuery);
    return snapshot.docs.map((docSnapshot) =>
      mapExperience(docSnapshot.id, docSnapshot.data()),
    );
  } catch (error) {
    console.error("getExperiences failed:", error);
    return [];
  }
}

export async function addExperience(data: ExperienceInput) {
  try {
    return await addDoc(collection(db, EXPERIENCE_COLLECTION), data);
  } catch (error) {
    console.error("addExperience failed:", error);
    throw error;
  }
}

export async function updateExperience(
  id: string,
  data: Partial<ExperienceInput>,
) {
  try {
    return await updateDoc(doc(db, EXPERIENCE_COLLECTION, id), data);
  } catch (error) {
    console.error("updateExperience failed:", error);
    throw error;
  }
}

export async function deleteExperience(id: string) {
  try {
    return await deleteDoc(doc(db, EXPERIENCE_COLLECTION, id));
  } catch (error) {
    console.error("deleteExperience failed:", error);
    throw error;
  }
}

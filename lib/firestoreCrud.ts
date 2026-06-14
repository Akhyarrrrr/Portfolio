import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";

/* ─── Project types ─────────────────────────────────────────── */

export interface ProjectType {
  id: string;
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
  pinned?: boolean;
  order?: number;
}

export type ProjectInput = Omit<ProjectType, "id">;

/* ─── Project CRUD ──────────────────────────────────────────── */

export async function getProjects(): Promise<ProjectType[]> {
  const q = query(collection(db, "project"), orderBy("title"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
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
      pinned: data.pinned ?? false,
      order: data.order ?? undefined,
    };
  });
}

export async function addProject(data: ProjectInput) {
  return addDoc(collection(db, "project"), data);
}

export async function updateProject(id: string, data: Partial<ProjectInput>) {
  return updateDoc(doc(db, "project", id), data);
}

export async function deleteProject(id: string) {
  return deleteDoc(doc(db, "project", id));
}

/* ─── Experience types ──────────────────────────────────────── */

export interface ExperienceType {
  id: string;
  title: string;
  company: string;
  year: string;
  logo: string;
  description: string;
}

export type ExperienceInput = Omit<ExperienceType, "id">;

/* ─── Experience CRUD ───────────────────────────────────────── */

export async function getExperiences(): Promise<ExperienceType[]> {
  const q = query(collection(db, "experience"), orderBy("year", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      company: data.company ?? "",
      year: data.year ?? "",
      logo: data.logo ?? "",
      description: data.description ?? "",
    };
  });
}

export async function addExperience(data: ExperienceInput) {
  return addDoc(collection(db, "experience"), data);
}

export async function updateExperience(id: string, data: Partial<ExperienceInput>) {
  return updateDoc(doc(db, "experience", id), data);
}

export async function deleteExperience(id: string) {
  return deleteDoc(doc(db, "experience", id));
}

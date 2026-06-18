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
  const projectQuery = query(
    collection(db, PROJECT_COLLECTION),
    orderBy("title"),
  );
  const snapshot = await getDocs(projectQuery);
  return snapshot.docs.map((docSnapshot) =>
    mapProject(docSnapshot.id, docSnapshot.data()),
  );
}

export async function addProject(data: ProjectInput) {
  return addDoc(collection(db, PROJECT_COLLECTION), data);
}

export async function updateProject(id: string, data: Partial<ProjectInput>) {
  return updateDoc(doc(db, PROJECT_COLLECTION, id), data);
}

export async function deleteProject(id: string) {
  return deleteDoc(doc(db, PROJECT_COLLECTION, id));
}

export async function getExperiences(): Promise<ExperienceType[]> {
  const experienceQuery = query(
    collection(db, EXPERIENCE_COLLECTION),
    orderBy("year", "desc"),
  );
  const snapshot = await getDocs(experienceQuery);
  return snapshot.docs.map((docSnapshot) =>
    mapExperience(docSnapshot.id, docSnapshot.data()),
  );
}

export async function addExperience(data: ExperienceInput) {
  return addDoc(collection(db, EXPERIENCE_COLLECTION), data);
}

export async function updateExperience(
  id: string,
  data: Partial<ExperienceInput>,
) {
  return updateDoc(doc(db, EXPERIENCE_COLLECTION, id), data);
}

export async function deleteExperience(id: string) {
  return deleteDoc(doc(db, EXPERIENCE_COLLECTION, id));
}

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

// Project CRUD
export async function getProjects() {
  const q = query(collection(db, "project"), orderBy("title"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addProject(data: any) {
  return addDoc(collection(db, "project"), data);
}

export async function updateProject(id: string, data: any) {
  return updateDoc(doc(db, "project", id), data);
}

export async function deleteProject(id: string) {
  return deleteDoc(doc(db, "project", id));
}

// Experience CRUD
export async function getExperiences() {
  const q = query(collection(db, "experience"), orderBy("year", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
export async function addExperience(data: any) {
  return addDoc(collection(db, "experience"), data);
}
export async function updateExperience(id: string, data: any) {
  return updateDoc(doc(db, "experience", id), data);
}
export async function deleteExperience(id: string) {
  return deleteDoc(doc(db, "experience", id));
}

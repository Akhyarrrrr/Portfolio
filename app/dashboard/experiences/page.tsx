"use client";
import { useState, useEffect, useRef } from "react";
import {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
} from "../../../lib/firestoreCrud";
import { useAuth } from "../../../context/AuthContext";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiUploadCloud } from "react-icons/fi";
import {  FaUserTie } from "react-icons/fa";

export default function ExperienceCRUD() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    company: "",
    year: "",
    description: "",
    logo: "",
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    getExperiences().then(setExperiences);
  }, [user, router]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let logo = form.logo || "";
    if (file) logo = await uploadToCloudinary(file);
    if (!form.title || !form.company || !form.year || !form.description)
      return setToast("Please fill all fields!");
    const data = { ...form, logo };
    if (editing) {
      await updateExperience(editing, data);
      setToast("Experience updated!");
      setEditing(null);
    } else {
      await addExperience(data);
      setToast("Experience added!");
    }
    setForm({ title: "", company: "", year: "", description: "", logo: "" });
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
    getExperiences().then(setExperiences);
  };

  const handleEdit = (exp: any) => {
    setForm({ ...exp, logo: exp.logo || "" });
    setEditing(exp.id);
    setPreview(exp.logo || null);
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this experience? This action is irreversible.")) {
      await deleteExperience(id);
      setToast("Experience deleted!");
      getExperiences().then(setExperiences);
    }
  };

  if (user === undefined) return <div className="text-white">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#0b0f15] text-white">
      <main className="flex-1 w-full px-4 sm:px-6 md:px-10 py-8">
        <div className="flex flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#61DCA3] to-emerald-500 p-3 rounded-lg">
              <FaUserTie className="text-xl md:text-3xl" />
            </div>
            <h1 className="text:xl md:text-3xl font-bold tracking-tight">
              Manage Experience
            </h1>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            <FiArrowLeft />
            <span>Back</span>
          </button>
        </div>

        {toast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg shadow bg-[#202f22] text-[#61dca3] font-bold border border-[#61dca3] animate-fade-in">
            {toast}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-[#17191f] rounded-2xl p-7 shadow-2xl mb-10"
        >
          <div className="lg:col-span-2 flex flex-col gap-4">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
              required
            />
            <input
              placeholder="Company"
              value={form.company}
              onChange={(e) =>
                setForm((f) => ({ ...f, company: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
              required
            />
            <input
              placeholder="Year (ex: 2021 - 2025)"
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none resize-none"
              rows={4}
              required
            />
          </div>
          <div className="lg:col-span-1 flex flex-col items-center justify-start gap-4">
            <label
              htmlFor="logo"
              className="w-full h-full min-h-[150px] flex flex-col items-center justify-center gap-3 px-4 py-6 bg-[#22242b] border-2 border-dashed border-[#61dca3]/40 rounded-2xl cursor-pointer hover:bg-[#232537] transition"
            >
              {preview || form.logo ? (
                <img
                  src={preview || form.logo}
                  alt="Preview"
                  className="w-28 h-28 object-contain rounded-full shadow-lg border-2 border-[#61dca3]/50 mb-2 bg-white"
                />
              ) : (
                <div className="text-center">
                  <FiUploadCloud className="mx-auto text-3xl text-gray-500 mb-2" />
                  <span className="text-[#61dca3] font-bold">
                    + Upload Logo
                  </span>
                </div>
              )}
              <input
                ref={fileRef}
                id="logo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setFile(
                    e.target.files && e.target.files[0]
                      ? e.target.files[0]
                      : null
                  )
                }
              />
              {(file || preview) && (
                <button
                  type="button"
                  className="text-xs text-red-400 hover:text-red-600 underline mt-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null);
                    setPreview(null);
                    setForm((f) => ({ ...f, logo: "" }));
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                >
                  Remove
                </button>
              )}
            </label>
            <button
              type="submit"
              className="bg-[#61dca3] w-full text-[#0b0f15] py-3 rounded-xl font-bold shadow-lg mt-2 hover:scale-105 transition"
            >
              {editing ? "Update Experience" : "Add Experience"}
            </button>
            {editing && (
              <button
                type="button"
                className="text-xs text-gray-400 hover:underline mt-1"
                onClick={() => {
                  setEditing(null);
                  setForm({
                    title: "",
                    company: "",
                    year: "",
                    description: "",
                    logo: "",
                  });
                  setFile(null);
                  setPreview(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto rounded-2xl bg-[#181a21] p-4 shadow-lg">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3">Logo</th>
                <th className="p-3">Title</th>
                <th className="p-3">Company</th>
                <th className="p-3">Year</th>
                <th className="p-3">Description</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => (
                <tr
                  key={exp.id}
                  className="border-b border-[#232537]/40 hover:bg-[#232537]/30 transition"
                >
                  <td className="p-3">
                    <img
                      src={exp.logo}
                      alt={exp.title}
                      className="w-14 h-14 object-contain rounded-full border-2 border-[#61dca3]/50 bg-white"
                    />
                  </td>
                  <td className="p-3 font-bold">{exp.title}</td>
                  <td className="p-3">{exp.company}</td>
                  <td className="p-3">{exp.year}</td>
                  <td className="p-3 max-w-xs truncate">{exp.description}</td>
                  <td className="p-3">
                    <div className="flex gap-4">
                      <button
                        className="text-blue-400 hover:underline font-semibold"
                        onClick={() => handleEdit(exp)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-400 hover:underline font-semibold"
                        onClick={() => handleDelete(exp.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!experiences.length && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No experience data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <style jsx global>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      </main>
    </div>
  );
}

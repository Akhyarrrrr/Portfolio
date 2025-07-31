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

export default function experienceCRUD() {
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

  const { user, signOut } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    getExperiences().then(setExperiences);
  }, [user]);

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
    if (confirm("Delete this experience?")) {
      await deleteExperience(id);
      setToast("Experience deleted!");
      getExperiences().then(setExperiences);
    }
  };

  if (user === undefined) return <div className="text-white">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#0b0f15]">
      <main className="flex-1 px-8 py-8">
        <h1 className="text-3xl font-extrabold mb-6 text-white">
          Manage Experience
        </h1>

        {toast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg shadow bg-[#202f22] text-[#61dca3] font-bold border border-[#61dca3] animate-fade-in">
            {toast}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-6 bg-[#17191f] rounded-2xl p-7 shadow-2xl mb-10"
        >
          <div className="flex-1 flex flex-col gap-4">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
              required
            />
            <input
              placeholder="Company"
              value={form.company}
              onChange={(e) =>
                setForm((f) => ({ ...f, company: e.target.value }))
              }
              className="px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
              required
            />
            <input
              placeholder="Year (ex: 2021 - 2025)"
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              className="px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none resize-none"
              rows={3}
              required
            />
          </div>
          {/* Logo Upload & Preview */}
          <div className="flex flex-col items-center justify-start gap-4 min-w-[200px]">
            <label
              htmlFor="logo"
              className="w-full flex flex-col items-center justify-center gap-3 px-4 py-6 bg-[#22242b] border-2 border-dashed border-[#61dca3]/40 rounded-2xl cursor-pointer hover:bg-[#232537] transition"
            >
              {preview || form.logo ? (
                <img
                  src={preview || form.logo}
                  alt="Preview"
                  className="w-24 h-24 object-contain rounded-full shadow-lg border-2 border-[#61dca3]/50 mb-2 bg-white"
                />
              ) : (
                <span className="text-[#61dca3] font-bold">+ Upload Logo</span>
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
              {file || preview ? (
                <button
                  type="button"
                  className="text-xs text-red-400 hover:text-red-600 underline"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                >
                  Remove
                </button>
              ) : null}
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

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl bg-[#181a21] p-4 shadow-lg">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr>
                <th className="pb-3 px-2">Logo</th>
                <th className="pb-3 px-2">Title</th>
                <th className="pb-3 px-2">Company</th>
                <th className="pb-3 px-2">Year</th>
                <th className="pb-3 px-2">Description</th>
                <th className="pb-3 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => (
                <tr
                  key={exp.id}
                  className="border-b border-[#232537]/40 hover:bg-[#232537]/30 transition"
                >
                  <td className="py-2 px-2">
                    <img
                      src={exp.logo}
                      alt=""
                      className="w-14 h-14 object-contain rounded-full border-2 border-[#61dca3]/50 bg-white"
                    />
                  </td>
                  <td className="py-2 px-2 font-bold">{exp.title}</td>
                  <td className="py-2 px-2">{exp.company}</td>
                  <td className="py-2 px-2">{exp.year}</td>
                  <td className="py-2 px-2 max-w-[250px] truncate">
                    {exp.description}
                  </td>
                  <td className="py-2 px-2 flex gap-4">
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
                  </td>
                </tr>
              ))}
              {!experiences.length && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
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
              transform: translateY(32px);
            }
            to {
              opacity: 1;
              transform: none;
            }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease;
          }
        `}</style>
      </main>
    </div>
  );
}

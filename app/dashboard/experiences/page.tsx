"use client";
import { useState, useEffect, useRef } from "react";
import {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
  type ExperienceType,
  type ExperienceInput,
} from "../../../lib/firestoreCrud";
import { useAuth } from "../../../context/AuthContext";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiUploadCloud } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa";

const emptyForm: ExperienceInput = {
  title: "",
  company: "",
  year: "",
  description: "",
  logo: "",
};

export default function ExperienceCRUD() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [form, setForm] = useState<ExperienceInput>(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<{ id: string; title: string } | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) { router.replace("/login"); return; }
    getExperiences().then(setExperiences);
  }, [user, router]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.year || !form.description) {
      return setToast("Please fill all fields!");
    }

    let logo = form.logo ?? "";
    if (file) logo = await uploadToCloudinary(file);

    const data: ExperienceInput = { ...form, logo };

    if (editing) {
      await updateExperience(editing, data);
      setToast("Experience updated!");
    } else {
      await addExperience(data);
      setToast("Experience added!");
    }

    resetForm();
    getExperiences().then(setExperiences);
  };

  const handleEdit = (exp: ExperienceType) => {
    setForm({
      title: exp.title,
      company: exp.company,
      year: exp.year,
      description: exp.description,
      logo: exp.logo,
    });
    setEditing(exp.id);
    setPreview(exp.logo ?? null);
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (user === undefined) return <div className="text-white p-8">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#0b0f15] text-white">
      <main className="flex-1 w-full px-4 sm:px-6 md:px-10 py-8">
        {/* Header */}
        <div className="flex flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#61DCA3] to-emerald-500 p-3 rounded-lg">
              <FaUserTie className="text-xl md:text-3xl" />
            </div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">Manage Experience</h1>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 cursor-pointer"
          >
            <FiArrowLeft />
            <span>Back</span>
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg bg-[#232537] text-[#61dca3] font-bold border border-[#61dca3] text-lg"
            role="status"
            aria-live="polite"
          >
            {toast}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-[#17191f] rounded-2xl p-7 shadow-2xl mb-10"
        >
          <div className="lg:col-span-2 flex flex-col gap-4">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
              required
            />
            <input
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
              required
            />
            <input
              placeholder="Year (e.g. 2021 – 2025)"
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none resize-none"
              rows={4}
              required
            />
          </div>

          {/* Logo upload */}
          <div className="lg:col-span-1 flex flex-col items-center justify-start gap-4">
            <label
              htmlFor="exp-logo"
              className="w-full h-full min-h-[150px] flex flex-col items-center justify-center gap-3 px-4 py-6 bg-[#22242b] border-2 border-dashed border-[#61dca3]/40 rounded-2xl cursor-pointer hover:bg-[#232537] transition"
            >
              {preview || form.logo ? (
                <img
                  src={preview ?? form.logo ?? ""}
                  alt="Logo preview"
                  className="w-28 h-28 object-contain rounded-full shadow-lg border-2 border-[#61dca3]/50 mb-2 bg-white"
                />
              ) : (
                <div className="text-center">
                  <FiUploadCloud className="mx-auto text-3xl text-gray-500 mb-2" aria-hidden />
                  <span className="text-[#61dca3] font-bold">+ Upload Logo</span>
                </div>
              )}
              <input
                ref={fileRef}
                id="exp-logo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {(file || preview) && (
                <button
                  type="button"
                  className="text-xs text-red-400 hover:text-red-600 underline mt-2 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null); setPreview(null);
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
              className="bg-[#61dca3] w-full text-[#0b0f15] py-3 rounded-xl font-bold shadow-lg mt-2 hover:scale-105 transition cursor-pointer"
            >
              {editing ? "Update Experience" : "Add Experience"}
            </button>
            {editing && (
              <button
                type="button"
                className="text-xs text-gray-400 hover:underline mt-1 cursor-pointer"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {/* Table */}
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
                <tr key={exp.id} className="border-b border-[#232537]/40 hover:bg-[#232537]/30 transition">
                  <td className="p-3">
                    <img
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      className="w-14 h-14 object-contain rounded-full border-2 border-[#61dca3]/50 bg-white"
                    />
                  </td>
                  <td className="p-3 font-bold">{exp.title}</td>
                  <td className="p-3">{exp.company}</td>
                  <td className="p-3">{exp.year}</td>
                  <td className="p-3 max-w-xs truncate">{exp.description}</td>
                  <td className="p-3">
                    <div className="flex gap-4">
                      <button className="text-blue-400 hover:underline font-semibold cursor-pointer" onClick={() => handleEdit(exp)}>Edit</button>
                      <button className="text-red-400 hover:underline font-semibold cursor-pointer" onClick={() => setShowDelete({ id: exp.id, title: exp.title })}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!experiences.length && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">No experience data yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete modal */}
        {showDelete && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="del-exp-title">
            <div className="bg-[#181a21] rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-700">
              <div className="text-5xl mb-4" aria-hidden>⚠️</div>
              <h2 id="del-exp-title" className="font-bold text-xl mb-2">Delete Experience?</h2>
              <p className="mb-6 text-gray-400">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">{showDelete.title}</span>?{" "}
                This action is irreversible.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-6 py-2 rounded-lg bg-[#61dca3] text-[#0b0f15] font-bold hover:bg-[#3fc78d] transition cursor-pointer"
                  onClick={async () => {
                    await deleteExperience(showDelete.id);
                    setToast("Experience deleted!");
                    setShowDelete(null);
                    getExperiences().then(setExperiences);
                  }}
                >
                  Yes, Delete
                </button>
                <button
                  className="px-6 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition cursor-pointer"
                  onClick={() => setShowDelete(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

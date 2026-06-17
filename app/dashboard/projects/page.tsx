"use client";
import { useState, useEffect, useRef } from "react";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  type ProjectType,
  type ProjectInput,
} from "../../../lib/firestoreCrud";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiUploadCloud } from "react-icons/fi";
import { FaProjectDiagram } from "react-icons/fa";

const emptyForm: ProjectInput = {
  title: "",
  description: "",
  category: "",
  href: "",
  tech: [],
  imageUrl: "",
  pinned: false,
  order: 0,
};

export default function ProjectCRUD() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [techInput, setTechInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<{ id: string; title: string } | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) { router.replace("/login"); return; }
    getProjects().then(setProjects);
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
    setTechInput("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleTechKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const val = techInput.trim().toLowerCase();
    if (["Enter", "Tab", ","].includes(e.key) && val && !form.tech?.includes(val)) {
      e.preventDefault();
      setForm((f) => ({ ...f, tech: [...(f.tech ?? []), val] }));
      setTechInput("");
    } else if (e.key === "Backspace" && !techInput && (form.tech?.length ?? 0) > 0) {
      setForm((f) => ({ ...f, tech: f.tech?.slice(0, -1) ?? [] }));
    }
  };

  const handleRemoveTech = (idx: number) => {
    setForm((f) => ({ ...f, tech: f.tech?.filter((_, i) => i !== idx) ?? [] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.tech?.length) {
      return setToast("Lengkapi data terlebih dahulu!");
    }
    if (form.pinned && ((form.order ?? 0) < 1 || (form.order ?? 0) > 6)) {
      return setToast("Order must be 1–6 when pinned!");
    }

    if (form.pinned) {
      const duplicatePinnedOrder = projects.find(
        (project) =>
          project.id !== editing &&
          project.pinned &&
          Number(project.order) === Number(form.order),
      );

      if (duplicatePinnedOrder) {
        return setToast(`Order ${form.order} already used by ${duplicatePinnedOrder.title ?? "another project"}!`);
      }
    }

    let imageUrl = form.imageUrl ?? "";
    if (file) imageUrl = await uploadToCloudinary(file);

    const data: ProjectInput = {
      ...form,
      tech: form.tech?.filter(Boolean) ?? [],
      imageUrl,
      pinned: Boolean(form.pinned),
      order: form.pinned ? Number(form.order ?? 0) : 0,
    };

    if (editing) {
      await updateProject(editing, data);
      setToast("Project updated!");
    } else {
      await addProject(data);
      setToast("Project added!");
    }

    resetForm();
    getProjects().then(setProjects);
  };

  const handleEdit = (proj: ProjectType) => {
    setForm({
      title: proj.title ?? "",
      description: proj.description ?? "",
      category: proj.category ?? "",
      href: proj.href ?? "",
      tech: Array.isArray(proj.tech) ? proj.tech : [],
      imageUrl: proj.imageUrl ?? "",
      pinned: Boolean(proj.pinned),
      order: Number(proj.order ?? 0),
    });
    setEditing(proj.id);
    setPreview(proj.imageUrl ?? null);
    setFile(null);
    setTechInput("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTogglePinned = async (proj: ProjectType) => {
    try {
      if (proj.pinned) {
        await updateProject(proj.id, { pinned: false, order: 0 });
        setToast("Project unpinned!");
      } else {
        const usedOrders = new Set(
          projects
            .filter((project) => project.pinned)
            .map((project) => Number(project.order))
            .filter((order) => order >= 1 && order <= 6),
        );
        const nextOrder = [1, 2, 3, 4, 5, 6].find((order) => !usedOrders.has(order));

        if (!nextOrder) {
          return setToast("All pinned slots 1-6 are already used!");
        }

        await updateProject(proj.id, { pinned: true, order: nextOrder });
        setToast(`Project pinned as ${nextOrder}!`);
      }

      getProjects().then(setProjects);
    } catch (error) {
      console.error("Failed to update pinned state", error);
      setToast("Failed to update pinned state!");
    }
  };

  if (user === undefined) return <div className="text-white p-8">Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#0b0f15] text-white">
      <main className="flex-1 px-3 sm:px-6 md:px-10 py-8 w-full">
        {/* Header */}
        <div className="flex flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#61DCA3] to-emerald-500 p-3 rounded-lg">
              <FaProjectDiagram className="text-xl md:text-3xl" />
            </div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">Manage Projects</h1>
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
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg bg-[#232537] text-[#61dca3] font-bold border border-[#61dca3] text-lg"
            role="status" aria-live="polite">
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
              value={form.title ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
              required
            />
            <textarea
              placeholder="Description"
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none resize-none"
              rows={3}
              required
            />
            <div className="flex flex-col sm:flex-row gap-4 rounded-xl bg-[#232537] px-4 py-3">
              <label className="flex items-center gap-3 text-sm font-semibold text-white/90 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.pinned ?? false}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      pinned: e.target.checked,
                      order: e.target.checked ? Math.min(Math.max(f.order ?? 1, 1), 6) : 0,
                    }))
                  }
                  className="h-4 w-4 accent-[#61DCA3]"
                />
                Pinned/Featured?
              </label>
              <input
                type="number"
                placeholder="Order (1–6 only)"
                value={form.order ?? 0}
                min="1"
                max="6"
                disabled={!form.pinned}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value || 0) }))}
                className="flex-1 min-w-[160px] rounded-lg bg-[#17191f] px-3 py-2 text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <select
              value={form.category ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
              required
            >
              <option value="" disabled>Category</option>
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
            </select>

            {/* Tech tags input */}
            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#232537] px-3 py-2 min-h-[44px] focus-within:ring-2 focus-within:ring-[#61dca3]">
              {(form.tech ?? []).map((tech, idx) => (
                <span
                  key={tech}
                  className="bg-[#61dca3] text-[#0b0f15] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    className="ml-1 text-[#0b0f15] hover:text-red-700 font-bold text-lg focus:outline-none cursor-pointer"
                    onClick={() => handleRemoveTech(idx)}
                    aria-label={`Remove ${tech}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add tech then Enter…"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechKey}
                className="bg-transparent outline-none text-white py-1 flex-1 min-w-[100px]"
                list="tech-list"
              />
              <datalist id="tech-list">
                <option value="react" /><option value="next" />
                <option value="firebase" /><option value="tailwind" />
                <option value="typescript" /><option value="supabase" />
              </datalist>
            </div>

            <input
              placeholder="Github / Live link"
              value={form.href ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
            />
          </div>

          {/* Image upload */}
          <div className="lg:col-span-1 flex flex-col items-center justify-start gap-4">
            <label
              htmlFor="proj-file"
              className="w-full max-w-xs min-h-[150px] flex flex-col items-center justify-center gap-3 px-4 py-6 bg-[#22242b] border-2 border-dashed border-[#61dca3]/40 rounded-2xl cursor-pointer hover:bg-[#232537] transition"
            >
              {preview || form.imageUrl ? (
                <img
                  src={preview ?? form.imageUrl ?? ""}
                  alt="Preview"
                  className="w-full h-36 object-cover rounded-xl shadow-lg border-2 border-[#61dca3]/50 mb-2"
                />
              ) : (
                <div className="text-center">
                  <FiUploadCloud className="mx-auto text-3xl text-gray-500 mb-2" aria-hidden />
                  <span className="text-[#61dca3] font-bold">+ Upload Image</span>
                </div>
              )}
              <input
                ref={fileRef}
                id="proj-file"
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
                    setForm((f) => ({ ...f, imageUrl: "" }));
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
              {editing ? "Update Project" : "Add Project"}
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
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Pinned</th>
                <th className="p-3">Tech</th>
                <th className="p-3">Link</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id} className="border-b border-[#232537]/40 hover:bg-[#232537]/30 transition">
                  <td className="p-3">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title ?? "project"}
                      className="w-16 h-16 object-cover rounded-md border-2 border-[#61dca3]/50"
                    />
                  </td>
                  <td className="p-3 font-bold">{proj.title}</td>
                  <td className="p-3 capitalize">{proj.category}</td>
                  <td className="p-3">
                    {proj.pinned
                      ? <span className="rounded-full bg-[#61DCA3] px-2 py-1 text-xs font-bold text-[#0b0f15]">Pinned {proj.order ?? "?"}</span>
                      : <span className="text-gray-500">-</span>
                    }
                  </td>
                  <td className="p-3 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {proj.tech.map((t, idx) => (
                        <span key={`${t}-${idx}`} className="bg-[#232537] px-2 py-1 rounded text-xs font-semibold text-[#61dca3]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 max-w-xs truncate">
                    {proj.href
                      ? <a href={proj.href} target="_blank" rel="noopener noreferrer" className="text-[#61DCA3] underline hover:text-[#33b273]">{proj.href}</a>
                      : <span className="text-gray-500">-</span>
                    }
                  </td>
                  <td className="p-3">
                    <div className="flex gap-4">
                      <button className="text-blue-400 hover:underline font-semibold cursor-pointer" onClick={() => handleEdit(proj)}>Edit</button>
                      <button className="text-[#61DCA3] hover:underline font-semibold cursor-pointer" onClick={() => handleTogglePinned(proj)}>
                        {proj.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button className="text-red-400 hover:underline font-semibold cursor-pointer" onClick={() => setShowDelete({ id: proj.id, title: proj.title ?? "" })}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!projects.length && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500">No projects found. Add one above!</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete modal */}
        {showDelete && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="del-title">
            <div className="bg-[#181a21] rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-700">
              <div className="text-5xl mb-4" aria-hidden>⚠️</div>
              <h2 id="del-title" className="font-bold text-xl mb-2">Delete Project?</h2>
              <p className="mb-6 text-gray-400">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">{showDelete.title}</span>?{" "}
                This action is irreversible.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-6 py-2 rounded-lg bg-[#61dca3] text-[#0b0f15] font-bold hover:bg-[#3fc78d] transition cursor-pointer"
                  onClick={async () => {
                    await deleteProject(showDelete.id);
                    setToast("Project deleted!");
                    setShowDelete(null);
                    getProjects().then(setProjects);
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

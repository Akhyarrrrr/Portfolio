"use client";
import { useState, useEffect, useRef } from "react";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../../../lib/firestoreCrud";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProjectCRUD() {
  const [projects, setProjects] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    href: "",
    tech: [] as string[],
    imageUrl: "",
  });
  const [techInput, setTechInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showDelete, setShowDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    getProjects().then(setProjects);
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

  const handleTechKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      ["Enter", "Tab", ","].includes(e.key) &&
      techInput.trim() &&
      !form.tech.includes(techInput.trim().toLowerCase())
    ) {
      e.preventDefault();
      setForm((f) => ({
        ...f,
        tech: [...f.tech, techInput.trim().toLowerCase()],
      }));
      setTechInput("");
    } else if (e.key === "Backspace" && !techInput && form.tech.length > 0) {
      setForm((f) => ({ ...f, tech: f.tech.slice(0, -1) }));
    }
  };

  const handleRemoveTech = (idx: number) => {
    setForm((f) => ({
      ...f,
      tech: f.tech.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = form.imageUrl || "";
    if (file) imageUrl = await uploadToCloudinary(file);
    const data = { ...form, tech: form.tech.filter((t) => !!t), imageUrl };
    if (!form.title || !form.description || !form.tech.length)
      return setToast("Lengkapi data terlebih dahulu!");
    if (editing) {
      await updateProject(editing, data);
      setToast("Project updated!");
      setEditing(null);
    } else {
      await addProject(data);
      setToast("Project added!");
    }
    setForm({
      title: "",
      description: "",
      category: "",
      href: "",
      tech: [],
      imageUrl: "",
    });
    setFile(null);
    setPreview(null);
    setTechInput("");
    if (fileRef.current) fileRef.current.value = "";
    getProjects().then(setProjects);
  };

  const handleEdit = (proj: any) => {
    setForm({
      ...proj,
      tech: Array.isArray(proj.tech)
        ? proj.tech
        : typeof proj.tech === "string"
        ? proj.tech.split(",").map((t: string) => t.trim())
        : [],
      imageUrl: proj.imageUrl || "",
    });
    setEditing(proj.id);
    setPreview(proj.imageUrl || null);
    setFile(null);
    setTechInput("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (user === undefined) return <div className="text-white">Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#0b0f15]">
      <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-10 lg:p-14 transition-all ml-0 md:ml-[240px]">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8 text-white">
          Projects Admin
        </h1>
        {toast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg bg-[#232537] text-[#61dca3] font-bold border border-[#61dca3] animate-fade-in text-lg">
            {toast}
          </div>
        )}
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-6 bg-[#17191f] rounded-2xl p-7 shadow-2xl mb-10"
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
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              className="px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
              required
            >
              <option value="" disabled>
                Category
              </option>
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
            </select>
            <div>
              <label className="block mb-1 font-semibold text-gray-400">
                Tech Stack
              </label>
              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#232537] px-3 py-2 min-h-[44px] border border-transparent focus-within:ring-2 focus-within:ring-[#61dca3]">
                {form.tech.map((tech, idx) => (
                  <span
                    key={tech}
                    className="bg-[#61dca3] text-[#0b0f15] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 animate-fade-in"
                  >
                    {tech}
                    <button
                      type="button"
                      className="ml-1 text-[#0b0f15] hover:text-red-700 font-bold text-lg focus:outline-none"
                      onClick={() => handleRemoveTech(idx)}
                      title="Remove"
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
                  className="bg-transparent outline-none text-white py-2 flex-1 min-w-[80px]"
                  list="tech-list"
                />
                <datalist id="tech-list">
                  <option value="react" />
                  <option value="next" />
                  <option value="firebase" />
                  <option value="tailwind" />
                  <option value="expo" />
                  <option value="kotlin" />
                  <option value="mysql" />
                  <option value="laravel" />
                  <option value="css" />
                  <option value="html" />
                  <option value="express" />
                </datalist>
              </div>
              <span className="text-xs text-gray-400 mt-1 block">
                Press <b>Enter/Tab</b> to add. Example:{" "}
                <i>react, next, firebase, ...</i>
              </span>
            </div>
            <input
              placeholder="Github/Link"
              value={form.href}
              onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
              className="px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
            />
          </div>
          <div className="flex flex-col items-center justify-start gap-4 min-w-[200px]">
            <label
              htmlFor="file"
              className="w-full flex flex-col items-center justify-center gap-3 px-4 py-6 bg-[#22242b] border-2 border-dashed border-[#61dca3]/40 rounded-2xl cursor-pointer hover:bg-[#232537] transition"
            >
              {preview || form.imageUrl ? (
                <img
                  src={preview || form.imageUrl}
                  alt="Preview"
                  className="w-36 h-28 object-cover rounded-xl shadow-lg border-2 border-[#61dca3]/50 mb-2"
                />
              ) : (
                <span className="text-[#61dca3] font-bold">+ Upload Image</span>
              )}
              <input
                ref={fileRef}
                id="file"
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
              {editing ? "Update Project" : "Add Project"}
            </button>
            {editing && (
              <button
                type="button"
                className="text-xs text-gray-400 hover:underline mt-1"
                onClick={() => {
                  setEditing(null);
                  setForm({
                    title: "",
                    description: "",
                    category: "web",
                    href: "",
                    tech: [],
                    imageUrl: "",
                  });
                  setFile(null);
                  setPreview(null);
                  setTechInput("");
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-2xl bg-[#181a21] p-4 shadow-lg">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr>
                <th className="pb-3 px-2">Image</th>
                <th className="pb-3 px-2">Title</th>
                <th className="pb-3 px-2">Category</th>
                <th className="pb-3 px-2">Tech</th>
                <th className="pb-3 px-2">Link</th>
                <th className="pb-3 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr
                  key={proj.id}
                  className="border-b border-[#232537]/40 hover:bg-[#232537]/30 transition"
                >
                  <td className="py-2 px-2">
                    <img
                      src={proj.imageUrl}
                      alt=""
                      className="w-16 h-16 object-cover rounded-full border-2 border-[#61dca3]/50"
                    />
                  </td>
                  <td className="py-2 px-2 font-bold">{proj.title}</td>
                  <td className="py-2 px-2 capitalize">{proj.category}</td>
                  <td className="py-2 px-2">
                    {Array.isArray(proj.tech)
                      ? proj.tech.map((t, idx) => (
                          <span
                            key={t + idx}
                            className="bg-[#232537] px-2 py-1 rounded-full text-xs font-semibold text-[#61dca3] mr-1"
                          >
                            {t}
                          </span>
                        ))
                      : proj.tech}
                  </td>
                  <td className="py-2 px-2 max-w-[160px] truncate">
                    {proj.href ? (
                      <a
                        href={proj.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#61DCA3] underline hover:text-[#33b273]"
                      >
                        {proj.href}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-2 px-2 flex gap-4">
                    <button
                      className="text-blue-400 hover:underline font-semibold"
                      onClick={() => handleEdit(proj)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-400 hover:underline font-semibold"
                      onClick={() =>
                        setShowDelete({ id: proj.id, title: proj.title })
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!projects.length && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No project data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {showDelete && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-[#181a21] rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
                <div className="text-3xl mb-2 text-red-500">⚠️</div>
                <h2 className="font-bold text-xl mb-2">Delete Project?</h2>
                <p className="mb-6 text-gray-400">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-white">
                    {showDelete.title}
                  </span>
                  ?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-6 py-2 rounded-lg bg-[#61dca3] text-[#0b0f15] font-bold hover:bg-[#3fc78d] transition"
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
                    className="px-6 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                    onClick={() => setShowDelete(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
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
          @media (max-width: 767px) {
            .ml-0.md\\:ml-\\[240px\\] {
              margin-left: 0 !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

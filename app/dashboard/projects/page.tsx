"use client";
import {
  useState,
  useEffect,
  useRef,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../../../lib/firestoreCrud";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiUploadCloud } from "react-icons/fi";
import { FaProjectDiagram } from "react-icons/fa";

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
    <div className="flex min-h-screen bg-[#0b0f15] text-white">
      <main className="flex-1 px-3 sm:px-6 md:px-10 py-8 w-full">
        {/* Header */}
        <div className="flex flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#61DCA3] to-emerald-500 p-3 rounded-lg">
              <FaProjectDiagram className="text-xl md:text-3xl" />
            </div>
            <h1 className=" text-xl md:text-3xl font-bold tracking-tight">
              Manage Projects
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

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg bg-[#232537] text-[#61dca3] font-bold border border-[#61dca3] animate-fade-in text-lg">
            {toast}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-[#17191f] rounded-2xl p-7 shadow-2xl mb-10"
        >
          {/* Input Fields */}
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
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none resize-none"
              rows={3}
              required
            />
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
              required
            >
              <option value="" disabled>
                Category
              </option>
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
            </select>
            <div>
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
                  className="bg-transparent outline-none text-white py-1 flex-1 min-w-[100px]"
                  list="tech-list"
                />
                <datalist id="tech-list">
                  <option value="react" />
                  <option value="next" />
                  <option value="firebase" />
                  <option value="tailwind" />
                </datalist>
              </div>
            </div>
            <input
              placeholder="Github/Link"
              value={form.href}
              onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#232537] text-white focus:ring-2 focus:ring-[#61dca3] border border-transparent outline-none"
            />
          </div>
          {/* Image Upload */}
          <div className="lg:col-span-1 flex flex-col items-center justify-start gap-4">
            <label
              htmlFor="file"
              className="w-full max-w-xs min-h-[150px] flex flex-col items-center justify-center gap-3 px-4 py-6 bg-[#22242b] border-2 border-dashed border-[#61dca3]/40 rounded-2xl cursor-pointer hover:bg-[#232537] transition"
            >
              {preview || form.imageUrl ? (
                <img
                  src={preview || form.imageUrl}
                  alt="Preview"
                  className="w-full h-36 object-cover rounded-xl shadow-lg border-2 border-[#61dca3]/50 mb-2"
                />
              ) : (
                <div className="text-center">
                  <FiUploadCloud className="mx-auto text-3xl text-gray-500 mb-2" />
                  <span className="text-[#61dca3] font-bold">
                    + Upload Image
                  </span>
                </div>
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
                  className="text-xs text-red-400 hover:text-red-600 underline mt-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null);
                    setPreview(null);
                    setForm((f) => ({ ...f, imageUrl: "" }));
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
                    category: "",
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

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl bg-[#181a21] p-4 shadow-lg">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Tech</th>
                <th className="p-3">Link</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr
                  key={proj.id}
                  className="border-b border-[#232537]/40 hover:bg-[#232537]/30 transition"
                >
                  <td className="p-3">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="w-16 h-16 object-cover rounded-md border-2 border-[#61dca3]/50"
                    />
                  </td>
                  <td className="p-3 font-bold">{proj.title}</td>
                  <td className="p-3 capitalize">{proj.category}</td>
                  <td className="p-3 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(proj.tech) ? proj.tech : []).map(
                        (
                          t:
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | Promise<
                                | string
                                | number
                                | bigint
                                | boolean
                                | ReactPortal
                                | ReactElement<
                                    unknown,
                                    string | JSXElementConstructor<any>
                                  >
                                | Iterable<ReactNode>
                                | null
                                | undefined
                              >
                            | null
                            | undefined,
                          idx: any
                        ) => (
                          <span
                            key={t + idx}
                            className="bg-[#232537] px-2 py-1 rounded text-xs font-semibold text-[#61dca3]"
                          >
                            {t}
                          </span>
                        )
                      )}
                    </div>
                  </td>
                  <td className="p-3 max-w-xs truncate">
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
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-4">
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
                    </div>
                  </td>
                </tr>
              ))}
              {!projects.length && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No projects found. Add one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {showDelete && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-[#181a21] rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-700">
                <div className="text-5xl mb-4 text-red-500">⚠️</div>
                <h2 className="font-bold text-xl mb-2">Delete Project?</h2>
                <p className="mb-6 text-gray-400">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-white">
                    {showDelete.title}
                  </span>
                  ? This action is irreversible.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-6 py-2 rounded-lg bg-[#61dca3] text-[#0b0f15] font-bold hover:bg-[#3fc78d] transition"
                    onClick={async () => {
                      if (showDelete) {
                        await deleteProject(showDelete.id);
                        setToast("Project deleted!");
                        setShowDelete(null);
                        getProjects().then(setProjects);
                      }
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

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaProjectDiagram } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  addProject,
  deleteProject,
  getProjects,
  type ProjectInput,
  type ProjectType,
  updateProject,
} from "@/lib/firestoreCrud";
import {
  getTechDisplayLabel,
  isSameTech,
  normalizeTechValue,
  techSuggestions,
} from "@/lib/tech-stack";
import DashboardHeader from "../_components/DashboardHeader";
import DashboardToast from "../_components/DashboardToast";
import DeleteDialog from "../_components/DeleteDialog";

const emptyForm: ProjectInput = {
  title_en: "",
  title_id: "",
  desc_en: "",
  desc_id: "",
  category: "",
  slug: "",
  href: "",
  githubUrl: "",
  liveUrl: "",
  tech: [],
  imageUrl: "",
  pinned: false,
  order: 0,
  problemStatement: "",
  problemStatement_id: "",
  solutionApproach: "",
  solutionApproach_id: "",
  impact: "",
  impact_id: "",
  techRationale: "",
  techRationale_id: "",
  keyFeatures: [],
  screenshots: [],
  year: "",
  duration: "",
  role: "",
  learnings: "",
  learnings_id: "",
};

export default function ProjectCRUD() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [techInput, setTechInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    let cancelled = false;
    getProjects()
      .then((data) => { if (!cancelled) setProjects(data); })
      .catch(() => { if (!cancelled) setToast("Failed to load projects."); });
    return () => { cancelled = true; };
  }, [user, router]);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setPreview(null);
    setTechInput("");
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const addTechToForm = (value: string) => {
    const normalizedValue = normalizeTechValue(value);

    if (!normalizedValue) {
      return;
    }

    const hasTech = (form.tech ?? []).some((tech) =>
      isSameTech(tech, normalizedValue),
    );

    if (hasTech) {
      return;
    }

    setForm((current) => ({
      ...current,
      tech: [...(current.tech ?? []), normalizedValue],
    }));
    setTechInput("");
  };

  const handleTechKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const value = normalizeTechValue(techInput);

    if (["Enter", "Tab", ","].includes(event.key) && value) {
      event.preventDefault();
      addTechToForm(value);
      return;
    }

    if (
      event.key === "Backspace" &&
      !techInput &&
      (form.tech?.length ?? 0) > 0
    ) {
      setForm((current) => ({
        ...current,
        tech: current.tech?.slice(0, -1) ?? [],
      }));
    }
  };

  const handleRemoveTech = (index: number) => {
    setForm((current) => ({
      ...current,
      tech: current.tech?.filter((_, techIndex) => techIndex !== index) ?? [],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if ((!form.title_en && !form.title_id) || (!form.desc_en && !form.desc_id) || !form.tech?.length) {
      setToast("Lengkapi data terlebih dahulu!");
      return;
    }

    if (form.pinned && ((form.order ?? 0) < 1 || (form.order ?? 0) > 6)) {
      setToast("Order must be 1-6 when pinned!");
      return;
    }

    if (form.pinned) {
      const duplicatePinnedOrder = projects.find(
        (project) =>
          project.id !== editing &&
          project.pinned &&
          Number(project.order) === Number(form.order),
      );

      if (duplicatePinnedOrder) {
        setToast(
          `Order ${form.order} already used by ${
            duplicatePinnedOrder.title_en ?? duplicatePinnedOrder.title ?? "another project"
          }!`,
        );
        return;
      }
    }

    let imageUrl = form.imageUrl ?? "";
    if (file) {
      try {
        imageUrl = await uploadToCloudinary(file);
      } catch {
        setToast("Image upload failed!");
        return;
      }
    }

    const data: ProjectInput = {
      ...form,
      tech: form.tech?.map((tech) => getTechDisplayLabel(tech)).filter(Boolean) ?? [],
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

  const handleEdit = (project: ProjectType) => {
    setForm({
      title_en: project.title_en ?? project.title ?? "",
      title_id: project.title_id ?? "",
      desc_en: project.desc_en ?? project.description ?? "",
      desc_id: project.desc_id ?? "",
      category: project.category ?? "",
      slug: project.slug ?? "",
      href: project.href ?? "",
      githubUrl: project.githubUrl ?? "",
      liveUrl: project.liveUrl ?? "",
      tech: Array.isArray(project.tech)
        ? project.tech.map((tech) => getTechDisplayLabel(tech))
        : [],
      imageUrl: project.imageUrl ?? "",
      pinned: Boolean(project.pinned),
      order: Number(project.order ?? 0),
      problemStatement: project.problemStatement ?? "",
      problemStatement_id: project.problemStatement_id ?? "",
      solutionApproach: project.solutionApproach ?? "",
      solutionApproach_id: project.solutionApproach_id ?? "",
      impact: project.impact ?? "",
      impact_id: project.impact_id ?? "",
      techRationale: project.techRationale ?? "",
      techRationale_id: project.techRationale_id ?? "",
      keyFeatures: Array.isArray(project.keyFeatures) ? project.keyFeatures : [],
      screenshots: Array.isArray(project.screenshots) ? project.screenshots : [],
      year: project.year ?? "",
      duration: project.duration ?? "",
      role: project.role ?? "",
      learnings: project.learnings ?? "",
      learnings_id: project.learnings_id ?? "",
    });
    setEditing(project.id);
    setPreview(project.imageUrl ?? null);
    setFile(null);
    setTechInput("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTogglePinned = async (project: ProjectType) => {
    try {
      if (project.pinned) {
        await updateProject(project.id, { pinned: false, order: 0 });
        setToast("Project unpinned!");
      } else {
        const usedOrders = new Set(
          projects
            .filter((item) => item.pinned)
            .map((item) => Number(item.order))
            .filter((order) => order >= 1 && order <= 6),
        );
        const nextOrder = [1, 2, 3, 4, 5, 6].find(
          (order) => !usedOrders.has(order),
        );

        if (!nextOrder) {
          setToast("All pinned slots 1-6 are already used!");
          return;
        }

        await updateProject(project.id, { pinned: true, order: nextOrder });
        setToast(`Project pinned as ${nextOrder}!`);
      }

      getProjects().then(setProjects);
    } catch (error) {
      console.error("Failed to update pinned state", error);
      setToast("Failed to update pinned state!");
    }
  };

  if (user === undefined) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#0b0f15] text-white">
      <main className="w-full flex-1 px-3 py-8 sm:px-6 md:px-10">
        <DashboardHeader
          icon={<FaProjectDiagram className="text-xl md:text-3xl" />}
          title="Manage Projects"
          onBack={() => router.push("/dashboard")}
        />
        <DashboardToast message={toast} />

        <form
          onSubmit={handleSubmit}
          className="mb-10 grid grid-cols-1 gap-8 rounded-2xl bg-[#17191f] p-7 shadow-2xl lg:grid-cols-3"
        >
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[10px] text-white/30 uppercase tracking-widest">Title (EN)</label>
                <input
                  placeholder="Title (English)"
                  aria-label="Project title (English)"
                  value={form.title_en ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title_en: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-transparent bg-[#232537] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#61dca3]"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-white/30 uppercase tracking-widest">Title (ID)</label>
                <input
                  placeholder="Title (Indonesian)"
                  aria-label="Project title (Indonesian)"
                  value={form.title_id ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title_id: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-transparent bg-[#232537] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#61dca3]"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <input
                placeholder="Slug (e.g. my-project) — auto-generated from title"
                value={form.slug ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slug: event.target.value,
                  }))
                }
                className="flex-1 rounded-xl border border-transparent bg-[#232537] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#61dca3]"
              />
              <button
                type="button"
                className="cursor-pointer rounded-xl bg-[#232537] px-4 py-2 text-xs font-semibold text-[#61DCA3] transition hover:bg-[#2a2d3a]"
                onClick={() => {
                  const base = (form.title_en || "")
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "")
                    .slice(0, 60);
                  setForm((current) => ({ ...current, slug: base }));
                }}
              >
                Auto
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[10px] text-white/30 uppercase tracking-widest">Description (EN)</label>
                <textarea
                  placeholder="Description (English)"
                  value={form.desc_en ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      desc_en: event.target.value,
                    }))
                  }
                  className="w-full resize-none rounded-xl border border-transparent bg-[#232537] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#61dca3]"
                  rows={3}
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-white/30 uppercase tracking-widest">Description (ID)</label>
                <textarea
                  placeholder="Description (Indonesian)"
                  value={form.desc_id ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      desc_id: event.target.value,
                    }))
                  }
                  className="w-full resize-none rounded-xl border border-transparent bg-[#232537] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#61dca3]"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl bg-[#232537] px-4 py-3 sm:flex-row">
              <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-white/90">
                <input
                  type="checkbox"
                  checked={form.pinned ?? false}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      pinned: event.target.checked,
                      order: event.target.checked
                        ? Math.min(Math.max(current.order ?? 1, 1), 6)
                        : 0,
                    }))
                  }
                  className="h-4 w-4 accent-[#61DCA3]"
                />
                Pinned/Featured?
              </label>

              <input
                type="number"
                placeholder="Order (1-6 only)"
                value={form.order ?? 0}
                min="1"
                max="6"
                disabled={!form.pinned}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    order: Number(event.target.value || 0),
                  }))
                }
                className="min-w-[160px] flex-1 rounded-lg border border-transparent bg-[#17191f] px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#61dca3] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <select
              value={form.category ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-transparent bg-[#232537] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#61dca3]"
              required
            >
              <option value="" disabled>
                Category
              </option>
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
            </select>

            <TechMultiSelect
              selectedTechs={form.tech ?? []}
              suggestions={techSuggestions}
              onAdd={(tech) => addTechToForm(tech)}
              onRemove={(index) => handleRemoveTech(index)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="GitHub URL"
                value={form.githubUrl ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    githubUrl: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-transparent bg-[#232537] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#61dca3]"
              />

              <input
                placeholder="Live URL"
                value={form.liveUrl ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    liveUrl: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-transparent bg-[#232537] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#61dca3]"
              />
            </div>

            {/* Case study toggle */}
            <CaseStudyFields
              form={form}
              setForm={setForm}
              keyFeatures={form.keyFeatures ?? []}
              onKeyFeaturesChange={(features) =>
                setForm((current) => ({ ...current, keyFeatures: features }))
              }
            />
          </div>

          <div className="flex flex-col items-center justify-start gap-4 lg:col-span-1">
            <label
              htmlFor="proj-file"
              className="flex min-h-[150px] w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#61dca3]/40 bg-[#22242b] px-4 py-6 transition hover:bg-[#232537]"
            >
              {preview || form.imageUrl ? (
                <img
                  src={preview ?? form.imageUrl ?? ""}
                  alt="Preview"
                  className="mb-2 h-36 w-full rounded-xl border-2 border-[#61dca3]/50 object-cover shadow-lg"
                />
              ) : (
                <div className="text-center">
                  <FiUploadCloud
                    className="mx-auto mb-2 text-3xl text-gray-500"
                    aria-hidden
                  />
                  <span className="font-bold text-[#61dca3]">+ Upload Image</span>
                </div>
              )}

              <input
                ref={fileRef}
                id="proj-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />

              {(file || preview || (editing && form.imageUrl)) && (
                <button
                  type="button"
                  className="mt-2 cursor-pointer text-xs text-red-400 underline hover:text-red-600"
                  onClick={(event) => {
                    event.preventDefault();
                    setFile(null);
                    setPreview(null);
                    setForm((current) => ({ ...current, imageUrl: "" }));
                    if (fileRef.current) {
                      fileRef.current.value = "";
                    }
                  }}
                >
                  Remove
                </button>
              )}
            </label>

            <button
              type="submit"
              className="mt-2 w-full cursor-pointer rounded-xl bg-[#61dca3] py-3 font-bold text-[#0b0f15] shadow-lg transition hover:scale-105"
            >
              {editing ? "Update Project" : "Add Project"}
            </button>

            {editing && (
              <button
                type="button"
                className="mt-1 cursor-pointer text-xs text-gray-400 hover:underline"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto rounded-2xl bg-[#181a21] p-4 shadow-lg">
          <table className="min-w-[600px] w-full text-left">
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
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-[#232537]/40 transition hover:bg-[#232537]/30"
                >
                  <td className="p-3">
                    <img
                      src={project.imageUrl}
                      alt={project.title_en || project.title || "project"}
                      className="h-16 w-16 rounded-md border-2 border-[#61dca3]/50 object-cover"
                    />
                  </td>
                  <td className="p-3 font-bold">{project.title_en || project.title || ""}</td>
                  <td className="p-3 capitalize">{project.category}</td>
                  <td className="p-3">
                    {project.pinned ? (
                      <span className="rounded-full bg-[#61DCA3] px-2 py-1 text-xs font-bold text-[#0b0f15]">
                        Pinned {project.order ?? "?"}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="max-w-xs p-3">
                    <div className="flex flex-wrap gap-1">
                      {(project.tech ?? []).map((tech, index) => (
                        <span
                          key={`${tech}-${index}`}
                          className="rounded bg-[#232537] px-2 py-1 text-xs font-semibold text-[#61dca3]"
                        >
                          {getTechDisplayLabel(tech)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="max-w-xs truncate p-3">
                    {project.href ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#61DCA3] underline hover:text-[#33b273]"
                      >
                        {project.href}
                      </a>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-4">
                      <button
                        className="cursor-pointer font-semibold text-blue-400 hover:underline"
                        onClick={() => handleEdit(project)}
                      >
                        Edit
                      </button>
                      <button
                        className="cursor-pointer font-semibold text-[#61DCA3] hover:underline"
                        onClick={() => handleTogglePinned(project)}
                      >
                        {project.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        className="cursor-pointer font-semibold text-red-400 hover:underline"
                        onClick={() =>
                          setShowDelete({
                            id: project.id,
                            title: project.title_en || project.title || "",
                          })
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
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No projects found. Add one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showDelete && (
          <DeleteDialog
            titleId="del-title"
            heading="Delete Project?"
            itemName={showDelete.title}
            onCancel={() => setShowDelete(null)}
            onConfirm={async () => {
              await deleteProject(showDelete.id);
              setToast("Project deleted!");
              setShowDelete(null);
              getProjects().then(setProjects);
            }}
          />
        )}
      </main>
    </div>
  );
}

// ── Tech Multi-Select ────────────────────────────────────────────

function TechMultiSelect({
  selectedTechs,
  suggestions,
  onAdd,
  onRemove,
}: {
  selectedTechs: string[];
  suggestions: string[];
  onAdd: (tech: string) => void;
  onRemove: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const q = query.toLowerCase().trim();
  const filtered = q
    ? suggestions.filter((s) => s.toLowerCase().includes(q))
    : suggestions;

  const addTech = (tech: string) => {
    onAdd(tech);
    setQuery("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      const match = suggestions.find(
        (s) => s.toLowerCase() === query.trim().toLowerCase(),
      );
      if (match) addTech(match);
      else addTech(query.trim()); // custom tech
    }
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Backspace" && !query && selectedTechs.length > 0) {
      onRemove(selectedTechs.length - 1);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Selected badges + input */}
      <div
        className="min-h-[44px] rounded-xl bg-[#232537] px-3 py-2 focus-within:ring-2 focus-within:ring-[#61dca3] cursor-text"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-wrap items-center gap-2">
          {selectedTechs.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="flex items-center gap-1.5 rounded-full bg-[#61dca3] px-2.5 py-0.5 text-xs font-bold text-[#0b0f15]"
            >
              {tech}
              <button
                type="button"
                className="cursor-pointer font-bold hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(i);
                }}
              >
                &times;
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder={selectedTechs.length ? "" : "Search tech..."}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKey}
            className="min-w-[120px] flex-1 bg-transparent py-1 text-sm text-white outline-none placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-[#1c1e27] py-1 shadow-2xl">
          {filtered.length === 0 && query.trim() && (
            <div className="px-4 py-3 text-sm text-white/40">
              Press Enter to add &ldquo;{query.trim()}&rdquo; as custom tech
            </div>
          )}
          {filtered.map((tech) => {
            const selected = selectedTechs.some(
              (t) => t.toLowerCase() === tech.toLowerCase(),
            );
            return (
              <button
                key={tech}
                type="button"
                className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition ${
                  selected
                    ? "bg-[#61DCA3]/10 text-[#61DCA3]"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => {
                  if (selected) {
                    const idx = selectedTechs.findIndex(
                      (t) => t.toLowerCase() === tech.toLowerCase(),
                    );
                    if (idx >= 0) onRemove(idx);
                  } else {
                    addTech(tech);
                  }
                }}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                    selected
                      ? "border-[#61DCA3] bg-[#61DCA3] text-black"
                      : "border-white/20"
                  }`}
                >
                  {selected ? "✓" : ""}
                </span>
                {tech}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Case Study Fields (collapsible) ──────────────────────────────

function CaseStudyFields({
  form,
  setForm,
  keyFeatures,
  onKeyFeaturesChange,
}: {
  form: ProjectInput;
  setForm: React.Dispatch<React.SetStateAction<ProjectInput>>;
  keyFeatures: string[];
  onKeyFeaturesChange: (features: string[]) => void;
}) {
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState<"en" | "id">("en");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    overview: true,
    story: true,
  });

  if (!show) {
    return (
      <button
        type="button"
        className="cursor-pointer rounded-xl border border-dashed border-white/10 bg-transparent px-4 py-3 text-sm text-white/40 transition hover:border-[#61DCA3]/40 hover:text-[#61DCA3]"
        onClick={() => setShow(true)}
      >
        + Add Case Study Details (Problem, Solution, Impact...)
      </button>
    );
  }

  const update = (field: string, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // Map tab to field suffix
  const sfx = tab === "id" ? "_id" : "";
  const fields = {
    problem: `problemStatement${sfx}`,
    solution: `solutionApproach${sfx}`,
    impact: `impact${sfx}`,
    techRationale: `techRationale${sfx}`,
    learnings: `learnings${sfx}`,
  };

  return (
    <div className="rounded-xl bg-[#1c1e27] p-5 flex flex-col gap-4 border border-white/5">
      {/* Header + tabs + hide */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-sm font-semibold text-[#61DCA3]">Case Study</span>
        {/* Tabs */}
        <div className="flex rounded-lg bg-[#232537] p-0.5">
          {(["en", "id"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                tab === t
                  ? "bg-[#61DCA3] text-[#0b0f15]"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {t === "en" ? "EN" : "ID"}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="cursor-pointer text-xs text-gray-400 hover:text-white sm:ml-auto"
          onClick={() => setShow(false)}
        >
          Hide
        </button>
      </div>

      {/* Accordion: Overview */}
      <AccordionSection
        label="Overview"
        open={openSections.overview}
        onToggle={() => toggleSection("overview")}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input type="text" placeholder="Year (e.g. 2024)"
            value={form.year ?? ""} onChange={(e) => update("year", e.target.value)}
            className="rounded-lg border border-transparent bg-[#232537] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#61dca3]" />
          <input type="text" placeholder="Duration (e.g. 3 months)"
            value={form.duration ?? ""} onChange={(e) => update("duration", e.target.value)}
            className="rounded-lg border border-transparent bg-[#232537] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#61dca3]" />
          <input type="text" placeholder="Role (e.g. Solo Developer)"
            value={form.role ?? ""} onChange={(e) => update("role", e.target.value)}
            className="rounded-lg border border-transparent bg-[#232537] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#61dca3]" />
        </div>
      </AccordionSection>

      {/* Accordion: Story */}
      <AccordionSection
        label="Story"
        open={openSections.story}
        onToggle={() => toggleSection("story")}
      >
        <div className="flex flex-col gap-3">
          <FieldTextarea
            label={`Problem (${tab.toUpperCase()})`}
            value={form[fields.problem as keyof ProjectInput] as string ?? ""}
            onChange={(v) => update(fields.problem, v)}
            rows={3}
          />
          <FieldTextarea
            label={`Solution (${tab.toUpperCase()})`}
            value={form[fields.solution as keyof ProjectInput] as string ?? ""}
            onChange={(v) => update(fields.solution, v)}
            rows={3}
          />
          <FieldTextarea
            label={`Impact (${tab.toUpperCase()})`}
            value={form[fields.impact as keyof ProjectInput] as string ?? ""}
            onChange={(v) => update(fields.impact, v)}
            rows={2}
          />
          <FieldTextarea
            label={`Tech Rationale (${tab.toUpperCase()})`}
            value={form[fields.techRationale as keyof ProjectInput] as string ?? ""}
            onChange={(v) => update(fields.techRationale, v)}
            rows={2}
          />
          <FieldTextarea
            label={`Learnings (${tab.toUpperCase()})`}
            value={form[fields.learnings as keyof ProjectInput] as string ?? ""}
            onChange={(v) => update(fields.learnings, v)}
            rows={2}
          />
        </div>
      </AccordionSection>

      {/* Key Features */}
      <CaseStudyFeatureInput
        features={keyFeatures}
        onChange={onKeyFeaturesChange}
      />
    </div>
  );
}

// ── Accordion helper ───────────────────────────────────────────

function AccordionSection({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/5">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-white/50 uppercase tracking-widest hover:text-white/80 transition cursor-pointer"
        onClick={onToggle}
      >
        <span className={`transition-transform ${open ? "rotate-90" : ""}`}>
          ▸
        </span>
        {label}
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

// ── Textarea helper ───────────────────────────────────────────

function FieldTextarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-white/30 uppercase tracking-widest">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-lg border border-transparent bg-[#232537] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#61dca3]"
      />
    </div>
  );
}

// ── Key Features input ────────────────────────────────────────

function CaseStudyFeatureInput({
  features,
  onChange,
}: {
  features: string[];
  onChange: (features: string[]) => void;
}) {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-white/30 uppercase tracking-widest">Key Features</span>
      <div className="min-h-[36px] rounded-lg bg-[#232537] px-3 py-2 focus-within:ring-2 focus-within:ring-[#61dca3]">
        <div className="flex flex-wrap items-center gap-2">
          {features.map((feat, i) => (
            <span key={i} className="flex items-center gap-1.5 rounded-full bg-[#61dca3] px-2.5 py-0.5 text-xs font-bold text-[#0b0f15]">
              {feat}
              <button type="button" className="cursor-pointer font-bold hover:text-red-700"
                onClick={() => onChange(features.filter((_, j) => j !== i))}>
                &times;
              </button>
            </span>
          ))}
          <input type="text" placeholder="Add feature then Enter..."
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (["Enter", ","].includes(e.key) && input.trim()) {
                e.preventDefault();
                onChange([...features, input.trim()]);
                setInput("");
              }
            }}
            className="min-w-[120px] flex-1 bg-transparent py-1 text-sm text-white outline-none"
          />
        </div>
      </div>
    </div>
  );
}

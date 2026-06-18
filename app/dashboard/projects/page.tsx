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

    getProjects().then(setProjects);
  }, [user, router]);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

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

    if (!form.title || !form.description || !form.tech?.length) {
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
            duplicatePinnedOrder.title ?? "another project"
          }!`,
        );
        return;
      }
    }

    let imageUrl = form.imageUrl ?? "";
    if (file) {
      imageUrl = await uploadToCloudinary(file);
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
      title: project.title ?? "",
      description: project.description ?? "",
      category: project.category ?? "",
      href: project.href ?? "",
      tech: Array.isArray(project.tech)
        ? project.tech.map((tech) => getTechDisplayLabel(tech))
        : [],
      imageUrl: project.imageUrl ?? "",
      pinned: Boolean(project.pinned),
      order: Number(project.order ?? 0),
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
            <input
              placeholder="Title"
              value={form.title ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-transparent bg-[#232537] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#61dca3]"
              required
            />

            <textarea
              placeholder="Description"
              value={form.description ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="w-full resize-none rounded-xl border border-transparent bg-[#232537] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#61dca3]"
              rows={3}
              required
            />

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

            <div className="min-h-[44px] rounded-xl bg-[#232537] px-3 py-2 focus-within:ring-2 focus-within:ring-[#61dca3]">
              <div className="flex flex-wrap items-center gap-2">
                {(form.tech ?? []).map((tech, index) => (
                  <span
                    key={`${tech}-${index}`}
                    className="flex items-center gap-2 rounded-full bg-[#61dca3] px-3 py-1 text-sm font-bold text-[#0b0f15]"
                  >
                    {tech}
                    <button
                      type="button"
                      className="ml-1 cursor-pointer text-lg font-bold text-[#0b0f15] hover:text-red-700 focus:outline-none"
                      onClick={() => handleRemoveTech(index)}
                      aria-label={`Remove ${tech}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  placeholder="Add tech then Enter..."
                  value={techInput}
                  onChange={(event) => setTechInput(event.target.value)}
                  onKeyDown={handleTechKey}
                  onBlur={() => addTechToForm(techInput)}
                  className="min-w-[100px] flex-1 bg-transparent py-1 text-white outline-none"
                  list="tech-list"
                />
              </div>
              <datalist id="tech-list">
                {techSuggestions.map((tech) => (
                  <option key={tech} value={tech} />
                ))}
              </datalist>
            </div>

            <input
              placeholder="Github / Live link"
              value={form.href ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  href: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-transparent bg-[#232537] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#61dca3]"
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

              {(file || preview) && (
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
                      alt={project.title ?? "project"}
                      className="h-16 w-16 rounded-md border-2 border-[#61dca3]/50 object-cover"
                    />
                  </td>
                  <td className="p-3 font-bold">{project.title}</td>
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
                            title: project.title ?? "",
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

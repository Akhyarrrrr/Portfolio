"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { ProjectType } from "@/lib/content";
import ProjectDetailClient from "@/app/projects/[slug]/ProjectDetailClient";

type ProjectModalProps = {
  project: ProjectType | null;
  relatedProjects: ProjectType[];
  onClose: () => void;
  onSelectProject: (slug: string) => void;
};

export default function ProjectModal({
  project,
  relatedProjects,
  onClose,
  onSelectProject,
}: ProjectModalProps) {
  const isOpen = project !== null;
  const reduceMotion = useReducedMotion();

  // Push state when opening
  useEffect(() => {
    if (!project?.slug) return;
    const url = `/projects/${project.slug}`;
    // Only push if not already at this URL (prevents double-push on project switch)
    if (window.location.pathname !== url) {
      window.history.pushState({ modal: project.slug }, "", url);
    }
  }, [project?.slug]);

  // Listen for browser back button
  useEffect(() => {
    if (!isOpen) return;
    const handlePop = () => onClose();
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    // Close unconditionally rather than waiting for popstate to do it. The
    // old version relied on history.back() producing a popstate, but the
    // pushState at :29 is skipped when the pathname already matches, so
    // history.state.modal could be truthy with nothing to pop — back() then
    // navigated elsewhere, onClose never ran, and body{overflow:hidden}
    // stayed applied, leaving the page unscrollable until a refresh.
    // (The old removeEventListener here was a no-op anyway: the registered
    // listener is `handlePop` at :37, not `onClose`.)
    if (window.history.state?.modal) {
      window.history.back();
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleClose, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-[#0B0F15]"
          role="dialog"
          aria-modal="true"
          aria-label="Project detail"
        >
          <ProjectDetailClient
            project={project}
            relatedProjects={relatedProjects}
            onProjectSelect={onSelectProject}
            onClose={handleClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

const ProjectDetails = ({ project, closeModal }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [closeModal]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleFocus = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        dialogRef.current.focus();
      }
    };
    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={closeModal}
        className="fixed inset-0 z-50 bg-canvas/90 backdrop-blur-[2px]"
        aria-hidden="true"
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        tabIndex={-1}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-0 z-[60] overflow-y-auto bg-canvas"
      >
        <article className="mx-auto min-h-full max-w-[860px] px-5 py-16 sm:px-10 md:py-20">
          <header className="flex items-start justify-between gap-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone/70">Case study</p>
            <button onClick={closeModal} className="border border-line px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-stone transition-colors hover:border-accent hover:text-ink">
              Close
            </button>
          </header>

          <h2 className="mt-8 font-display text-3xl font-normal text-ink md:text-5xl">{project.title}</h2>

          {project.image && (
            <div className="mt-8 overflow-hidden border border-line">
              <img src={project.image} alt={`${project.title} interface`} className="w-full object-cover" />
            </div>
          )}

          <p className="mt-8 max-w-[65ch] text-base leading-relaxed text-stone">{project.description}</p>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-6">
            {project.tags.map((tag) => (
              <span key={tag.id} className="font-mono text-xs uppercase tracking-[0.12em] text-stone">
                {tag.name}
              </span>
            ))}
          </div>

          {project.subDescription?.length > 0 && (
            <div className="mt-10 space-y-5">
              {project.subDescription.map((block, blockIndex) => {
                const text = Array.isArray(block?.children) ? block.children.map((child) => child?.text || "").join("") : "";
                return text.trim() ? (
                  <p key={block._key || blockIndex} className="max-w-[65ch] text-base leading-relaxed text-stone">
                    {text}
                  </p>
                ) : null;
              })}
            </div>
          )}

          {project.href && (
            <a href={project.href} target="_blank" rel="noopener noreferrer" className="mt-12 inline-flex items-center gap-3 border border-line px-5 py-3 font-mono text-sm text-ink transition-colors hover:border-accent">
              View Live Project
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4" aria-hidden="true">
                <path d="M7 17 17 7m0 0H8m9 0v9" />
              </svg>
            </a>
          )}
        </article>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectDetails;
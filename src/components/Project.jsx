import { motion } from "motion/react";

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4" aria-hidden="true">
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);

const Project = ({ index, project, onOpen }) => {
  const indexLabel = String(index).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group grid gap-6 border-t border-line py-10 md:grid-cols-12 md:gap-x-10 md:py-12"
    >
      <span className="font-mono text-xs text-stone/70 md:col-span-1">{indexLabel}</span>

      <button onClick={onOpen} className="group/plate relative block overflow-hidden border border-line bg-surface md:col-span-5" aria-label={`Open details for ${project.title}`}>
        {project.image ? (
          <img src={project.image} alt={`${project.title} interface`} className="aspect-4/3 w-full object-cover opacity-80 transition duration-500 group-hover/plate:scale-[1.02] group-hover/plate:opacity-100" />
        ) : (
          <div className="flex aspect-4/3 w-full items-center justify-center">
            <span className="font-display text-5xl text-stone/40 md:text-6xl">{indexLabel}</span>
          </div>
        )}
      </button>

      <div className="flex flex-col md:col-span-5">
        <h3 className="font-display text-2xl font-normal text-ink md:text-3xl">
          <button onClick={onOpen} className="text-left transition-colors hover:text-accent focus-visible:outline-none">
            {project.title}
          </button>
        </h3>
        <p className="mt-3 max-w-[55ch] text-sm leading-relaxed text-stone">{project.description}</p>
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
          {project.tags.map((tag) => (
            <span key={tag.id} className="font-mono text-xs uppercase tracking-[0.12em] text-stone/70">
              {tag.name}
            </span>
          ))}
        </div>
        <button onClick={onOpen} className="group/link mt-7 inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:text-accent focus-visible:outline-none">
          Read More <ArrowRight />
        </button>
      </div>

      <div className="hidden items-start justify-end md:col-span-1 md:flex">
        <button onClick={onOpen} className="flex items-center justify-center border border-line p-3 text-stone transition-colors hover:border-accent hover:text-accent" aria-label={`Open details for ${project.title}`}>
          <ArrowRight />
        </button>
      </div>
    </motion.article>
  );
};

export default Project;
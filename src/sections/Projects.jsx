import { useCallback, useEffect, useState } from "react";
import Project from "../components/Project";
import ProjectDetails from "../components/ProjectDetails";
import SectionHeading from "../components/SectionHeading";
import { isSafeUrl, normalizeExperiencePhotos } from "../lib/content";
import { client } from "../lib/sanity";
import { PROJECTS_QUERY } from "../lib/queries";

const Projects = ({ section }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    client
      .fetch(PROJECTS_QUERY)
      .then((data) => {
        // Coming-soon projects never link out, even if href is set
        const transformed = data.map((project) => {
          // Photos win; the legacy image only stands in when none has an asset
          const photos = normalizeExperiencePhotos(project.photos).map((photo, photoIndex) => ({ ...photo, alt: photo.alt || `${project.title} photo ${photoIndex + 1}` }));
          const legacyUrl = project.image?.asset?.url;
          const legacy = legacyUrl ? [{ key: "legacy", url: legacyUrl, alt: `${project.title} interface`, caption: "" }] : [];
          return {
            id: project._id,
            title: project.title,
            description: project.description,
            subDescription: project.subDescription || [],
            comingSoon: project.status === "coming-soon",
            href: project.status !== "coming-soon" && isSafeUrl(project.href) ? project.href : "",
            photos: photos.length ? photos : legacy,
            tags: (project.tags || []).map((tag) => ({
              id: tag._id,
              name: tag.name,
            })),
          };
        });
        setProjects(transformed);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Stable handlers keep memoised rows from re-rendering when one opens
  const openById = useCallback((id) => setOpenId(id), []);
  const closeProject = useCallback(() => setOpenId(null), []);

  const openProject = projects.find((project) => project.id === openId) || null;

  return (
    <section id={section.anchor} className="c-space section-space">
      <SectionHeading code={section.code}>{section.title}</SectionHeading>

      {isLoading && <p className="mt-12 font-mono text-sm text-stone">Loading projects…</p>}
      {error && <p className="mt-12 font-mono text-sm text-stone">Couldn&apos;t load projects. Please try again later.</p>}

      {!isLoading && !error && (
        <div className="mt-12 border-b border-line md:mt-16">
          {projects.map((project, index) => (
            <Project key={project.id} index={index + 1} project={project} onOpen={openById} />
          ))}
        </div>
      )}

      {openProject && <ProjectDetails key={openProject.id} project={openProject} closeModal={closeProject} />}
    </section>
  );
};

export default Projects;
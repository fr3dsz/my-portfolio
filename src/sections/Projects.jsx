import { useEffect, useState } from "react";
import Project from "../components/Project";
import ProjectDetails from "../components/ProjectDetails";
import SectionHeading from "../components/SectionHeading";
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
        const transformed = data.map((project) => ({
          id: project._id,
          title: project.title,
          description: project.description,
          subDescription: project.subDescription || [],
          href: project.href || "",
          image: project.image?.asset?.url || "",
          tags: (project.tags || []).map((tag) => ({
            id: tag._id,
            name: tag.name,
          })),
        }));
        setProjects(transformed);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const openProject = projects.find((project) => project.id === openId) || null;

  return (
    <section id={section.anchor} className="c-space pb-16 pt-24 md:pb-24 md:pt-32">
      <SectionHeading code={section.code}>{section.title}</SectionHeading>

      {isLoading && <p className="mt-12 font-mono text-sm text-stone">Loading projects…</p>}
      {error && <p className="mt-12 font-mono text-sm text-stone">Couldn&apos;t load projects. Please try again later.</p>}

      {!isLoading && !error && (
        <div className="mt-12 border-b border-line md:mt-16">
          {projects.map((project, index) => (
            <Project key={project.id} index={index + 1} project={project} onOpen={() => setOpenId(project.id)} />
          ))}
        </div>
      )}

      {openProject && <ProjectDetails project={openProject} closeModal={() => setOpenId(null)} />}
    </section>
  );
};

export default Projects;
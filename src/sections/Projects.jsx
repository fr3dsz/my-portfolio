import { useEffect, useState } from "react";
import Project from "../components/Project";
import { client } from "../lib/sanity";
import { PROJECTS_QUERY } from "../lib/queries";
import { motion, useMotionValue, useSpring } from "motion/react";

const Projects = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 10, stiffness: 50 });
  const springY = useSpring(y, { damping: 10, stiffness: 50 });
  const handleMouseMove = (e) => {
    x.set(e.clientX + 20);
    y.set(e.clientY + 20);
  };
  const [preview, setPreview] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
            path: tag.icon?.asset?.url || "",
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

  return (
    <section id="work" onMouseMove={handleMouseMove} className="relative c-space section-spacing">
      <h2 className="text-heading">My Projects</h2>
      <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent mt-12 h-[1px] w-full" />

      {isLoading && <p className="mt-10 text-neutral-400">Loading projects...</p>}
      {error && <p className="mt-10 text-red-400">Couldn't load projects. Please try again later.</p>}

      {!isLoading && !error && projects.map((project) => <Project key={project.id} {...project} setPreview={setPreview} />)}

      {preview && <motion.img className="fixed top-0 left-0 z-50 object-cover h-56 rounded-lg shadow-lg pointer-events-none w-80" src={preview} style={{ x: springX, y: springY }} />}
    </section>
  );
};

export default Projects;

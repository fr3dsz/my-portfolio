import { useEffect, useState } from "react";
import { Timeline } from "../components/Timeline";
import { client } from "../lib/sanity";
import { EXPERIENCES_QUERY } from "../lib/queries";

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client
      .fetch(EXPERIENCES_QUERY)
      .then((data) => setExperiences(data))
      .catch((err) => {
        console.error("Failed to fetch experiences:", err);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="c-space section-spacing" id="experience">
      <h2 className="text-heading">My Work Experience</h2>
      <div className="mt-12 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

      {isLoading && <p className="mt-10 text-neutral-400">Loading experience...</p>}
      {error && <p className="mt-10 text-red-400">Couldn't load experiences. Please try again later.</p>}
      {!isLoading && !error && experiences.length === 0 && <p className="mt-10 text-neutral-400">No experiences yet.</p>}

      {!isLoading && !error && experiences.length > 0 && <Timeline data={experiences} />}
    </section>
  );
};

export default Experiences;

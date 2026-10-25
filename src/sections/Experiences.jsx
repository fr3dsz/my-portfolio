import { useEffect, useState } from "react";
import { Timeline } from "../components/Timeline";
import SectionHeading from "../components/SectionHeading";
import { client } from "../lib/sanity";
import { EXPERIENCES_QUERY } from "../lib/queries";

const Experiences = ({ section }) => {
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
    <section id={section.anchor} className="c-space pb-16 pt-24 md:pb-24 md:pt-32">
      <SectionHeading code={section.code}>{section.title}</SectionHeading>

      {isLoading && <p className="mt-10 font-mono text-sm text-stone">Loading experience...</p>}
      {error && <p className="mt-10 font-mono text-sm text-stone">Couldn&apos;t load experiences. Please try again later.</p>}
      {!isLoading && !error && experiences.length === 0 && <p className="mt-10 font-mono text-sm text-stone">No experiences yet.</p>}

      {!isLoading && !error && experiences.length > 0 && <Timeline data={experiences} />}
    </section>
  );
};

export default Experiences;
import { useEffect, useState } from "react";
import { Timeline } from "../components/Timeline";
import { client } from "../lib/sanity";
import { EXPERIENCES_QUERY } from "../lib/queries";

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(EXPERIENCES_QUERY)
      .then((data) => setExperiences(data))
      .catch((err) => console.error("Failed to fetch experiences:", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p className="w-full text-center text-neutral-400">Loading experience...</p>;
  }

  return (
    <div className="w-full">
      <Timeline data={experiences} />
    </div>
  );
};

export default Experiences;

import { useEffect, useMemo, useState } from "react";
import Navbar from "./sections/Navbar";
import Footer from "./sections/Footer";
import { defaultSections } from "./constants";
import { fetchHomeSections, normalizeSections } from "./lib/content";
import { knownSectionTypes, sectionComponents } from "./sections/registry";

const App = () => {
  // null until the layout is known — rendering fallback sections first would
  // visibly reorder the page once a customized CMS layout arrives
  const [sections, setSections] = useState(null);

  useEffect(() => {
    fetchHomeSections(knownSectionTypes)
      .catch((err) => {
        console.error("Failed to fetch home page layout:", err);
        return normalizeSections(defaultSections, knownSectionTypes);
      })
      .then(setSections);
  }, []);

  const navLinks = useMemo(
    () => (sections || []).filter((section) => section.navLabel).map((section) => ({ href: `#${section.anchor}`, label: section.navLabel, code: section.code })),
    [sections]
  );

  if (!sections) return <div className="min-h-screen" aria-busy="true" />;

  return (
    <div className="mx-auto max-w-[1200px]">
      <Navbar links={navLinks} homeHref={sections[0] ? `#${sections[0].anchor}` : "#"} />
      {sections.map((section) => {
        const Section = sectionComponents[section._type];
        return <Section key={section.key} section={section} />;
      })}
      <Footer />
    </div>
  );
};

export default App;

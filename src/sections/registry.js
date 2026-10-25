import About from "./About";
import Contact from "./Contact";
import Experiences from "./Experiences";
import Hero from "./Hero";
import Projects from "./Projects";
import TextSection from "./TextSection";

// Sanity homePage section _type → component. A type missing here is skipped,
// so adding a section means: schema in backend sections.ts + an entry here.
export const sectionComponents = {
  heroSection: Hero,
  aboutSection: About,
  projectsSection: Projects,
  experienceSection: Experiences,
  contactSection: Contact,
  textSection: TextSection,
};

export const knownSectionTypes = new Set(Object.keys(sectionComponents));

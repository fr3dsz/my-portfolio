import { useEffect, useState } from "react";
import AvailabilityStatus from "../components/AvailabilityStatus";
import { Frameworks } from "../components/Frameworks";
import SectionHeading from "../components/SectionHeading";
import Timezone from "../components/Timezone";
import { defaultAbout } from "../constants";
import { fetchAbout } from "../lib/content";
import { useSiteSettings } from "../lib/siteSettings";

const Label = ({ children }) => <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone/70">{children}</p>;

const About = () => {
  const settings = useSiteSettings();
  // fallback content renders at once; CMS content replaces it when it arrives
  const [about, setAbout] = useState(defaultAbout);

  useEffect(() => {
    fetchAbout()
      .then(setAbout)
      .catch((err) => console.error("Failed to fetch about:", err));
  }, []);

  const { heading, bio, photo, currently, education, techGroups } = about;

  return (
    <section id="about" className="c-space pb-16 pt-24 md:pb-24 md:pt-32">
      <SectionHeading code="02">About Me</SectionHeading>

      <div className="mt-12 grid gap-y-12 md:mt-16 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-7">
          <h3 className="font-display text-xl font-normal text-ink md:text-2xl">{heading || `Hi, I'm ${settings.name}`}</h3>
          <div className="mt-4 max-w-[65ch] space-y-4 text-base leading-relaxed text-stone">
            {bio.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {education.length > 0 && (
            <div className="mt-12">
              <Label>Education</Label>
              <ul className="mt-5 border-t border-line">
                {education.map((item, index) => (
                  <li key={index} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-3">
                    <span>
                      <span className="text-ink">{item.school}</span>
                      {item.credential && <span className="block text-sm text-stone">{item.credential}</span>}
                    </span>
                    {item.period && <span className="font-mono text-xs text-stone/70">{item.period}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12">
            <div className="mb-5">
              <Label>Tech Stack</Label>
            </div>
            <Frameworks groups={techGroups} />
          </div>
        </div>

        <aside className="md:col-span-5 md:border-l md:border-line md:pl-10 lg:pl-14">
          {photo && (
            <img
              src={`${photo.url}?w=640&h=800&fit=crop&auto=format`}
              alt={photo.alt}
              width="320"
              height="400"
              loading="lazy"
              className="mb-10 aspect-[4/5] w-full max-w-xs border border-line object-cover"
            />
          )}

          <Label>Based in</Label>
          <div className="mt-5">
            <Timezone location={settings.location} timeZone={settings.timeZone} />
          </div>

          <div className="mt-10 border-t border-line pt-6">
            <Label>Availability</Label>
            <AvailabilityStatus className="mt-4" />
            <a href="#contact" className="mt-6 inline-block font-mono text-sm text-stone underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-accent">
              Get in touch →
            </a>
          </div>

          {currently.length > 0 && (
            <div className="mt-10 border-t border-line pt-6">
              <Label>Currently</Label>
              <dl className="mt-4">
                {currently.map((item, index) => (
                  <div key={index} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-line py-2.5 last:border-0">
                    <dt className="w-20 shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-stone/70">{item.label}</dt>
                    <dd className="text-sm text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};

export default About;

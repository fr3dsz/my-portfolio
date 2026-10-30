import { useEffect, useState } from "react";
import AvailabilityStatus from "../components/AvailabilityStatus";
import { Frameworks } from "../components/Frameworks";
import SectionHeading from "../components/SectionHeading";
import Timezone from "../components/Timezone";
import { defaultAbout } from "../constants";
import { fetchAbout } from "../lib/content";
import { getAvailabilityLabel, useSiteSettings } from "../lib/siteSettings";

const Label = ({ children }) => <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone/70">{children}</p>;

const About = ({ section }) => {
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
    <section id={section.anchor} className="c-space pb-16 pt-24 md:pb-24 md:pt-32">
      <SectionHeading code={section.code}>{section.title}</SectionHeading>

      {/* DOM order is the mobile reading order: lead, facts, then supporting detail. From md the facts span both rows; 1fr keeps a tall facts column from opening a gap under the lead. */}
      <div className="mt-12 grid gap-y-12 md:mt-16 md:grid-cols-12 md:grid-rows-[auto_1fr] md:gap-x-12">
        <div className="md:col-span-7">
          <h3 className="font-display text-xl font-normal text-ink md:text-2xl">{heading || `Hi, I'm ${settings.name}`}</h3>
          {settings.role && <p className="mt-2 font-mono text-sm text-stone">{settings.role}</p>}
          <div className="mt-4 max-w-[65ch] space-y-4 text-base leading-relaxed text-stone">
            {bio.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <aside className="border-t border-line pt-6 md:col-span-5 md:col-start-8 md:row-span-2 md:row-start-1 md:border-l md:border-t-0 md:pl-10 md:pt-0 lg:pl-14">
          {getAvailabilityLabel(settings) && (
            <div className="mb-6">
              <Label>Availability</Label>
              <AvailabilityStatus className="mt-4" />
            </div>
          )}
          <a href="#contact" className="inline-flex items-center gap-3 border border-line px-5 py-3 font-mono text-sm text-ink transition-colors duration-200 hover:border-accent">
            Get in touch →
          </a>

          <div className="mt-10 border-t border-line pt-6">
            <Label>Based in</Label>
            <div className="mt-5">
              <Timezone location={settings.location} timeZone={settings.timeZone} />
            </div>
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

          {photo && (
            <img
              src={`${photo.url}?w=640&h=800&fit=crop&auto=format`}
              alt={photo.alt}
              width="320"
              height="400"
              loading="lazy"
              className="mt-10 aspect-[4/5] w-full max-w-xs border border-line object-cover md:max-w-[220px]"
            />
          )}
        </aside>

        <div className="space-y-12 md:col-span-7 md:col-start-1 md:row-start-2">
          {education.length > 0 && (
            <div>
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

          <div>
            <div className="mb-5">
              <Label>Tech Stack</Label>
            </div>
            <Frameworks groups={techGroups} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

import CopyEmailButton from "../components/CopyEmailButton";
import SectionHeading from "../components/SectionHeading";
import { profile } from "../constants";

const Contact = () => {
  return (
    <section id="contact" className="c-space pb-8 pt-24 md:pt-32">
      <SectionHeading code="05">Contact</SectionHeading>

      <div className="mt-12 md:mt-16">
        <p className="max-w-[40ch] font-display text-2xl font-normal leading-snug text-stone md:text-3xl">
          Have a role, a project, or just a question? My inbox is open.
        </p>

        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-block break-all font-display text-xl text-ink underline decoration-line underline-offset-8 transition-colors hover:text-accent hover:decoration-accent md:text-3xl"
        >
          {profile.email}
        </a>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <CopyEmailButton email={profile.email} />
          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-line px-5 py-3 font-mono text-sm text-ink transition-colors duration-200 hover:border-accent"
            >
              Download résumé ↗
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;

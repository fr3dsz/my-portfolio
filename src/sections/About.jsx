import { Frameworks } from "../components/Frameworks";
import SectionHeading from "../components/SectionHeading";
import Timezone from "../components/Timezone";
import { profile } from "../constants";

const About = () => {
  return (
    <section id="about" className="c-space pb-16 pt-24 md:pb-24 md:pt-32">
      <SectionHeading code="02">About Me</SectionHeading>

      <div className="mt-12 grid gap-y-12 md:mt-16 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-7">
          <h3 className="font-display text-xl font-normal text-ink md:text-2xl">Hi, I&apos;m {profile.name}</h3>
          <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-stone">
            I enjoy building software that solves real problems through full-stack projects and hands-on development. I&apos;ve worked with different technologies in academic projects and focus more on understanding how systems work.
          </p>

          <div className="mt-12">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-stone/70">Tech Stack</p>
            <Frameworks />
          </div>
        </div>

        <aside className="md:col-span-5 md:border-l md:border-line md:pl-10 lg:pl-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone/70">Based in</p>
          <div className="mt-5">
            <Timezone location={profile.location} timeZone={profile.timeZone} />
          </div>

          <div className="mt-10 border-t border-line pt-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone/70">Availability</p>
            <p className="mt-4 flex items-center gap-3 font-mono text-sm text-ink">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-status" />
              Open to remote worldwide
            </p>
            <a href="#contact" className="mt-6 inline-block font-mono text-sm text-stone underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-accent">
              Get in touch →
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default About;
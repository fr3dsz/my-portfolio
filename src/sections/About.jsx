import CopyEmailButton from "../components/CopyEmailButton";
import { Frameworks } from "../components/Frameworks";
import Timezone from "../components/Timezone";

const About = () => {
  return (
    <section className="c-space section-spacing" id="about">
      <h2 className="text-heading">About Me</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[18rem] mt-12">
        {/* Grid 1 — Intro, full width */}
        <div className="flex items-end grid-default-color grid-1">
          <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
            <div className="absolute w-80 h-80 rounded-full bg-royal/80 blur-2xl mix-blend-screen animate-drift -top-14 -left-14" />
            <div className="absolute rounded-full bg-lavender/70 blur-2xl mix-blend-screen w-96 h-96 top-1/4 -right-10 animate-drift" style={{ animationDelay: "-5s", animationDuration: "18s" }} />
            <div className="absolute rounded-full bg-fuchsia/60 blur-2xl mix-blend-screen w-72 h-72 top-1/3 left-1/3 animate-drift" style={{ animationDelay: "-9s", animationDuration: "11s" }} />
            <div className="absolute rounded-full bg-aqua/60 blur-2xl mix-blend-screen w-64 h-64 -bottom-10 left-1/4 animate-drift" style={{ animationDelay: "-13s", animationDuration: "16s" }} />
          </div>
          <div className="z-10">
            <p className="headtext">Hi, I'm Luis Conda</p>
            <p className="subtext">I enjoy building software that solves real problems through full-stack projects and hands-on development. I’ve worked with different technologies in academic projects and focus more on understanding how systems work.</p>
          </div>
          <div className="absolute inset-x-0 pointer-events-none -bottom-4 h-1/2 sm:h-1/3 bg-gradient-to-t from-indigo" />
        </div>
        {/* Grid 3 — Timezone, half width */}
        <div className="grid-black-color grid-3 flex flex-col justify-between">
          <div className="z-10 w-[50%]">
            <p className="headtext">Time Zone</p>
            <p className="subtext">I'm based in Philippines, and open to remote work worldwide</p>
          </div>
          <Timezone />
        </div>
        {/* Grid 4 — Contact CTA, half width */}
        <div className="grid-special-color grid-4">
          <div className="flex flex-col items-center justify-center gap-4 size-full">
            <p className="text-center headtext">Do you want to start a project together?</p>
            <CopyEmailButton />
          </div>
        </div>
        {/* Grid 5 — Tech Stack, full width */}
        <div className="grid-default-color grid-5">
          <div className="z-10 w-[50%]">
            <p className="headtext">Tech Stack</p>
            <p className="subtext">I’ve worked with several programming languages and frameworks through school and projects, and I’m continuously improving my understanding of them.</p>
          </div>
          <div className="absolute inset-y-0 md:inset-y-9 w-full h-full start-[50%] md:scale-125">
            <Frameworks />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

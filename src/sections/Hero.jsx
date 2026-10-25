import AvailabilityStatus from "../components/AvailabilityStatus";
import HeroText from "../components/HeroText";
import { useSiteSettings } from "../lib/siteSettings";

const Hero = () => {
  const { role, location } = useSiteSettings();
  const facts = [
    { label: "Role", value: role },
    { label: "Base", value: location },
    { label: "Stack", value: "React · Node · C# · Tailwind" },
  ];

  return (
    <section id="home" className="relative left-1/2 w-screen -translate-x-1/2 flex min-h-screen overflow-hidden">
      <span aria-hidden="true" className="hidden lg:block absolute left-6 top-24 h-4 w-4 border-l-2 border-t-2 border-line" />
      <span aria-hidden="true" className="hidden lg:block absolute right-6 top-24 h-4 w-4 border-r-2 border-t-2 border-accent" />

      <div className="c-space relative z-10 mx-auto flex w-full max-w-[1200px] flex-col justify-center pb-24 pt-36 md:pt-44">
        <HeroText />

        <dl className="mt-14 max-w-2xl border-t border-line pt-6 md:mt-20">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-wrap items-baseline gap-x-8 gap-y-1 border-b border-line py-2.5 last:border-0">
              <dt className="w-24 shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-stone/70">{fact.label}</dt>
              <dd className="font-mono text-sm text-ink">{fact.value}</dd>
            </div>
          ))}
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-1 py-2.5">
            <dt className="w-24 shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-stone/70">Status</dt>
            <dd>
              <AvailabilityStatus />
            </dd>
          </div>
        </dl>
      </div>

      <div className="absolute bottom-10 right-10 z-10 hidden items-center gap-3 lg:flex" aria-hidden="true">
        <span className="h-16 w-px bg-line" />
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone/70">scroll</span>
      </div>
    </section>
  );
};

export default Hero;
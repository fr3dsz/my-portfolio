import { useSiteSettings } from "../lib/siteSettings";

// "*word*" in the CMS standfirst renders as emphasis
const renderEmphasis = (text = "") =>
  text.split(/\*([^*]+)\*/g).map((part, index) =>
    index % 2 === 1 ? (
      <em key={index} className="text-ink">
        {part}
      </em>
    ) : (
      part
    )
  );

const HeroText = ({ code, standfirst }) => {
  const { name } = useSiteSettings();

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {code} / Index
      </p>
      <h1 className="mt-6 font-display font-normal text-ink" style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
        {name}
      </h1>
      <p className="mt-8 max-w-3xl font-display font-normal text-stone" style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)", lineHeight: 1.4 }}>
        {renderEmphasis(standfirst)}
      </p>
    </div>
  );
};

export default HeroText;